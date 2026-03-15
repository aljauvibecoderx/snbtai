import React, { useState } from 'react';
import { User, Mail, Shield, Trash2, LogOut, AlertTriangle, CheckCircle } from 'lucide-react';
import { auth, db } from '../services/firebase/firebase';
import { deleteUser } from 'firebase/auth';
import { doc, deleteDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';

export const SettingsView = ({ user, onBack, onLogout }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDeleteAccount = async () => {
    if (deleteInput !== 'HAPUS AKUN') {
      setError('Ketik "HAPUS AKUN" untuk konfirmasi');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const userId = user.uid;
      const batch = writeBatch(db);

      // Delete user data from all collections
      const collections = ['users', 'question_sets', 'questions', 'attempts', 'wishlist', 'vocab', 'tryout_attempts'];
      
      for (const collectionName of collections) {
        const q = query(collection(db, collectionName), where('userId', '==', userId));
        const snapshot = await getDocs(q);
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
      }

      // Delete user document
      batch.delete(doc(db, 'users', userId));
      
      await batch.commit();
      
      // Delete Firebase Auth account
      await deleteUser(auth.currentUser);
      
      onLogout();
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Gagal menghapus akun. Silakan login ulang dan coba lagi.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Pengaturan Akun</h1>
          <p className="text-slate-600">Kelola informasi dan keamanan akun Anda</p>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full border-4 border-slate-100" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-4 border-slate-100">
                  <User size={40} className="text-white" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">{user.displayName || 'Pengguna'}</h2>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail size={16} />
                <span className="text-sm">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Shield size={20} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Status Akun</p>
                  <p className="text-sm font-bold text-slate-900">Aktif</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Verifikasi Email</p>
                  <p className="text-sm font-bold text-slate-900">Terverifikasi</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Tindakan Akun</h3>
          
          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                <LogOut size={20} className="text-indigo-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900">Keluar</p>
                <p className="text-xs text-slate-500">Keluar dari akun Anda</p>
              </div>
            </div>
            <div className="text-slate-400 group-hover:text-indigo-600 transition-colors">→</div>
          </button>

          {/* Delete Account Button */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-rose-200 hover:border-rose-400 hover:bg-rose-50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center group-hover:bg-rose-200 transition-colors">
                <Trash2 size={20} className="text-rose-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900">Hapus Akun</p>
                <p className="text-xs text-slate-500">Hapus akun dan semua data secara permanen</p>
              </div>
            </div>
            <div className="text-slate-400 group-hover:text-rose-600 transition-colors">→</div>
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={32} className="text-rose-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Hapus Akun?</h3>
                <p className="text-slate-600 text-sm">Tindakan ini tidak dapat dibatalkan. Semua data Anda akan dihapus secara permanen.</p>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6">
                <p className="text-xs font-semibold text-rose-900 mb-3">Data yang akan dihapus:</p>
                <ul className="space-y-1 text-xs text-rose-800">
                  <li>• Profil dan informasi akun</li>
                  <li>• Semua soal yang dibuat</li>
                  <li>• Riwayat tryout dan skor</li>
                  <li>• Vocabulary yang disimpan</li>
                  <li>• Wishlist dan bookmark</li>
                </ul>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Ketik <span className="text-rose-600">HAPUS AKUN</span> untuk konfirmasi
                </label>
                <input
                  type="text"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder="HAPUS AKUN"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                />
                {error && <p className="text-xs text-rose-600 mt-2">{error}</p>}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteInput('');
                    setError('');
                  }}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || deleteInput !== 'HAPUS AKUN'}
                  className="flex-1 px-4 py-3 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Menghapus...' : 'Hapus Permanen'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={onBack}
          className="text-sm text-slate-600 hover:text-indigo-600 font-medium transition-colors"
        >
          ← Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
