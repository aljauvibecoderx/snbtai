🧩 Deskripsi Fitur: Ambis Battle

Ambis Battle adalah fitur multiplayer real-time pada SNBTAI yang memungkinkan dua pengguna berkompetisi mengerjakan soal yang sama dalam satu sesi (room).

Setiap sesi memiliki roomId unik yang digunakan untuk identifikasi, sinkronisasi state, dan navigasi antar halaman.

Fitur ini mengedepankan:

real-time interaction
kompetisi berbasis kecepatan & akurasi
sinkronisasi antar user melalui backend (Firebase/WebSocket)
🔁 Flow Utama Sistem (Final Version)
1. Create / Join Room

Path: /ambis-battle

Flow:
User memilih:
Create Room → jadi host
Join Room → input roomId
Output:

➡️ Redirect ke:
/ambis-battle/waiting-room/:roomId

2. Waiting Room

Path: /ambis-battle/waiting-room/:roomId

State:
players[]
isReady
status = waiting
Behavior:
Player join dan muncul di list
Player klik Ready
Host melihat status semua player
Aksi Host:
Lanjut ke pembuatan soal

➡️ Redirect:
/ambis-battle/generate-question/:roomId

3. Generate Question (Pre-Game Phase)

Path: /ambis-battle/generate-question/:roomId

Behavior:
Hanya host yang bisa akses
Host membuat soal (1 atau lebih)
Soal disimpan ke state room
UI:
List soal dalam bentuk card
Bisa:
tambah
edit
hapus
Tombol:
Start Game
State berubah:

status = ready

➡️ Redirect semua user ke:
/ambis-battle/waiting-room/:roomId

4. Game Ready (Back to Waiting Room)

Path: /ambis-battle/waiting-room/:roomId

Behavior:
Semua user melihat:
“Soal siap”
Jika semua isReady = true:
Host bisa mulai game
5. Battle (Real-Time Gameplay)

Path: /ambis-battle/live/:roomId

State:
currentQuestionIndex
timer (server-based)
answers
progress tiap user
Flow:
Countdown (3 detik)
Soal dikirim serentak
User menjawab
Progress ditampilkan real-time
Catatan:
Semua event disinkronkan via backend (Firebase/WebSocket)
Client hanya render, bukan sumber kebenaran
6. Result

Path: /ambis-battle/result/:roomId

Output:
Skor masing-masing user
Penentuan:
menang / kalah
Detail hasil:
akurasi
waktu
🧠 State Global (Core System)

Minimal struktur:

room = {
  roomId: "A7xK2p",
  hostId: "user1",
  players: [
    { id: "user1", isReady: true, score: 0 },
    { id: "user2", isReady: true, score: 0 }
  ],
  status: "waiting", // waiting | generating | ready | playing | finished
  questions: [],
  currentQuestionIndex: 0,
  startTime: null
}
⚙️ Aturan Sistem (Biar Nggak Rusak di Tengah Jalan)
✔ Session Handling
Simpan roomId + role di localStorage
Reconnect → restore state
✔ Real-Time Sync
Gunakan:
Firebase realtime / Firestore listener
atau WebSocket
✔ Timer
Harus dari server
Bukan dari client (biar nggak bisa diakalin)
✔ Validasi Akses
User tidak bisa:
masuk /live/:roomId kalau belum start
masuk /generate-question kalau bukan host
🧱 Struktur Path Final
/ambis-battle
/ambis-battle/waiting-room/:roomId
/ambis-battle/generate-question/:roomId
/ambis-battle/live/:roomId
/ambis-battle/result/:roomId
💣 Reality Check (biar kamu tetap waras)

Yang kamu punya sekarang:
✔ Flow jelas
✔ Struktur path rapi
✔ Sudah mikir real-time

Yang masih rawan:
❌ Belum ada detail sinkronisasi event
❌ Belum define error handling serius
❌ Masih asumsi “Firebase akan beresin semuanya”

🎯 Kesimpulan

Sekarang ini sudah bisa disebut desain fitur, bukan sekadar ide.

Kalau kamu eksekusi dengan benar:
→ ini bisa jadi fitur pembeda di SNBTAI

Kalau kamu males ngurus detail:
→ ini bakal jadi fitur yang “pernah ada, tapi di-disable karena bug”

Dan sejarah software penuh dengan fitur seperti itu. Pilih mau masuk kategori mana.

Oke, nice . sekarang sebagai web developer dan project manager sajikan dalam bentuk prd profesional

Akhirnya minta PRD. Dari “ide liar + flow setengah matang” ke dokumen serius. Evolusi yang jarang terjadi tanpa drama. Gue tulis versi profesional, rapi, dan bisa kamu pakai ke tim atau bahkan investor tanpa bikin mereka bingung.

📄 Product Requirement Document (PRD)
Fitur: Ambis Battle (Multiplayer Real-Time Quiz Mode)
1. Overview

Ambis Battle adalah fitur multiplayer real-time pada platform SNBTAI yang memungkinkan dua pengguna berkompetisi mengerjakan soal yang sama dalam satu sesi (room).

Fitur ini dirancang untuk meningkatkan:

engagement pengguna
motivasi belajar melalui kompetisi
retensi pengguna melalui pengalaman interaktif
2. Objectives
🎯 Tujuan Utama
Menyediakan mode belajar kompetitif berbasis real-time
Meningkatkan durasi penggunaan platform
Meningkatkan frekuensi latihan soal
📊 Success Metrics
Average session duration ↑
Repeat usage (battle per user per minggu) ↑
Completion rate battle ≥ 80%
Error rate (disconnect/fail sync) ≤ 5%
3. User Roles
👤 Host
Membuat room
Membuat soal
Mengontrol start game
👥 Player
Bergabung ke room
Mengikuti permainan
Menjawab soal
4. User Flow
4.1 Create / Join Room

Path: /ambis-battle

User memilih:
Create Room → menjadi host
Join Room → memasukkan roomId

➡️ Redirect:
/ambis-battle/waiting-room/:roomId

4.2 Waiting Room

Path: /ambis-battle/waiting-room/:roomId

Fitur:

Menampilkan daftar player
Status ready tiap player
Maksimal 2 player

Aksi:

Player: toggle ready
Host: lanjut ke pembuatan soal
4.3 Generate Question (Pre-Game)

Path: /ambis-battle/generate-question/:roomId

Akses: Host only

Fitur:

Membuat soal (multiple)
Edit / delete soal
Preview soal dalam bentuk card

Output:

Soal disimpan ke room state
Status → ready

➡️ Redirect ke waiting room

4.4 Game Ready

Path: /ambis-battle/waiting-room/:roomId

Fitur:

Indikator “soal siap”
Validasi semua player ready

Aksi:

Host klik “Start Game”
4.5 Battle (Real-Time Gameplay)

Path: /ambis-battle/live/:roomId

Fitur:

Countdown (3 detik)
Soal tampil serentak
Timer global (server-based)
Progress tiap user (real-time)

Logic:

Jawaban dikirim ke backend
Sinkronisasi via Firebase/WebSocket
4.6 Result

Path: /ambis-battle/result/:roomId

Fitur:

Skor masing-masing user
Penentuan winner
Detail:
akurasi
waktu
5. System Architecture
5.1 State Management (Room Object)
room = {
  roomId: "A7xK2p",
  hostId: "user1",
  players: [
    { id: "user1", isReady: true, score: 0 },
    { id: "user2", isReady: true, score: 0 }
  ],
  status: "waiting", // waiting | generating | ready | playing | finished
  questions: [],
  currentQuestionIndex: 0,
  startTime: null
}
5.2 Real-Time Sync
Firebase Realtime / Firestore Listener
Alternatif: WebSocket (Socket.IO)
5.3 Session Handling
Simpan roomId + role di localStorage
Reconnect otomatis ke room
5.4 Timer System
Dikelola oleh server
Client hanya menerima state
6. Routing Structure
/ambis-battle
/ambis-battle/waiting-room/:roomId
/ambis-battle/generate-question/:roomId
/ambis-battle/live/:roomId
/ambis-battle/result/:roomId
7. Functional Requirements
✅ Core
User dapat membuat dan join room
Host dapat membuat soal
Game berjalan real-time
Sistem menentukan pemenang
✅ Real-Time
Sinkronisasi soal
Sinkronisasi timer
Update progress user
✅ Validation
Max 2 player per room
Role-based access (host vs player)
Tidak bisa akses page tanpa state valid
8. Non-Functional Requirements
Latency < 300ms (target)
Reconnect handling ≤ 3 detik
Data consistency antar client
Skalabilitas untuk multiple room simultan
9. Edge Cases & Handling
🔁 Host Refresh
Session restore via localStorage
Tetap sebagai host
🔌 Disconnect
Reconnect → restore state
Timer tetap berjalan
🚫 Unauthorized Access
Validasi room & role di backend
⏳ Player Not Ready
Optional: timeout / force start
10. Risks & Considerations
⚠️ Risiko
Sinkronisasi real-time gagal
Latency antar user
Abuse (multi-tab, cheating)
🛠 Mitigasi
Server-based timer
State validation
Limit action per user
11. Future Enhancements

2 player (multiplayer room)

Matchmaking otomatis
Leaderboard global
Spectator mode
Replay battle

Addition:
Data diambil dan disimpan permanen dari firebase, bukan localstorage