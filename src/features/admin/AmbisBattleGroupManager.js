import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save } from 'lucide-react';
import { getSubtestGroups, saveSubtestGroup } from '../../services/firebase/ambisBattleConfig';
import { db } from '../../services/firebase/firebase';
import { deleteDoc, doc } from 'firebase/firestore';

export const AmbisBattleGroupManager = ({ user, showToast }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingGroup, setEditingGroup] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadGroups();
  }, [user]);

  const loadGroups = async () => {
    setLoading(true);
    const allGroups = await getSubtestGroups(user.uid);
    setGroups(allGroups);
    setLoading(false);
  };

  const handleSaveGroup = async (groupData) => {
    try {
      await saveSubtestGroup(groupData, user.uid);
      if (showToast) {
        showToast('Grup berhasil disimpan', 'success');
      } else {
        alert('✅ Grup berhasil disimpan');
      }
      setEditingGroup(null);
      setShowAddForm(false);
      loadGroups();
    } catch (error) {
      if (showToast) {
        showToast('Gagal menyimpan grup: ' + error.message, 'error');
      } else {
        alert('❌ Gagal menyimpan grup: ' + error.message);
      }
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Hapus grup ini?')) return;
    
    try {
      await deleteDoc(doc(db, 'ambis_battle_groups', groupId));
      if (showToast) {
        showToast('Grup berhasil dihapus', 'success');
      } else {
        alert('✅ Grup berhasil dihapus');
      }
      loadGroups();
    } catch (error) {
      if (showToast) {
        showToast('Gagal menghapus grup', 'error');
      } else {
        alert('❌ Gagal menghapus grup');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Ambis Battle Groups</h2>
          <p className="text-sm text-slate-600">Kelola grup subtest untuk Ambis Battle</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus size={18} />
          Tambah Grup
        </button>
      </div>

      <div className="grid gap-4">
        {groups.map(group => (
          <div key={group.id} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-slate-900">{group.name}</h3>
                  {group.isCustom && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">Custom</span>
                  )}
                  {!group.isCustom && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">Default</span>
                  )}
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  {group.subtests.length} subtest • {group.questionsPerSubtest} soal/subtest • Total: {group.totalQuestions} soal
                </p>
                <div className="flex flex-wrap gap-1">
                  {group.subtests.map(st => (
                    <span key={st} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded">
                      {st}
                    </span>
                  ))}
                </div>
              </div>
              
              {group.isCustom && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingGroup(group)}
                    className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-sm"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="px-3 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 text-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {(showAddForm || editingGroup) && (
        <GroupFormModal
          group={editingGroup}
          onSave={handleSaveGroup}
          onCancel={() => {
            setShowAddForm(false);
            setEditingGroup(null);
          }}
        />
      )}
    </div>
  );
};

const GroupFormModal = ({ group, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    group || {
      name: '',
      subtests: [],
      questionsPerSubtest: 5,
      totalQuestions: 0
    }
  );

  const availableSubtests = [
    { id: 'tps_pu', label: 'TPS - Penalaran Umum' },
    { id: 'tps_pk', label: 'TPS - Pengetahuan Kuantitatif' },
    { id: 'tps_pbm', label: 'TPS - Pemahaman Bacaan' },
    { id: 'tps_ppu', label: 'TPS - Pengetahuan & Pemahaman Umum' },
    { id: 'lit_ind', label: 'Literasi Indonesia' },
    { id: 'lit_ing', label: 'Literasi Inggris' },
    { id: 'pm', label: 'Penalaran Matematika' }
  ];

  const handleToggleSubtest = (subtestId) => {
    const newSubtests = formData.subtests.includes(subtestId)
      ? formData.subtests.filter(s => s !== subtestId)
      : [...formData.subtests, subtestId];
    
    setFormData({
      ...formData,
      subtests: newSubtests,
      totalQuestions: newSubtests.length * formData.questionsPerSubtest
    });
  };

  const handleQuestionsPerSubtestChange = (value) => {
    setFormData({
      ...formData,
      questionsPerSubtest: value,
      totalQuestions: formData.subtests.length * value
    });
  };

  const handleSubmit = () => {
    if (!formData.name || formData.subtests.length === 0) {
      alert('Nama dan minimal 1 subtest harus dipilih!');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6">
          <h2 className="text-2xl font-bold">{group ? 'Edit Grup' : 'Tambah Grup Baru'}</h2>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nama Grup</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="SNBT Mini, TPS Lengkap, dll"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Subtest</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {availableSubtests.map(st => (
                <label
                  key={st.id}
                  className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.subtests.includes(st.id)}
                    onChange={() => handleToggleSubtest(st.id)}
                    className="w-5 h-5 accent-indigo-600"
                  />
                  <span className="text-sm">{st.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Soal Per Subtest: {formData.questionsPerSubtest}
            </label>
            <input
              type="range"
              min="3"
              max="10"
              value={formData.questionsPerSubtest}
              onChange={(e) => handleQuestionsPerSubtestChange(parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>3</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="text-sm text-indigo-900">
              <span className="font-bold">Total Soal:</span> {formData.totalQuestions} soal
              ({formData.subtests.length} subtest × {formData.questionsPerSubtest} soal)
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Save size={18} className="inline mr-2" />
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};
