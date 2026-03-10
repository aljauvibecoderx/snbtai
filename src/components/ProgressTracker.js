import React, { useState } from 'react';
import { useStudyProgress } from '../hooks/useStudyProgress';
import { silabusData } from '../data/silabus';
import { CheckCircle2, Circle, RotateCcw, Filter } from 'lucide-react';

const ProgressTracker = ({ userId }) => {
  const { progress, loading, toggleCompletion, resetProgress } = useStudyProgress(userId);
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'incomplete'
  const [expandedSubjects, setExpandedSubjects] = useState(new Set());

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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">SNBT Progress Tracker</h1>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-center space-x-4">
            <div className="relative w-24 h-24">
              <CircularProgress percentage={progress.totalProgress * 100} />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(progress.totalProgress * 100)}%
              </div>
              <div className="text-gray-600">Total Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
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
        
        <button
          onClick={resetProgress}
          className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
      </div>

      {/* Subject Cards */}
      <div className="space-y-4">
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
    </div>
  );
};

const SubjectCard = ({ subject, subjectData, materials, expanded, onToggle, onMaterialToggle, progress }) => {
  const progressPercentage = (subjectData?.progress || 0) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 capitalize">
              {subject.replace('_', ' ')}
            </h3>
            <div className="flex items-center space-x-4">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">
                {subjectData?.completed || 0}/{subjectData?.total || 0}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(progressPercentage)}%
            </div>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 p-6 space-y-3">
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
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        completed ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'
      }`}
      onClick={onToggle}
    >
      <div className="flex-shrink-0">
        {completed ? (
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        ) : (
          <Circle className="w-5 h-5 text-gray-400" />
        )}
      </div>
      <div className="flex-1">
        <div className={`font-medium ${completed ? 'text-green-900 line-through' : 'text-gray-900'}`}>
          {material.topic}
        </div>
        {material.subtopic && (
          <div className={`text-sm ${completed ? 'text-green-700' : 'text-gray-600'}`}>
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
    <div className="relative">
      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 80 80">
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
        <span className="text-lg font-bold text-gray-900">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

const FilterButton = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
      active 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {children}
  </button>
);

const ProgressSkeleton = () => (
  <div className="max-w-4xl mx-auto p-6 space-y-6">
    <div className="text-center space-y-4">
      <div className="h-8 bg-gray-200 rounded w-64 mx-auto animate-pulse" />
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center space-x-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
    
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
          <div className="h-2 bg-gray-200 rounded w-full animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

export default ProgressTracker;