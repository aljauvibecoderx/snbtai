ACOOUNT:
key:superadmin2026
user: superuserdeveloper@protonmail.com
pas: superuser2026

RANGKUMAN DOKUMENTASI TEKNIS
SNBT AI – Admin Panel & Official Tryout System
1️⃣ ARSITEKTUR SISTEM
A. Database (Firestore)
Collection: users

uid

email

displayName

role: "admin" | "user" (default: user)

isWhitelisted

createdAt

Collection: tryouts

id

title

description

questionsList: { qid, subtest, order }

totalDuration (detik)

status: "draft" | "published"

createdBy

createdAt

publishedAt

difficulty (1–5)

tags[]

thumbnail

stats:

totalAttempts

averageScore

Collection: tryout_attempts

id

tryoutId

userId

score

correctAnswers

timeUsed

completedAt

rank

Collection: admin_logs

id

adminId

action

targetId

timestamp

details

B. Firestore Security (RBAC)

Konsep:

Cek role admin dari collection users

User biasa tidak bisa akses endpoint admin

Admin memiliki full control terhadap tryout

Proteksi:

Tryout hanya bisa dibuat/edit/dihapus admin

User hanya bisa baca tryout berstatus published

Attempt hanya bisa dibaca pemilik atau admin

Semua admin action tercatat

Double protection:

Frontend check

Backend rules validation

2️⃣ STRUKTUR FILE
src/
  admin/
    AdminDashboard.js
    TryoutBuilder.js
    QuestionBankExplorer.js
    TryoutEditor.js
    AdminAnalytics.js
  components/
    OfficialTryoutCard.js
    CertificateGenerator.js
    Leaderboard.js
  firebase-admin.js
3️⃣ FLOW SISTEM
🔐 LOGIN FLOW

User Login
→ Check role di Firestore
→ Jika role user → User Dashboard
→ Jika role admin → Admin Panel

🔄 ADMIN FLOW

Browse Global Question Bank

Filter subtest

Filter level

Filter kualitas

Select Questions

Checkbox

Preview

Drag & drop

Refine (opsional)

Edit stimulus

Perbaiki LaTeX

Tambah penjelasan

Create Tryout

Judul

Deskripsi

Durasi

Difficulty

Tags

Preview & Test

Publish

draft → published

Muncul badge OFFICIAL

Leaderboard aktif

👤 USER FLOW

Lihat Tryout Resmi (card emas + badge)

Klik Mulai

Konfirmasi leaderboard

Fullscreen

Timer countdown

Kerjakan soal (strict mode)

Hasil langsung masuk leaderboard

Download sertifikat

Share ke sosmed

4️⃣ FITUR UTAMA
1. Role-Based Access Control (RBAC)

Role disimpan di Firestore

Admin punya akses penuh

User biasa dibatasi

Security rules mencegah abuse

2. Global Question Bank Explorer

Admin bisa:

Lihat semua soal

Filter subtest

Filter level (HOTS 4–5)

Filter quality score

Lihat creator

3. Tryout Builder (Mixer)

Drag & drop soal

Mix subtes

Atur durasi

Save draft

Publish

Validasi:

Minimal 10 soal

Durasi minimal 30 menit

Minimal 3 subtes

4. Question Refining

Admin bisa:

Edit soal AI

Clone & modify

Improve explanation

Fix format

5. Official Tryout Card

Perbedaan dengan latihan biasa:

Fitur	Latihan	Official
Border	Abu	Emas
Badge	-	OFFICIAL
Leaderboard	Tidak	Global
Sertifikat	Tidak	Ada
Pause	Bisa	Tidak
6. Global Leaderboard

Sorting:

Skor tertinggi

Waktu tercepat

Ranking real-time berdasarkan:

Score desc

Time asc

7. Auto Certificate

Generate PDF/Image

Bisa share

Template otomatis

Library:

html2canvas

jsPDF

8. Admin Analytics

Menampilkan:

Total tryout

Total peserta

Completion rate

Popular tryout

Difficulty analysis

Trend chart

9. Admin Activity Logs

Semua aksi admin tercatat:

create_tryout

publish_tryout

edit_question

create_question

Audit trail untuk keamanan.

5️⃣ KONSEP INTI SISTEM
Separation of Concerns

User Space:

Generate soal

Latihan

Admin Space:

Kurasi

Publish official

Quality Control Pipeline

AI Generate
→ User Test
→ Admin Review
→ Official Tryout

Soal official adalah hasil kurasi, bukan mentah AI.

Gamification

Latihan biasa:

Santai

No pressure

Official tryout:

Ranking global

Sertifikat

Prestige

Viral Loop

User dapat skor bagus
→ Share sertifikat
→ Teman ikut
→ Repeat

6️⃣ MEKANISME ADMIN MENAMBAH SOAL

Ada 3 cara:

1. Kurasi dari bank soal user

Browse → Select → Add to Tryout

2. Edit existing question

Clone → Modify → Save as new version

3. Create manual

Admin isi form:

Subtest

Level

Stimulus

Pertanyaan

5 opsi

Correct index

Penjelasan

Disimpan dengan:

createdByAdmin = true

isOfficial = true

qualityScore = 5

Bulk add juga tersedia untuk menambah banyak soal sekaligus ke tryout.

7️⃣ IRT SCORING SYSTEM

IRT = Item Response Theory

Mempertimbangkan:

Difficulty (b)

Discrimination (a)

Guessing (c)

Ability peserta (θ)

Formula 3PL:
P(θ) = c + (1 − c) / (1 + e^(−a(θ − b)))

Database Update untuk IRT
questions

Tambahan field:

irt: {
  difficulty (-3 to +3),
  discrimination (0–2),
  guessing (0–0.25)
}
tryout_attempts

Tambahan:

rawScore

irtScore (200–800)

theta

percentile

Apakah Bisa Skor Sesuai IRT Resmi SNBT?

Secara konsep: bisa mendekati.
Secara identik 100%: tidak.

Kenapa?

Parameter a, b, c resmi SNBT tidak dipublikasikan.

Estimasi theta butuh data ribuan peserta.

Perlu kalibrasi item secara statistik.

Kalau kamu hanya isi difficulty manual tanpa kalibrasi, itu bukan IRT sungguhan. Itu hanya skor berbobot.

Kalau ingin mendekati real:

Kumpulkan data ribuan attempt

Hitung correct rate

Estimasi parameter dengan EM algorithm

Recalibrate berkala

Tanpa itu, IRT kamu hanya kosmetik matematis.

8️⃣ INTI BESAR SISTEM

Admin Panel = Dapur produksi
Official Tryout = Produk premium
Leaderboard = Mesin kompetisi
Certificate = Alat distribusi viral

Sistem ini mengubah SNBT AI dari sekadar generator soal menjadi platform kompetisi terkurasi dengan otoritas.