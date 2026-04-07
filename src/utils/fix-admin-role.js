import { db } from '../services/firebase/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Utility untuk memastikan role admin ter-set dengan benar
 * Jalankan ini dari console browser jika role admin tidak ditemukan
 */
export const fixAdminRole = async (user) => {
  if (!user) {
    console.error('❌ User tidak ditemukan. Login terlebih dahulu.');
    return false;
  }

  try {
    console.log('🔧 Memperbaiki role admin untuk:', user.email);
    
    // Cek dokumen user saat ini
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      console.log('📄 Data user saat ini:', userDoc.data());
    } else {
      console.log('⚠️ Dokumen user tidak ditemukan, akan dibuat baru');
    }
    
    // Set/update role admin
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName || 'Admin',
      photoURL: user.photoURL || '',
      role: 'admin',
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    console.log('✅ Role admin berhasil di-set!');
    
    // Verifikasi
    const updatedDoc = await getDoc(userRef);
    console.log('✅ Data user setelah update:', updatedDoc.data());
    
    return true;
  } catch (error) {
    console.error('❌ Error saat memperbaiki role:', error);
    return false;
  }
};

/**
 * Cek status admin user
 */
export const checkAdminStatus = async (user) => {
  if (!user) {
    console.error('❌ User tidak ditemukan');
    return;
  }

  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      console.log('❌ Dokumen user tidak ditemukan di Firestore');
      console.log('💡 Jalankan: fixAdminRole(auth.currentUser)');
      return;
    }
    
    const userData = userDoc.data();
    console.log('📊 Status Admin Check:');
    console.log('  - Email:', userData.email);
    console.log('  - Role:', userData.role || 'TIDAK ADA');
    console.log('  - Is Admin:', userData.role === 'admin' ? '✅ YA' : '❌ TIDAK');
    
    if (userData.role !== 'admin') {
      console.log('💡 Role bukan admin. Jalankan: fixAdminRole(auth.currentUser)');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

// Export untuk digunakan di console browser
if (typeof window !== 'undefined') {
  window.fixAdminRole = fixAdminRole;
  window.checkAdminStatus = checkAdminStatus;
}
