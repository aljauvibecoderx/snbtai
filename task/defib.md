Act as an expert React, Next.js, and Tailwind CSS developer. We are redesigning the main dashboard page. 
I want you to completely replace the current static form layout with the new 3-column conversational layout shown in the attached image.

PHASE 1 GOAL: Focus STRICTLY on the Frontend/UI structural changes. Do not alter the database schema or the core generation logic yet.

Strict Constraints:
1. DO NOT touch or modify the existing Top Navbar component. Keep it exactly as it is.
2. Ensure the layout is responsive, but prioritize the 3-column desktop view (Left Sidebar, Center Chat, Right Sidebar).
3. Use light theme: bg-slate-50 for the main background. Primary accent color is deep purple (#7C3AED or similar).

Column 1: Left Sidebar (Fixed/Sticky)
- Remove the Top Navbar's logo if it exists, move "SNBT AI" logo here (top left).
- Add a large primary button "Mulai Belajar".
- Create sections for "Riwayat Latihan" (with history items) and "Soal Tersimpan" (with bookmark items). Include bottom links for Pengaturan and Bantuan.

Column 2: Center Chat Area (Main flex-1 container)
- Create a scrollable chat interface. 
- Mock the following chat elements: 
  a. User Bubble (Purple bg, right-aligned).
  b. AI Bubble (White bg, left-aligned) asking "Tentu! Mau latihan subtes apa?".
  c. Interactive Quick Replies: Render clickable chips for subtests (e.g., Penalaran Umum, Literasi Bahasa Indonesia). The active one gets a purple border.
  d. Final Result Card: A white card showing the generated package (e.g., "Literasi Bahasa Indonesia, 15 Soal") with a solid purple "Mulai Mengerjakan" button.
- Bottom Input: A sticky floating text input with a "+" icon on the left, "Ketik keluh kesahmu di sini..." placeholder, and a purple send button on the right. Add a disclaimer text below it.

Column 3: Right Sidebar (Fixed/Sticky)
- User Profile dropdown at the top.
- "Statistik Kamu" card: Show Daily Streak (fire icon) and Coin balance, plus a mock bar chart for "Prediksi Skor IRT".
- "Target Jurusan" card: Show "Sistem Informasi ITS" with a progress bar.
- "Leaderboard" card: Show a mock list of top 3 users.

Please provide the updated page layout code using Tailwind CSS. Use placeholder data for the UI components for now.