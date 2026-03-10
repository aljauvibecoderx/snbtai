import React from 'react';
import { subjectMetadata } from '../data/silabus';
import { calculateStudyStats } from '../utils/progressUtils';
import ProgressActions from './ProgressActions';
import { TrendingUp, TrendingDown, Target, Award, BookOpen, AlertCircle } from 'lucide-react';

const StudyInsights = ({ progress, onImportProgress }) => {
  if (!progress) return null;

  const stats = calculateStudyStats(progress);
  if (!stats) return null;

  const getSubjectName = (subjectKey) => {
    return subjectMetadata[subjectKey]?.name || subjectKey.replace('_', ' ');
  };

  const getSubjectColor = (subjectKey) => {
    return subjectMetadata[subjectKey]?.color || '#6B7280';
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    if (stats.weakestSubject) {
      const weakestStats = stats.subjectStats[stats.weakestSubject];
      if (weakestStats.completionRate < 30) {
        recommendations.push({
          type: 'focus',
          icon: Target,
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          title: 'Focus Area Identified',
          message: `Consider spending more time on ${getSubjectName(stats.weakestSubject)} (${Math.round(weakestStats.completionRate)}% complete)`
        });
      }
    }

    if (stats.completionRate > 80) {
      recommendations.push({
        type: 'achievement',
        icon: Award,
        color: 'text-green-600',
        bg: 'bg-green-50',
        title: 'Excellent Progress!',
        message: `You're doing great with ${stats.completionRate}% overall completion`
      });
    }

    if (stats.completionRate < 20) {
      recommendations.push({
        type: 'motivation',
        icon: BookOpen,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        title: 'Getting Started',
        message: 'Set a daily goal to complete 2-3 materials per day for consistent progress'
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Study Analytics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.completionRate}%</div>
            <div className="text-sm text-gray-600">Overall Progress</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.completedMaterials}</div>
            <div className="text-sm text-gray-600">Materials Done</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.totalMaterials - stats.completedMaterials}</div>
            <div className="text-sm text-gray-600">Remaining</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{Object.keys(stats.subjectStats).length}</div>
            <div className="text-sm text-gray-600">Subjects</div>
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h3>
        
        <div className="space-y-3">
          {Object.entries(stats.subjectStats)
            .sort((a, b) => b[1].completionRate - a[1].completionRate)
            .map(([subject, data]) => (
              <div key={subject} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getSubjectColor(subject) }}
                  />
                  <span className="font-medium text-gray-900">
                    {getSubjectName(subject)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    {data.completed}/{data.total}
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${data.completionRate}%`,
                        backgroundColor: getSubjectColor(subject)
                      }}
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-900 w-12 text-right">
                    {Math.round(data.completionRate)}%
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
            Study Recommendations
          </h3>
          
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className={`p-4 rounded-lg ${rec.bg} border border-opacity-20`}>
                <div className="flex items-start space-x-3">
                  <rec.icon className={`w-5 h-5 mt-0.5 ${rec.color}`} />
                  <div>
                    <h4 className={`font-medium ${rec.color}`}>{rec.title}</h4>
                    <p className="text-sm text-gray-700 mt-1">{rec.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Highlights */}
      {(stats.strongestSubject || stats.weakestSubject) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.strongestSubject && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-900">Strongest Subject</h4>
              </div>
              <p className="text-green-800 font-medium">
                {getSubjectName(stats.strongestSubject)}
              </p>
              <p className="text-sm text-green-700 mt-1">
                {Math.round(stats.subjectStats[stats.strongestSubject].completionRate)}% completed - Keep up the great work!
              </p>
            </div>
          )}
          
          {stats.weakestSubject && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingDown className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold text-orange-900">Needs Attention</h4>
              </div>
              <p className="text-orange-800 font-medium">
                {getSubjectName(stats.weakestSubject)}
              </p>
              <p className="text-sm text-orange-700 mt-1">
                {Math.round(stats.subjectStats[stats.weakestSubject].completionRate)}% completed - Consider focusing here next
              </p>
            </div>
          )}
        </div>
      )}

      {/* Progress Management */}
      <ProgressActions 
        progress={progress} 
        onImportProgress={onImportProgress}
      />
    </div>
  );
};

export default StudyInsights;