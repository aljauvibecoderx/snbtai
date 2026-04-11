import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Clock, CheckCircle2, XCircle, Zap, Loader2,
  AlertCircle, Swords, BookOpen, ChevronDown, ChevronUp,
  Table, BarChart3, FileText, HelpCircle
} from 'lucide-react';
import { useBattleEngine, QUESTION_DURATION, getQuestionDuration } from '../../services/battleEngine';
import LatexWrapper from '../../utils/latex';
import SeamlessAudioPlayer from '../../components/SeamlessAudioPlayer';

// ─── ResizeObserver Error Handler ─────────────────────────────────────────────
const useResizeObserverErrorHandler = () => {
  const timeoutRef = useRef(null);

  const handleError = useCallback((event) => {
    // Debounce the error to prevent console spam
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      console.warn('ResizeObserver loop detected - this is a harmless warning');
    }, 100);
  }, []);

  useEffect(() => {
    // Override the default error handler for ResizeObserver
    const originalError = window.onerror;

    window.onerror = (message, source, lineno, colno, error) => {
      if (message && message.includes('ResizeObserver loop completed with undelivered notifications')) {
        handleError(error);
        return true; // Prevent the error from showing in console
      }

      if (originalError) {
        return originalError(message, source, lineno, colno, error);
      }

      return false;
    };

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.onerror = originalError;
    };
  }, [handleError]);
};

// ─── Interactive Demo Strip ──────────────────────────────────────────────────
const QuestionRepresentation = ({ representation }) => {
  if (!representation || representation.type === 'text' || !representation.data) {
    return null;
  }

  // Render table representation
  if (representation.type === 'table') {
    const tableData = representation.data;
    let headers = [];
    let rows = [];

    if (typeof tableData === 'string') {
      // Parse string table format
      const lines = tableData.trim().split('\n');
      if (lines.length > 0) {
        headers = lines[0].split('|').map(h => h.trim()).filter(h => h);
        rows = lines.slice(1).map(line => line.split('|').map(c => c.trim()).filter(c => c));
      }
    } else if (Array.isArray(tableData)) {
      // Handle array format
      if (tableData.length > 0) {
        if (Array.isArray(tableData[0])) {
          headers = tableData[0];
          rows = tableData.slice(1);
        } else if (tableData[0].headers && tableData[0].rows) {
          headers = tableData[0].headers;
          rows = tableData[0].rows;
        }
      }
    } else if (tableData.headers && Array.isArray(tableData.rows)) {
      // Handle object format
      headers = tableData.headers;
      rows = tableData.rows;
    }

    return (
      <div className="mb-6 p-4 lg:p-5 bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-indigo-200 rounded-full flex items-center justify-center">
            <Table size={12} className="text-indigo-700" />
          </div>
          <span className="text-xs lg:text-sm font-bold text-indigo-800 uppercase tracking-wide">Data Tabel</span>
        </div>
        <div className="pl-7 border-l-2 border-indigo-200">
          <table className="w-full text-xs lg:text-sm border-collapse">
            <thead>
              {headers.length > 0 && (
                <tr className="border-b-2 border-indigo-300">
                  {headers.map((header, i) => (
                    <th key={i} className="px-4 py-3 text-left font-bold text-indigo-900 bg-indigo-50">
                      <LatexWrapper text={header} />
                    </th>
                  ))}
                </tr>
              )}
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-indigo-100 last:border-b-0 hover:bg-indigo-50 transition-colors">
                  {Array.isArray(row) && row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3 text-slate-700 font-medium">
                      <LatexWrapper text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Render chart representation
  if (representation.type === 'chart') {
    const chartData = representation.data;
    let chartType = 'bar';
    let labels = [];
    let values = [];
    let title = 'Data Grafik';

    if (typeof chartData === 'string') {
      // Parse string chart format
      const lines = chartData.trim().split('\n');
      title = lines[0] || title;
      labels = lines[1]?.split(',').map(l => l.trim()) || [];
      values = lines[2]?.split(',').map(v => parseFloat(v.trim())) || [];
    } else if (Array.isArray(chartData)) {
      // Handle array format
      if (chartData.length > 0) {
        title = chartData[0]?.title || title;
        labels = chartData[0]?.labels || chartData[0]?.x || [];
        values = chartData[0]?.values || chartData[0]?.y || [];
        chartType = chartData[0]?.type || chartType;
      }
    } else if (chartData.labels && chartData.values) {
      // Handle object format
      title = chartData.title || title;
      labels = chartData.labels;
      values = chartData.values;
      chartType = chartData.type || chartType;
    }

    const maxValue = Math.max(...values, 1);

    return (
      <div className="mb-6 p-4 lg:p-5 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-emerald-200 rounded-full flex items-center justify-center">
            <BarChart3 size={12} className="text-emerald-700" />
          </div>
          <span className="text-xs lg:text-sm font-bold text-emerald-800 uppercase tracking-wide">{title}</span>
        </div>
        <div className="pl-7 border-l-2 border-emerald-200 space-y-3">
          {labels.map((label, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-28 lg:w-32 text-xs lg:text-sm text-slate-600 text-right flex-shrink-0 font-medium">
                <LatexWrapper text={label} />
              </div>
              <div className="flex-1 bg-emerald-100 rounded-full h-5 lg:h-6 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-green-500 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${(values[i] / maxValue) * 100}%` }}
                />
              </div>
              <div className="w-12 lg:w-16 text-xs lg:text-sm font-bold text-emerald-800 text-right flex-shrink-0">
                {values[i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render statement/list representation (Q and P type)
  if (representation.type === 'statement' || representation.type === 'list') {
    const statementData = representation.data;
    let statements = [];

    if (typeof statementData === 'string') {
      // Parse string format - each line is a statement
      statements = statementData.trim().split('\n').filter(s => s.trim());
    } else if (Array.isArray(statementData)) {
      statements = statementData;
    } else if (statementData.statements && Array.isArray(statementData.statements)) {
      statements = statementData.statements;
    }

    return (
      <div className="mb-6 p-4 lg:p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center">
            <FileText size={12} className="text-amber-700" />
          </div>
          <span className="text-xs lg:text-sm font-bold text-amber-800 uppercase tracking-wide">Pernyataan</span>
        </div>
        <div className="pl-7 border-l-2 border-amber-200 space-y-3">
          {statements.map((stmt, i) => (
            <div key={i} className="flex items-start gap-3 p-3 lg:p-4 bg-white rounded-lg border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
              <span className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 text-white text-xs lg:text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                {String.fromCharCode(65 + i)}
              </span>
              <p className="text-xs lg:text-sm text-amber-900 leading-relaxed flex-1 font-medium">
                <LatexWrapper text={typeof stmt === 'string' ? stmt : JSON.stringify(stmt)} />
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render grid_boolean (Hitung Benar) representation
  if (representation.type === 'grid_boolean') {
    const gridData = representation.data;
    let statements = [];

    if (typeof gridData === 'string') {
      statements = gridData.trim().split('\n').filter(s => s.trim());
    } else if (Array.isArray(gridData)) {
      statements = gridData;
    } else if (gridData.statements && Array.isArray(gridData.statements)) {
      statements = gridData.statements;
    }

    return (
      <div className="mb-6 p-4 lg:p-5 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-orange-200 rounded-full flex items-center justify-center">
            <FileText size={12} className="text-orange-700" />
          </div>
          <span className="text-xs lg:text-sm font-bold text-orange-800 uppercase tracking-wide">Pernyataan yang perlu dievaluasi</span>
        </div>
        <div className="pl-7 border-l-2 border-orange-200 space-y-3">
          {statements.map((stmt, i) => (
            <div key={i} className="flex items-start gap-3 p-3 lg:p-4 bg-white rounded-lg border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
              <span className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-400 text-white text-xs lg:text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                {i + 1}
              </span>
              <p className="text-xs lg:text-sm text-orange-900 leading-relaxed flex-1 font-medium">
                <LatexWrapper text={typeof stmt === 'string' ? stmt : JSON.stringify(stmt)} />
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t-2 border-orange-200 pl-7">
          <p className="text-xs lg:text-sm font-bold text-orange-800 bg-orange-100 px-3 py-2 rounded-lg inline-block">
            🎯 Berapa banyak pernyataan yang benar?
          </p>
        </div>
      </div>
    );
  }

  // Render image/diagram representation
  if (representation.type === 'image' || representation.type === 'diagram') {
    const imageData = representation.data;
    let imageUrl = '';
    let altText = 'Gambar/Diagram';

    if (typeof imageData === 'string') {
      imageUrl = imageData;
    } else if (imageData.url) {
      imageUrl = imageData.url;
      altText = imageData.alt || altText;
    }

    return (
      <div className="mb-6 p-4 lg:p-5 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-indigo-200 rounded-full flex items-center justify-center">
            <FileText size={12} className="text-indigo-700" />
          </div>
          <span className="text-xs lg:text-sm font-bold text-indigo-800 uppercase tracking-wide">Gambar/Diagram</span>
        </div>
        <div className="pl-7 border-l-2 border-indigo-200">
          {imageUrl ? (
            <div className="bg-white rounded-lg border border-indigo-100 p-2 shadow-sm">
              <img
                src={imageUrl}
                alt={altText}
                className="w-full h-auto rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="hidden p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <p className="text-xs text-indigo-600 font-medium">⚠️ Gambar tidak dapat dimuat</p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <p className="text-xs text-indigo-600 font-medium">⚠️ Tidak ada gambar tersedia</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render thread/relasi pernyataan representation
  if (representation.type === 'thread' || representation.type === 'relation') {
    const threadData = representation.data;
    let nodes = [];

    console.log('Thread/Relation: Raw data', threadData);

    if (typeof threadData === 'string') {
      nodes = threadData.trim().split('\n').filter(s => s.trim());
      console.log('Thread/Relation: Parsed from string', nodes);
    } else if (Array.isArray(threadData)) {
      nodes = threadData;
      console.log('Thread/Relation: Parsed from array', nodes);
    } else if (threadData.nodes && Array.isArray(threadData.nodes)) {
      nodes = threadData.nodes;
      console.log('Thread/Relation: Parsed from data.nodes', nodes);
    } else {
      console.log('Thread/Relation: Could not parse data, checking alternative fields');
      // Try alternative data structures
      if (threadData.posts && Array.isArray(threadData.posts)) {
        nodes = threadData.posts;
        console.log('Thread/Relation: Parsed from data.posts', nodes);
      } else if (threadData.statements && Array.isArray(threadData.statements)) {
        nodes = threadData.statements;
        console.log('Thread/Relation: Parsed from data.statements', nodes);
      } else if (threadData.items && Array.isArray(threadData.items)) {
        nodes = threadData.items;
        console.log('Thread/Relation: Parsed from data.items', nodes);
      }
    }

    console.log('Thread/Relation: Final nodes', nodes);
    console.log('Thread/Relation: Total posts to render:', nodes.length);

    return (
      <div className="mb-6 p-4 lg:p-5 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-purple-200 rounded-full flex items-center justify-center">
            <FileText size={12} className="text-purple-700" />
          </div>
          <span className="text-xs lg:text-sm font-bold text-purple-800 uppercase tracking-wide">Relasi Pernyataan</span>
        </div>
        <div className="pl-7 border-l-2 border-purple-200 space-y-3">
          {nodes.map((node, i) => {
            console.log(`Thread/Relation: Rendering post ${i + 1}/${nodes.length}`, node);
            return (
              <div key={i} className="relative">
                <div className="flex items-start gap-3 p-3 lg:p-4 bg-white rounded-lg border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                  <span className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white text-xs lg:text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    {/* Post Header with Author and Date */}
                    <div className="mb-2 pb-2 border-b border-purple-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-purple-600">👤</span>
                          </div>
                          <span className="text-xs lg:text-sm font-semibold text-purple-800">
                            {node.author ||
                              node.username ||
                              node.name ||
                              node.user ||
                              'Anonymous'}
                          </span>
                        </div>
                        <span className="text-xs text-purple-600 font-medium">
                          {node.date ||
                            node.timestamp ||
                            node.time ||
                            node.createdAt ||
                            new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {/* Post Content */}
                    <p className="text-xs lg:text-sm text-purple-900 leading-relaxed font-medium">
                      <LatexWrapper text={
                        typeof node === 'string' ? node :
                          node.text ||
                          node.content ||
                          node.body ||
                          node.message ||
                          node.description ||
                          JSON.stringify(node)
                      } />
                    </p>
                  </div>
                </div>
                {i < nodes.length - 1 && (
                  <div className="flex justify-center my-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-300 to-pink-300 rounded-full" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

// Helper to detect question type and render appropriately
const getQuestionType = (question) => {
  if (!question) return 'unknown';

  // Check representation type first
  if (question.representation?.type && question.representation.type !== 'text') {
    return question.representation.type;
  }

  // Check if grid_boolean type (multiple statements to evaluate) - check this first
  // Enhanced detection: check for representation data with array of statements
  const hasStatementData = question.representation?.data && (
    Array.isArray(question.representation.data) ||
    (typeof question.representation.data === 'string' && question.representation.data.includes('\n')) ||
    question.representation.data?.statements
  );

  if (question.representation?.type === 'grid_boolean' ||
    question.text?.toLowerCase().includes('berapa banyak pernyataan yang benar') ||
    (question.text?.toLowerCase().includes('pernyataan') && question.options?.length === 5) ||
    (hasStatementData && question.text?.toLowerCase().includes('pernyataan'))) {
    return 'grid_boolean';
  }

  // Check if boolean question (only 2 options, typically Benar/Salah or True/False)
  if (question.options?.length === 2) {
    const opts = question.options.map(o => o.toLowerCase());
    const hasTrue = opts.some(o => o.includes('benar') || o.includes('true') || o.includes('ya'));
    const hasFalse = opts.some(o => o.includes('salah') || o.includes('false') || o.includes('tidak'));
    if (hasTrue && hasFalse) {
      return 'boolean';
    }
  }

  // Check if statement question (text mentions "pernyataan")
  if (question.text?.toLowerCase().includes('pernyataan') ||
    question.stimulus?.toLowerCase().includes('pernyataan')) {
    return 'statement';
  }

  return 'text';
};

// ─── Grid Boolean Evaluator Component ───────────────────────────────────────
const GridBooleanEvaluator = ({ currentQuestion, myAnswerIndex, hasMyAnswer, handleAnswerSubmit, phase }) => {
  const [answers, setAnswers] = React.useState({});

  // Parse statements from representation data
  const getStatements = () => {
    const data = currentQuestion.representation?.data;
    if (!data) {
      console.log('GridBoolean: No data found', currentQuestion.representation);
      return [];
    }

    console.log('GridBoolean: Raw data', data);

    if (typeof data === 'string') {
      const statements = data.trim().split('\n').filter(s => s.trim());
      console.log('GridBoolean: Parsed statements from string', statements);
      return statements;
    } else if (Array.isArray(data)) {
      console.log('GridBoolean: Parsed statements from array', data);
      return data;
    } else if (data.statements && Array.isArray(data.statements)) {
      console.log('GridBoolean: Parsed statements from data.statements', data.statements);
      return data.statements;
    }

    console.log('GridBoolean: Could not parse statements, returning empty array');
    return [];
  };

  const statements = getStatements();

  const handleStatementAnswer = (statementIndex, isTrue) => {
    if (hasMyAnswer || phase !== 'playing') return;

    const newAnswers = { ...answers, [statementIndex]: isTrue };
    setAnswers(newAnswers);

    // Convert to single answer format for compatibility
    const trueCount = Object.values(newAnswers).filter(Boolean).length;
    handleAnswerSubmit(trueCount);
  };

  const getStatementStatus = (index) => {
    if (!hasMyAnswer) return 'unanswered';

    const userAnswer = answers[index];
    const isCorrect = userAnswer === true; // Assume all statements should be evaluated individually

    if (userAnswer === undefined) return 'unanswered';
    return isCorrect ? 'correct' : 'incorrect';
  };

  return (
    <div className="space-y-3">
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700">Pernyataan</th>
              <th className="text-center py-2 px-3 text-sm font-semibold text-slate-700 w-20">Benar</th>
              <th className="text-center py-2 px-3 text-sm font-semibold text-slate-700 w-20">Salah</th>
            </tr>
          </thead>
          <tbody>
            {statements.map((statement, index) => {
              const status = getStatementStatus(index);
              const isSelected = answers[index] === true;
              const isFalseSelected = answers[index] === false;

              return (
                <tr key={index} className="border-b border-slate-100 last:border-b-0">
                  <td className="py-3 px-3 text-sm text-slate-700">
                    <span className="font-medium">{index + 1}.</span> {statement}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => handleStatementAnswer(index, true)}
                      disabled={hasMyAnswer || phase !== 'playing'}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${isSelected && status === 'correct'
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : isSelected && status === 'incorrect'
                            ? 'bg-red-500 border-red-500 text-white'
                            : isSelected
                              ? 'bg-slate-200 border-slate-300 text-slate-600'
                              : 'bg-white border-slate-300 text-slate-400 hover:border-emerald-400 hover:text-emerald-600'
                        } disabled:cursor-default disabled:opacity-50`}
                    >
                      ✓
                    </button>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => handleStatementAnswer(index, false)}
                      disabled={hasMyAnswer || phase !== 'playing'}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${isFalseSelected && status === 'correct'
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : isFalseSelected && status === 'incorrect'
                            ? 'bg-red-500 border-red-500 text-white'
                            : isFalseSelected
                              ? 'bg-slate-200 border-slate-300 text-slate-600'
                              : 'bg-white border-slate-300 text-slate-400 hover:border-red-400 hover:text-red-600'
                        } disabled:cursor-default disabled:opacity-50`}
                    >
                      ✗
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!hasMyAnswer && Object.keys(answers).length === 0 && (
        <p className="text-xs text-slate-500 text-center">
          Evaluasi setiap pernyataan dengan memilih Benar atau Salah
        </p>
      )}

      {hasMyAnswer && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <p className="text-sm text-slate-600 text-center">
            Jawaban Anda: <span className="font-semibold">{Object.values(answers).filter(Boolean).length}</span> pernyataan benar
          </p>
        </div>
      )}
    </div>
  );
};

// ─── Boolean Evaluator Component ───────────────────────────────────────────
const BooleanEvaluator = ({ currentQuestion, myAnswerIndex, hasMyAnswer, handleAnswerSubmit, phase }) => {
  const [selectedAnswer, setSelectedAnswer] = React.useState(null);

  const handleBooleanAnswer = (isTrue) => {
    if (hasMyAnswer || phase !== 'playing') return;

    setSelectedAnswer(isTrue);
    // Convert to option index (0 for Benar/True, 1 for Salah/False)
    const optionIndex = isTrue ? 0 : 1;
    handleAnswerSubmit(optionIndex);
  };

  const getButtonClass = (isTrue) => {
    const isSelected = selectedAnswer === isTrue;
    const isCorrect = myAnswerIndex === currentQuestion.correctIndex;
    const actuallyCorrect = isTrue ? (currentQuestion.correctIndex === 0) : (currentQuestion.correctIndex === 1);

    if (!hasMyAnswer) {
      return `w-full py-3 px-4 rounded-xl border-2 transition-all font-semibold ${isSelected
          ? 'bg-violet-100 border-violet-500 text-violet-700'
          : 'bg-white border-slate-300 text-slate-700 hover:border-violet-300 hover:bg-violet-50'
        }`;
    }

    if (actuallyCorrect) {
      return 'w-full py-3 px-4 rounded-xl border-2 bg-emerald-100 border-emerald-500 text-emerald-700 font-semibold';
    } else if (isSelected && !actuallyCorrect) {
      return 'w-full py-3 px-4 rounded-xl border-2 bg-red-100 border-red-500 text-red-700 font-semibold';
    } else {
      return 'w-full py-3 px-4 rounded-xl border-2 bg-slate-50 border-slate-200 text-slate-400 font-semibold opacity-60';
    }
  };

  return (
    <div className="space-y-3">
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <p className="text-sm text-slate-600 mb-4 text-center">Pilih jawaban yang benar:</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleBooleanAnswer(true)}
            disabled={hasMyAnswer || phase !== 'playing'}
            className={getButtonClass(true)}
          >
            ✓ Benar
          </button>
          <button
            onClick={() => handleBooleanAnswer(false)}
            disabled={hasMyAnswer || phase !== 'playing'}
            className={getButtonClass(false)}
          >
            ✗ Salah
          </button>
        </div>
      </div>

      {hasMyAnswer && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <p className="text-sm text-slate-600 text-center">
            Jawaban Anda: <span className="font-semibold">{selectedAnswer ? 'Benar' : 'Salah'}</span>
          </p>
        </div>
      )}
    </div>
  );
};

const LiveBattle = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();
  const roomId = params.roomId || window.location.pathname.split('/').pop() || sessionStorage.getItem('battle_room');

  // Handle ResizeObserver errors
  useResizeObserverErrorHandler();

  // --- 1. Engine Injection (Centralized Server Logic) ---
  const {
    room,
    loading,
    error,
    phase,
    countdown,
    timeLeft,
    showExplanation,
    setShowExplanation,
    myPlayer,
    opponent,
    questions,
    currentIndex,
    currentQuestion,
    hasMyAnswer,
    hasOpponentAnswer,
    handleAnswerSubmit
  } = useBattleEngine(roomId, user);

  // --- Handle Redirects in useEffect to avoid setState during render warning ---
  useEffect(() => {
    if (room && room.status === 'finished') {
      navigate(`/ambis-battle/result/${roomId}`);
    }
  }, [room, roomId, navigate]);

  // --- Error Boundaries ---
  if (room?.status === 'finished') {
    return null; // Return null while redirect happens in useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin mx-auto mb-3 text-violet-600" />
          <p className="text-slate-500 text-sm">Engine menyinkronkan data...</p>
        </div>
      </div>
    );
  }

  if (!room || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-3" />
          <p className="text-slate-800 font-semibold mb-4">{error || 'Room tidak ditemukan'}</p>
          <button onClick={() => navigate('/ambis-battle')} className="text-violet-600 underline font-medium text-sm">
            Kembali ke Lobby
          </button>
        </div>
      </div>
    );
  }

  // --- Derived UI State ---
  const myAnswerIndex = myPlayer?.answers?.[currentIndex]?.answerIndex;
  const isCorrect = myAnswerIndex === currentQuestion?.correctIndex;
  const myScore = myPlayer?.score || 0;
  const opponentScore = opponent?.score || 0;

  const currentQuestionDuration = getQuestionDuration(currentQuestion);
  const timerPercent = (timeLeft / currentQuestionDuration) * 100;
  const timerColor = timeLeft > 15 ? 'bg-emerald-500' : timeLeft > 7 ? 'bg-amber-400' : 'bg-red-500';

  // --- Shared Audio Player - Seamless Across Phases ---
  const audioPlayer = (
    <div className="fixed top-4 right-4 z-50">
      <SeamlessAudioPlayer
        src="https://audio.jukehost.co.uk/0II8jxAjfhGHNaBaHUNOGgGrRuAcoqRy"
        shouldPlay={phase === 'countdown' || phase === 'playing'}
      />
    </div>
  );

  // --- Countdown View Phase ---
  if (phase === 'countdown') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative">
        {audioPlayer}

        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-violet-500/20">
            <span className="text-5xl font-black text-white">{countdown || 0}</span>
          </div>
          <p className="text-slate-500 font-semibold text-sm uppercase tracking-widest">Persiapan Soal...</p>
        </div>
      </div>
    );
  }

  // --- Battle Playing Phase ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {audioPlayer}

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      {/* Desktop: Full-width Header */}
      <div className="hidden lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-4 lg:bg-white lg:border-b lg:border-slate-200 lg:sticky lg:top-0 lg:z-50">
        {/* Timer */}
        <div className="flex items-center gap-3">
          <Clock size={20} className={timeLeft <= 7 ? 'text-red-500' : 'text-slate-500'} />
          <span className={`text-lg font-bold ${timeLeft <= 7 ? 'text-red-500' : 'text-slate-700'}`}>
            {timeLeft}s
          </span>
        </div>

        {/* Score Board */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center text-sm font-bold text-violet-700">
              {myPlayer?.name?.[0]?.toUpperCase() || 'M'}
            </div>
            <div>
              <p className="text-xs text-slate-500">{myPlayer?.name || 'Kamu'}</p>
              <p className="text-xl font-black text-slate-800">{myScore}</p>
            </div>
          </div>
          <Swords size={24} className="text-slate-300" />
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs text-slate-500 text-right">{opponent?.name || 'Lawan'}</p>
              <p className="text-xl font-black text-slate-800">{opponentScore}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700">
              {opponent?.name?.[0]?.toUpperCase() || '?'}
            </div>
          </div>
        </div>

        {/* Question Counter */}
        <span className="text-sm font-medium text-slate-500">
          {currentIndex + 1}/{questions.length}
        </span>
      </div>

      {/* Mobile: Original Layout */}
      <div className="lg:hidden relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full px-4 pt-14 pb-6">

        {/* -- UI: Scores Board -- */}
        <div className="flex items-center gap-2 mb-3">
          {/* P1 */}
          <div className="flex-1 bg-white border border-slate-200 shadow-sm rounded-xl p-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-violet-700">
              {myPlayer?.name?.[0]?.toUpperCase() || 'M'}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 truncate">{myPlayer?.name || 'Kamu'}</p>
              <p className="text-lg font-black text-slate-800 leading-none">{myScore}</p>
            </div>
            {hasMyAnswer && <CheckCircle2 size={16} className="text-emerald-500 ml-auto flex-shrink-0" />}
          </div>

          <div className="flex flex-col items-center flex-shrink-0 px-2">
            <Swords size={24} className="text-slate-300" />
            <span className="text-xs font-bold text-slate-400 mt-1">VS</span>
          </div>

          {/* P2 */}
          <div className="flex-1 bg-white border border-slate-200 shadow-sm rounded-xl p-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-indigo-700">
              {opponent?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0 text-right w-full">
              <p className="text-xs text-slate-500 truncate">{opponent?.name || 'Lawan'}</p>
              <p className="text-lg font-black text-slate-800 leading-none">{opponentScore}</p>
            </div>
            {hasOpponentAnswer && <CheckCircle2 size={16} className="text-emerald-500 ml-auto flex-shrink-0" />}
          </div>
        </div>

        {/* -- UI: Server Synchronized Timer -- */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl px-3 py-2 mb-3 flex items-center gap-3">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Clock size={12} className={timeLeft <= 7 ? 'text-red-500' : 'text-slate-500'} />
            <span className={`text-sm font-bold ${timeLeft <= 7 ? 'text-red-500' : 'text-slate-700'}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${timerColor}`}
              style={{ width: `${Math.max(0, timerPercent)}%` }}
            />
          </div>
          <span className="text-xs font-medium text-slate-500 flex-shrink-0">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>

        {/* -- UI: Question Context & Text (With LaTeX) -- */}
        {currentQuestion && (
          <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-4 mb-4 flex-1 overflow-y-auto min-h-32 lg:hidden">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-violet-700 bg-violet-100 px-2.5 py-1 rounded-full border border-violet-200">
                  {currentQuestion.subtest || 'SNBT'}
                </span>
                {/* Question Type Badge */}
                {(() => {
                  const qType = getQuestionType(currentQuestion);
                  if (qType === 'table') return (
                    <span className="text-xs font-medium text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Table size={10} /> Tabel
                    </span>
                  );
                  if (qType === 'chart') return (
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <BarChart3 size={10} /> Grafik
                    </span>
                  );
                  if (qType === 'boolean') return (
                    <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <HelpCircle size={10} /> Benar/Salah
                    </span>
                  );
                  if (qType === 'grid_boolean') return (
                    <span className="text-xs font-medium text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <FileText size={10} /> Hitung Benar
                    </span>
                  );
                  if (qType === 'statement') return (
                    <span className="text-xs font-medium text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <FileText size={10} /> Pernyataan
                    </span>
                  );
                  return null;
                })()}
              </div>
              {currentQuestion.difficulty && (
                <span className="text-xs text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full">
                  Level: {currentQuestion.difficulty}
                </span>
              )}
            </div>

            {/* Stimulus Section */}
            {currentQuestion.stimulus && (
              <div className="mb-8 p-5 lg:p-6 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-sm font-bold text-purple-700">📄</span>
                  </div>
                  <p className="text-sm font-bold text-purple-800 uppercase tracking-wider">Stimulus</p>
                </div>
                <div className="pl-8 border-l-3 border-purple-200 space-y-4">
                  {currentQuestion.stimulus.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-base text-slate-700 leading-loose font-medium">
                      <LatexWrapper text={paragraph.trim()} />
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Representation Section (Table, Chart, Statement) */}
            <QuestionRepresentation representation={currentQuestion.representation} />

            {/* Question Text */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-violet-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-violet-700">❓</span>
                </div>
                <p className="text-xs font-bold text-violet-800 uppercase tracking-wide">Pertanyaan</p>
              </div>
              <div className="pl-7 border-l-2 border-violet-200">
                <p className="text-sm text-slate-800 leading-relaxed font-semibold">
                  <LatexWrapper text={currentQuestion.text || ''} />
                </p>
              </div>
            </div>
          </div>
        )}

        {/* -- UI: Interactive Options (With LaTeX) -- */}
        {currentQuestion && (
          <div className="space-y-2 mb-4 lg:hidden">
            {/* Debug info for developers - remove in production */}
            {(!currentQuestion.options || currentQuestion.options.length === 0) && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700 font-semibold mb-2">⚠️ Opsi jawaban tidak tersedia</p>
                <p className="text-xs text-red-600">Tipe soal: {getQuestionType(currentQuestion)}</p>
                <p className="text-xs text-red-600">ID Soal: {currentQuestion.id || 'N/A'}</p>
                <p className="text-xs text-red-600">Subtes: {currentQuestion.subtest || 'N/A'}</p>
              </div>
            )}

            {/* Standard options rendering */}
            {currentQuestion.options && currentQuestion.options.length > 0 ? (
              currentQuestion.options.map((option, i) => {
                const isSelected = myAnswerIndex === i;
                const isActuallyCorrect = i === currentQuestion.correctIndex;
                const isMissed = myAnswerIndex === -1 && isActuallyCorrect;
                // Wait for answer explicitly to reveal the truth
                const revealStatus = hasMyAnswer;

                let btnClass = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-[0.98]';
                if (revealStatus) {
                  if (isActuallyCorrect) {
                    btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-800';
                  } else if (isSelected && !isActuallyCorrect) {
                    btnClass = 'bg-red-50 border-red-500 text-red-800';
                  } else {
                    btnClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswerSubmit(i)}
                    disabled={hasMyAnswer || phase !== 'playing'}
                    className={`w-full text-left border rounded-xl p-3.5 transition-all flex items-center gap-3 ${btnClass} disabled:cursor-default`}
                  >
                    <div className="flex-1 text-sm leading-snug">
                      <LatexWrapper text={option || ''} />
                    </div>
                    {revealStatus && isActuallyCorrect && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
                    {revealStatus && isSelected && !isActuallyCorrect && <XCircle size={16} className="text-red-500 shrink-0" />}
                  </button>
                );
              })
            ) : (
              /* Fallback for missing options */
              <div className="p-4 bg-slate-100 border border-slate-300 rounded-xl text-center">
                <p className="text-sm text-slate-600 mb-2">Tidak ada opsi jawaban untuk soal ini.</p>
                <button
                  onClick={() => {
                    console.error('Question with missing options:', currentQuestion);
                    alert('Error: Opsi jawaban tidak ditemukan. Lihat console untuk detail.');
                  }}
                  className="text-xs text-indigo-600 underline"
                >
                  Lihat Detail Error
                </button>
              </div>
            )}
          </div>
        )}

        {/* -- UI: Post-Answer Feedback Block -- */}
        {hasMyAnswer && currentQuestion && (
          <div className="space-y-2 mt-auto animate-in fade-in slide-in-from-bottom-2 duration-300 lg:hidden">
            <div className={`rounded-xl p-3 border shadow-sm ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
              }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <><Zap size={16} className="text-emerald-600" />
                      <span className="text-sm font-bold text-emerald-700">Tepat Sekali!</span></>
                  ) : myAnswerIndex === -1 ? (
                    <><Clock size={16} className="text-red-500" />
                      <span className="text-sm font-bold text-red-700">Waktu Habis!</span></>
                  ) : (
                    <><XCircle size={16} className="text-red-500" />
                      <span className="text-sm font-bold text-red-700">Salah Jawaban!</span></>
                  )}
                </div>

                {/* View Explanation Button Requirement Met */}
                {currentQuestion.explanation && (
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
                  >
                    <BookOpen size={12} />
                    {showExplanation ? 'Tutup Pembahasan' : 'Lihat Pembahasan'}
                  </button>
                )}
              </div>

              {showExplanation && currentQuestion.explanation && (
                <div className="mt-3 pt-3 border-t border-slate-200/60 transition-all">
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    <LatexWrapper text={currentQuestion.explanation} />
                  </p>
                </div>
              )}
            </div>
            <p className="text-xs font-medium text-slate-400 text-center animate-pulse">
              Mensinkronisasi untuk memuat soal berikutnya...
            </p>
          </div>
        )}
      </div>

      {/* Desktop: Split Panel Fixed Layout */}
      <div className="hidden lg:flex lg:h-screen lg:overflow-hidden">
        {/* Left Panel: Scrollable Content (60%) */}
        <div className="lg:w-3/5 lg:h-full lg:overflow-y-auto lg:p-8 lg:border-r lg:border-slate-200 lg:bg-white">
          {currentQuestion && (
            <div className="space-y-6">
              {/* Header with Subtest and Type */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm lg:text-base font-semibold text-violet-700 bg-violet-100 px-3 py-1.5 rounded-full border border-violet-200">
                    {currentQuestion.subtest || 'SNBT'}
                  </span>
                  {/* Question Type Badge */}
                  {(() => {
                    const qType = getQuestionType(currentQuestion);
                    if (qType === 'table') return (
                      <span className="text-sm lg:text-base font-medium text-indigo-700 bg-indigo-100 px-3 py-1.5 rounded-full flex items-center gap-2">
                        <Table size={16} /> Tabel
                      </span>
                    );
                    if (qType === 'chart') return (
                      <span className="text-sm lg:text-base font-medium text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full flex items-center gap-2">
                        <BarChart3 size={16} /> Grafik
                      </span>
                    );
                    if (qType === 'boolean') return (
                      <span className="text-sm lg:text-base font-medium text-amber-700 bg-amber-100 px-3 py-1.5 rounded-full flex items-center gap-2">
                        <HelpCircle size={16} /> Benar/Salah
                      </span>
                    );
                    if (qType === 'grid_boolean') return (
                      <span className="text-sm lg:text-base font-medium text-orange-700 bg-orange-100 px-3 py-1.5 rounded-full flex items-center gap-2">
                        <FileText size={16} /> Hitung Benar
                      </span>
                    );
                    if (qType === 'statement') return (
                      <span className="text-sm lg:text-base font-medium text-rose-700 bg-rose-100 px-3 py-1.5 rounded-full flex items-center gap-2">
                        <FileText size={16} /> Pernyataan
                      </span>
                    );
                    return null;
                  })()}
                </div>
                {currentQuestion.difficulty && (
                  <span className="text-sm lg:text-base text-slate-500 border border-slate-200 px-3 py-1.5 rounded-full">
                    Level: {currentQuestion.difficulty}
                  </span>
                )}
              </div>

              {/* Stimulus Section */}
              {currentQuestion.stimulus && (
                <div className="p-5 lg:p-7 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-sm font-bold text-purple-700">📄</span>
                    </div>
                    <p className="text-sm lg:text-base font-bold text-purple-800 uppercase tracking-wider">Stimulus</p>
                  </div>
                  <div className="pl-8 border-l-3 border-purple-200 space-y-4">
                    {currentQuestion.stimulus.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-base lg:text-lg text-slate-700 leading-loose font-medium">
                        <LatexWrapper text={paragraph.trim()} />
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Representation Section (Table, Chart, Statement) */}
              <QuestionRepresentation representation={currentQuestion.representation} />
            </div>
          )}
        </div>

        {/* Right Panel: Fixed Question & Options (40%) */}
        <div className="lg:w-2/5 lg:h-full lg:overflow-y-auto lg:p-8 lg:bg-slate-50 lg:flex lg:flex-col">
          {currentQuestion && (
            <div className="lg:flex lg:flex-col lg:h-full lg:space-y-4">
              {/* Sticky Question Header */}
              <div className="lg:sticky lg:top-0 lg:bg-slate-50 lg:pb-4 lg:-mx-8 lg:px-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 bg-violet-200 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-sm font-bold text-violet-700">❓</span>
                  </div>
                  <p className="text-sm lg:text-base font-bold text-violet-800 uppercase tracking-wider">Pertanyaan</p>
                </div>
                <div className="pl-8 border-l-3 border-violet-200">
                  <p className="text-base lg:text-lg text-slate-800 leading-loose font-semibold">
                    <LatexWrapper text={currentQuestion.text || ''} />
                  </p>
                </div>
              </div>

              {/* Scrollable Options Container */}
              <div className="lg:flex-1 lg:overflow-y-auto lg:space-y-4">
                {/* Debug info for developers - remove in production */}
                {(!currentQuestion.options || currentQuestion.options.length === 0) && (
                  <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-700 font-medium">Debug: No options found</p>
                    <p className="text-xs text-red-600 mt-1">Question: {currentQuestion.text}</p>
                  </div>
                )}

                {/* Special handling for grid_boolean questions */}
                {getQuestionType(currentQuestion) === 'grid_boolean' && (
                  <div className="p-4 lg:p-6 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm lg:text-base font-semibold text-amber-800 mb-3">📋 Pernyataan yang perlu dievaluasi:</p>
                    <div className="text-sm lg:text-base text-amber-900 whitespace-pre-wrap leading-relaxed mb-4">
                      {typeof currentQuestion.representation.data === 'string'
                        ? currentQuestion.representation.data
                        : JSON.stringify(currentQuestion.representation.data, null, 2)}
                    </div>
                    <p className="text-sm lg:text-base font-semibold text-amber-800 mb-3">
                      Berapa banyak pernyataan yang benar?
                    </p>
                  </div>
                )}

                {/* Custom boolean evaluation interfaces */}
                {getQuestionType(currentQuestion) === 'grid_boolean' ? (
                  <GridBooleanEvaluator
                    currentQuestion={currentQuestion}
                    myAnswerIndex={myAnswerIndex}
                    hasMyAnswer={hasMyAnswer}
                    handleAnswerSubmit={handleAnswerSubmit}
                    phase={phase}
                  />
                ) : getQuestionType(currentQuestion) === 'boolean' ? (
                  <BooleanEvaluator
                    currentQuestion={currentQuestion}
                    myAnswerIndex={myAnswerIndex}
                    hasMyAnswer={hasMyAnswer}
                    handleAnswerSubmit={handleAnswerSubmit}
                    phase={phase}
                  />
                ) : (
                  /* Standard options rendering for other question types */
                  currentQuestion.options && currentQuestion.options.length > 0 ? (
                    currentQuestion.options.map((option, i) => {
                      const isSelected = myAnswerIndex === i;
                      const isActuallyCorrect = i === currentQuestion.correctIndex;
                      const isMissed = myAnswerIndex === -1 && isActuallyCorrect;
                      const revealStatus = hasMyAnswer;

                      let btnClass = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-[0.98]';
                      if (revealStatus) {
                        if (isActuallyCorrect) {
                          btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-800';
                        } else if (isSelected && !isActuallyCorrect) {
                          btnClass = 'bg-red-50 border-red-500 text-red-800';
                        } else {
                          btnClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => handleAnswerSubmit(i)}
                          disabled={hasMyAnswer || phase !== 'playing'}
                          className={`w-full text-left border rounded-xl p-4 lg:p-6 min-h-[60px] transition-all flex items-center gap-3 lg:gap-4 text-sm lg:text-base ${btnClass} disabled:cursor-default`}
                        >
                          <div className="flex-1 leading-snug">
                            <LatexWrapper text={option || ''} />
                          </div>
                          {revealStatus && isActuallyCorrect && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
                          {revealStatus && isSelected && !isActuallyCorrect && <XCircle size={16} className="text-red-500 shrink-0" />}
                        </button>
                      );
                    })
                  ) : (
                    /* Fallback for missing options */
                    <div className="p-4 bg-slate-100 border border-slate-300 rounded-xl text-center">
                      <p className="text-base text-slate-600 mb-3">Tidak ada opsi jawaban untuk soal ini.</p>
                      <button
                        onClick={() => {
                          console.error('Question with missing options:', currentQuestion);
                          alert('Error: Opsi jawaban tidak ditemukan. Lihat console untuk detail.');
                        }}
                        className="text-xs text-slate-500 underline"
                      >
                        Debug Info
                      </button>
                    </div>
                  )
                )}
              </div>

              {/* Sticky Feedback Section */}
              {hasMyAnswer && (
                <div className="lg:sticky lg:bottom-0 lg:bg-slate-50 lg:pt-4 lg:-mx-8 lg:px-8">
                  <div className={`rounded-xl p-4 lg:p-6 border shadow-sm ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                    }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 lg:gap-3">
                        {isCorrect ? (
                          <><CheckCircle2 size={20} className="text-emerald-500" />
                            <span className="text-sm lg:text-base font-bold text-emerald-700">Tepat Sekali!</span></>
                        ) : myAnswerIndex === -1 ? (
                          <><Clock size={20} className="text-red-500" />
                            <span className="text-sm lg:text-base font-bold text-red-700">Waktu Habis!</span></>
                        ) : (
                          <><XCircle size={20} className="text-red-500" />
                            <span className="text-sm lg:text-base font-bold text-red-700">Salah Jawaban!</span></>
                        )}
                      </div>

                      {/* View Explanation Button */}
                      {currentQuestion.explanation && (
                        <button
                          onClick={() => setShowExplanation(!showExplanation)}
                          className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm lg:text-base font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
                        >
                          <BookOpen size={14} />
                          {showExplanation ? 'Tutup Pembahasan' : 'Lihat Pembahasan'}
                        </button>
                      )}
                    </div>

                    {showExplanation && currentQuestion.explanation && (
                      <div className="mt-4 pt-4 border-t border-slate-200/60 transition-all">
                        <p className="text-sm lg:text-base text-slate-700 leading-relaxed font-medium">
                          <LatexWrapper text={currentQuestion.explanation} />
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveBattle;
