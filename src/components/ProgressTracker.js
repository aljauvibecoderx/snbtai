import React, { useState } from 'react';
import { useStudyProgress } from '../hooks/useStudyProgress';
import { silabusData, subjectMetadata } from '../data/silabus';
import StudyInsights from './StudyInsights';
import ErrorBoundary from './ErrorBoundary';
import { CheckCircle2, Circle, RotateCcw, Filter, BookOpen, Target, Award, BarChart3 } from 'lucide-react';

const ProgressTracker = ({ userId }) => {
  const { progress, loading, toggleCompletion, resetProgress, importProgress } = useStudyProgress(userId);
  const [filter, setFilter] = useState('all');
  const [expandedSubjects, setExpandedSubjects] = useState(new Set());
  const [showInsights, setShowInsights] = useState(false);

  if (loading) {
    return <ProgressSkeleton />;
  }

  if (!progress) {
    return <div className="text-center py-8 text-gray-500">Unable to load progress data</div>;
  }

  const toggleSubject = (subject) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subject)) {
      newExpanded.delete(subject);
    } else {
      newExpanded.add(subject);
    }
    setExpandedSubjects(newExpanded);
  };

  const getFilteredMaterials = (subject) => {
    const materials = silabusData.filter(item => item.subject === subject);
    
    if (filter === 'completed') {
      return materials.filter(item => 
        progress.subjects[subject]?.materials[item.id]?.completed
      );
    } else if (filter === 'incomplete') {
      return materials.filter(item => 
        !progress.subjects[subject]?.materials[item.id]?.completed
      );
    }
    
    return materials;
  };

  const subjects = [...new Set(silabusData.map(item => item.subject))];

  return (
    <ErrorBoundary>
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header - Mobile Optimized */}
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 px-2">SNBT Progress Tracker</h1>
          
          {/* Stats Container - Responsive Layout */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              {/* Circular Progress */}
              <div className="flex-shrink-0">
                <CircularProgress percentage={progress.totalProgress * 100} />
              </div>
              
              {/* Stats Grid - Mobile Responsive */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full sm:w-auto">
                <div className="text-center min-w-0">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 truncate">
                    {Object.keys(progress.subjects).length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Subjects</div>
                </div>
                <div className="text-center min-w-0">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 truncate">
                    {Object.values(progress.subjects).reduce((sum, s) => sum + s.completed, 0)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center min-w-0">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                    {Object.values(progress.subjects).reduce((sum, s) => sum + s.total, 0)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center">
          {/* Filter Buttons */}
          <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
            <FilterButton 
              active={filter === 'all'} 
              onClick={() => setFilter('all')}
            >
              All
            </FilterButton>
            <FilterButton 
              active={filter === 'completed'} 
              onClick={() => setFilter('completed')}
            >
              Completed
            </FilterButton>
            <FilterButton 
              active={filter === 'incomplete'} 
              onClick={() => setFilter('incomplete')}
            >
              Incomplete
            </FilterButton>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setShowInsights(!showInsights)}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                showInsights 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BarChart3 size={16} />
              <span className="hidden sm:inline">Analytics</span>
            </button>
            
            <button
              onClick={resetProgress}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Analytics View */}
        {showInsights && (
          <StudyInsights 
            progress={progress} 
            onImportProgress={importProgress}
          />
        )}

        {/* Subject Cards */}
        {!showInsights && (
          <div className="space-y-3 sm:space-y-4">
            {subjects.map(subject => {
              const subjectData = progress.subjects[subject];
              const filteredMaterials = getFilteredMaterials(subject);
              
              if (filteredMaterials.length === 0) return null;

              return (
                <SubjectCard
                  key={subject}
                  subject={subject}
                  subjectData={subjectData}
                  materials={filteredMaterials}
                  expanded={expandedSubjects.has(subject)}
                  onToggle={() => toggleSubject(subject)}
                  onMaterialToggle={toggleCompletion}
                  progress={progress}
                />
              );
            })}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

const SubjectCard = ({ subject, subjectData, materials, expanded, onToggle, onMaterialToggle, progress }) => {
  const progressPercentage = (subjectData?.progress || 0) * 100;
  const metadata = subjectMetadata[subject] || {};

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 sm:p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            {/* Icon */}
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-white flex-shrink-0"
              style={{ backgroundColor: metadata.color || '#6B7280' }}
            >
              <i className={metadata.icon || 'fas fa-book'} />
            </div>
            
            {/* Content */}
            <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                {metadata.name || subject.replace('_', ' ')}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{metadata.description}</p>
              
              {/* Progress Bar */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="w-20 sm:w-32 bg-gray-200 rounded-full h-2 flex-shrink-0">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${progressPercentage}%`,
                      backgroundColor: metadata.color || '#3B82F6'
                    }}
                  />
                </div>
                <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                  {subjectData?.completed || 0}/{subjectData?.total || 0}
                </span>
              </div>
            </div>
          </div>
          
          {/* Progress Percentage */}
          <div className="text-right flex-shrink-0">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              {Math.round(progressPercentage)}%
            </div>
            <div className="text-xs text-gray-500 font-medium">
              {metadata.code}
            </div>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 p-4 sm:p-6 space-y-2 sm:space-y-3">
          {materials.map(material => (
            <MaterialItem
              key={material.id}
              material={material}
              completed={progress.subjects[subject]?.materials[material.id]?.completed || false}
              onToggle={() => onMaterialToggle(material.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const MaterialItem = ({ material, completed, onToggle }) => {
  return (
    <div 
      className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 min-h-[48px] ${
        completed ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'
      }`}
      onClick={onToggle}
    >
      <div className="flex-shrink-0 mt-0.5">
        {completed ? (
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        ) : (
          <Circle className="w-5 h-5 text-gray-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`font-medium text-sm sm:text-base leading-tight ${
          completed ? 'text-green-900 line-through' : 'text-gray-900'
        }`}>
          {material.topic}
        </div>
        {material.subtopic && (
          <div className={`text-xs sm:text-sm mt-1 leading-tight ${
            completed ? 'text-green-700' : 'text-gray-600'
          }`}>
            {material.subtopic}
          </div>
        )}
      </div>
    </div>
  );
};

const CircularProgress = ({ percentage }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="text-blue-600 transition-all duration-300"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm sm:text-lg font-bold text-gray-900">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

const FilterButton = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap min-h-[40px] ${
      active 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {children}
  </button>
);

const ProgressSkeleton = () => (
  <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
    <div className="text-center space-y-3 sm:space-y-4">
      <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 sm:w-64 mx-auto animate-pulse" />
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full animate-pulse" />
          <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="text-center">
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-8 sm:w-16 mx-auto animate-pulse mb-2" />
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-12 sm:w-24 mx-auto animate-pulse" />
            </div>
            <div className="text-center">
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-8 sm:w-16 mx-auto animate-pulse mb-2" />
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-12 sm:w-24 mx-auto animate-pulse" />
            </div>
            <div className="text-center">
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-8 sm:w-16 mx-auto animate-pulse mb-2" />
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-12 sm:w-24 mx-auto animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="space-y-3">
          <div className="h-5 sm:h-6 bg-gray-200 rounded w-32 sm:w-48 animate-pulse" />
          <div className="h-2 bg-gray-200 rounded w-full animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

export default ProgressTracker;