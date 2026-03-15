import React, { useState } from 'react';
import { exportProgress, importProgress } from '../utils/progressUtils';
import { Download, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const ProgressActions = ({ progress, onImportProgress }) => {
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  const handleExport = () => {
    if (!progress) return;
    
    try {
      exportProgress(progress);
      setImportStatus({
        type: 'success',
        message: 'Progress data exported successfully!'
      });
      
      setTimeout(() => setImportStatus(null), 3000);
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: 'Failed to export progress data'
      });
      
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImporting(true);
    setImportStatus(null);

    try {
      const importedProgress = await importProgress(file);
      
      // Validate imported data structure
      if (!importedProgress.subjects || !importedProgress.totalProgress) {
        throw new Error('Invalid progress file format');
      }

      await onImportProgress(importedProgress);
      
      setImportStatus({
        type: 'success',
        message: 'Progress data imported successfully!'
      });
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: error.message || 'Failed to import progress data'
      });
    } finally {
      setImporting(false);
      event.target.value = ''; // Reset file input
      setTimeout(() => setImportStatus(null), 5000);
    }
  };

  const getProgressSummary = () => {
    if (!progress) return null;

    const totalMaterials = Object.values(progress.subjects).reduce((sum, s) => sum + s.total, 0);
    const completedMaterials = Object.values(progress.subjects).reduce((sum, s) => sum + s.completed, 0);
    const lastUpdated = progress.lastUpdated ? new Date(progress.lastUpdated.seconds * 1000) : new Date();

    return {
      totalMaterials,
      completedMaterials,
      completionRate: Math.round((completedMaterials / totalMaterials) * 100),
      lastUpdated: lastUpdated.toLocaleDateString()
    };
  };

  const summary = getProgressSummary();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-blue-600" />
        Progress Management
      </h3>

      {/* Progress Summary */}
      {summary && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Current Progress Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Completion:</span>
              <div className="font-semibold text-blue-600">{summary.completionRate}%</div>
            </div>
            <div>
              <span className="text-gray-600">Completed:</span>
              <div className="font-semibold text-green-600">{summary.completedMaterials}</div>
            </div>
            <div>
              <span className="text-gray-600">Total:</span>
              <div className="font-semibold text-gray-900">{summary.totalMaterials}</div>
            </div>
            <div>
              <span className="text-gray-600">Last Updated:</span>
              <div className="font-semibold text-gray-900">{summary.lastUpdated}</div>
            </div>
          </div>
        </div>
      )}

      {/* Status Message */}
      {importStatus && (
        <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
          importStatus.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          {importStatus.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <span className={`text-sm font-medium ${
            importStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {importStatus.message}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleExport}
          disabled={!progress}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Download size={16} />
          <span>Export Progress</span>
        </button>

        <label className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors">
          <Upload size={16} />
          <span>{importing ? 'Importing...' : 'Import Progress'}</span>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            disabled={importing}
            className="hidden"
          />
        </label>
      </div>

      {/* Help Text */}
      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>• Export: Download your current progress as a JSON file for backup</p>
        <p>• Import: Upload a previously exported progress file to restore your data</p>
        <p>• Note: Importing will replace your current progress data</p>
      </div>
    </div>
  );
};

export default ProgressActions;