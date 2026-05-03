Act as an Expert Next.js and Tailwind CSS Developer. We are going to refactor the main dashboard layout based on the provided reference image, but strictly following these rules:

**CRITICAL CONSTRAINTS:**
1. DO NOT touch, modify, or remove the existing Top Navbar component. Leave it exactly as it is.
2. DO NOT modify any existing database schemas, API calls, or routing logic.
3. This phase is STRICTLY for UI/Frontend layout scaffolding. Do not change the underlying state logic yet.

**LAYOUT REFACTORING INSTRUCTIONS:**
Below the existing Navbar, create a responsive 3-column grid layout for desktop (hidden/stacked on mobile):

**Column 1: Left Sidebar (w-64, sticky)**
- Minimalist white background.
- "Mulai Belajar" solid purple button at the top.
- Section "RIWAYAT LATIHAN": List items with icons (e.g., "Literasi Bahasa Indone...", "Curhatan overthinking..."). Active item has a subtle purple background.
- Section "SOAL TERSIMPAN": Bookmark list.
- Bottom area: "Pengaturan" and "Bantuan" links with icons.

**Column 2: Center Main Chat Area (flex-1, max-w-3xl, scrollable)**
- Background: Very light gray/off-white.
- Date badge ("Hari ini") in the center.
- Hardcode a mock conversation flow to build the UI components:
  - User Bubble (Purple bg, white text, align right).
  - AI Bubble 1: "Tentu! Mau latihan subtes apa?" with a grid of clickable outlined chips for subtests (e.g., Penalaran Umum, Literasi Bahasa Indonesia). The active chip has a purple text/border.
  - AI Bubble 2: "Sip! Ini paket soal..." containing a Premium Result Card (White bg, icon, title, "15 Soal • Estimasi 20 Menit").
  - Inside the Result Card, place the "Mulai Mengerjakan" button. Give this button an ID or clear class so we can attach the existing CBT logic to it in Phase 2.
- Bottom Input Area: Fixed/sticky rounded-full text input with a placeholder "Ketik keluh kesahmu di sini..." and a purple send icon button on the right.

**Column 3: Right Sidebar (w-[300px], sticky)**
- User Profile dropdown at the top (if not already in the preserved Navbar).
- Card 1 "Statistik Kamu": Daily Streak (fire icon), Coin count, and a mock bar chart for "Prediksi Skor IRT".
- Card 2 "Target Jurusan": Show "Sistem Informasi ITS" with a progress bar (e.g., 65% Ready).
- Card 3 "Leaderboard": List of top users with avatars and IRT scores.

Use clean Tailwind classes (rounded-2xl, shadow-sm, text-slate-800, etc.). Keep the code modular.