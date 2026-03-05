# Planning: API Key Sync Feature

## Branch: `planning/api-key-sync`

## Tujuan
Membuat fitur sinkronisasi API key Gemini/Gemma yang hanya dapat dikelola melalui dashboard admin.

## Fitur Utama

### 1. Admin Dashboard - API Key Management
- **Lokasi**: AdminDashboard.js
- **Fitur**:
  - Tambah API key baru (Gemini/Gemma)
  - Lihat daftar API keys (dengan masking: `AIza...kic`)
  - Hapus API key
  - Test API key (validasi)
  - Set API key sebagai active/inactive

### 2. Firestore Structure
```
/api_keys/{keyId}
  - key: string (encrypted)
  - type: "gemini" | "gemma"
  - name: string (e.g., "Aljauhari", "Inilab")
  - status: "active" | "inactive" | "expired"
  - createdAt: timestamp
  - createdBy: userId
  - lastUsed: timestamp
  - usageCount: number
```

### 3. Backend Integration
- **File baru**: `src/api-key-manager.js`
- **Fungsi**:
  - `getActiveKeys()` - Ambil semua active keys dari Firestore
  - `addKey(keyData)` - Tambah key baru (admin only)
  - `deleteKey(keyId)` - Hapus key (admin only)
  - `testKey(key)` - Validasi key dengan API call
  - `rotateKey()` - Auto-rotate ke key berikutnya jika error

### 4. Config Update
- **File**: `src/config.js`
- Hapus hardcoded keys
- Load keys dari Firestore saat app start
- Fallback ke .env jika Firestore gagal

### 5. Security
- **Firestore Rules**:
```javascript
match /api_keys/{keyId} {
  allow read: if request.auth != null;
  allow write: if isAdmin();
}
```
- Encrypt keys di Firestore (optional)
- Rate limiting per key

## Implementation Steps

### Phase 1: Backend Setup
1. ✅ Buat branch `planning/api-key-sync`
2. ⬜ Buat `src/api-key-manager.js`
3. ⬜ Update Firestore rules
4. ⬜ Buat collection `/api_keys` di Firestore

### Phase 2: Admin UI
1. ⬜ Tambah tab "API Keys" di AdminDashboard
2. ⬜ Form tambah key baru
3. ⬜ Tabel daftar keys dengan actions
4. ⬜ Test key button

### Phase 3: Integration
1. ⬜ Update `config.js` untuk load dari Firestore
2. ⬜ Update `generateQuestions()` untuk gunakan dynamic keys
3. ⬜ Implement auto-rotation saat key error

### Phase 4: Testing
1. ⬜ Test tambah/hapus key
2. ⬜ Test auto-rotation
3. ⬜ Test permission (non-admin tidak bisa akses)

## Files to Create/Modify

### New Files:
- `src/api-key-manager.js` - Key management logic
- `src/firebase-api-keys.js` - Firestore operations untuk keys

### Modified Files:
- `src/AdminDashboard.js` - Tambah UI untuk manage keys
- `src/config.js` - Load keys dari Firestore
- `src/App.js` - Update generateQuestions() untuk gunakan dynamic keys
- `firestore.rules` - Tambah rules untuk `/api_keys`

## UI Mockup (Admin Dashboard)

```
┌─────────────────────────────────────────┐
│ API Key Management                      │
├─────────────────────────────────────────┤
│ [+ Add New Key]                         │
│                                         │
│ Active Keys:                            │
│ ┌─────────────────────────────────────┐ │
│ │ Gemini - Aljauhari                  │ │
│ │ AIza...kic                          │ │
│ │ Status: Active | Used: 45 times     │ │
│ │ [Test] [Deactivate] [Delete]        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Gemini - Inilab                     │ │
│ │ AIza...NUo                          │ │
│ │ Status: Active | Used: 12 times     │ │
│ │ [Test] [Deactivate] [Delete]        │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Benefits
- ✅ Tidak perlu restart app untuk update keys
- ✅ Centralized key management
- ✅ Easy rotation saat key expired
- ✅ Track usage per key
- ✅ Admin-only access

## Next Steps
1. Review planning ini
2. Mulai implementasi Phase 1
3. Test di development
4. Merge ke main setelah testing
