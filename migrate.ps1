# ============================================================
# migrate.ps1 — SNBT AI Folder Refactor Script
# Jalankan dari root project:
#   cd "SNBT AI - Competition FInal"
#   .\migrate.ps1
#
# PENTING: Jalankan "git add . && git commit -m 'backup before refactor'"
# sebelum menjalankan script ini!
# ============================================================

$src = ".\src"
$ErrorActionPreference = "SilentlyContinue"

Write-Host ""
Write-Host "🚀 SNBT AI — Folder Refactor Migration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ==== STEP 1: CREATE ALL DIRECTORIES ====
Write-Host "📁 Creating folder structure..." -ForegroundColor Yellow
$dirs = @(
  "$src\pages",
  "$src\features\dashboard",
  "$src\features\community",
  "$src\features\soal",
  "$src\features\tryout",
  "$src\features\vocab",
  "$src\features\ptnpedia",
  "$src\components\common",
  "$src\components\layout",
  "$src\services\firebase",
  "$src\services\api",
  "$src\services\vocab",
  "$src\utils",
  "$src\constants",
  "$src\config",
  "$src\styles"
)
foreach ($dir in $dirs) {
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
}
Write-Host "  ✅ Folders created!" -ForegroundColor Green

# ==== STEP 2: MOVE PAGES ====
Write-Host ""
Write-Host "📄 Moving pages..." -ForegroundColor Yellow
$pages = @(
  "LandingPage.js",
  "HomeViewRevamp.js",
  "HelpPage.js",
  "SettingsView.js",
  "AboutUs.js",
  "ContactUs.js",
  "PrivacyPolicy.js",
  "TermsConditions.js",
  "ErrorPage.js"
)
foreach ($f in $pages) {
  if (Test-Path "$src\$f") {
    Move-Item "$src\$f" "$src\pages\$f" -Force
    Write-Host "  ✅ $f → pages/$f" -ForegroundColor Green
  }
}

# ==== STEP 3: MOVE FEATURES ====
Write-Host ""
Write-Host "📦 Moving features..." -ForegroundColor Yellow
$features = @(
  @{ from="DashboardView.js";        to="features\dashboard\DashboardView.js" },
  @{ from="CommunityView.js";        to="features\community\CommunityView.js" },
  @{ from="DetailSoalView.js";       to="features\soal\DetailSoalView.js" },
  @{ from="ManageQuestionsPanel.js"; to="features\soal\ManageQuestionsPanel.js" },
  @{ from="AdminDashboard.js";       to="features\tryout\AdminDashboard.js" },
  @{ from="VocabMode.js";            to="features\vocab\VocabMode.js" },
  @{ from="ptnpedia.js";             to="features\ptnpedia\ptnpedia.js" }
)
foreach ($f in $features) {
  if (Test-Path "$src\$($f.from)") {
    Move-Item "$src\$($f.from)" "$src\$($f.to)" -Force
    Write-Host "  ✅ $($f.from) → $($f.to)" -ForegroundColor Green
  }
}

# ==== STEP 4: MOVE LAYOUT COMPONENTS ====
Write-Host ""
Write-Host "🧱 Moving layout components..." -ForegroundColor Yellow
$layouts = @(
  @{ from="UnifiedNavbar.js";   to="components\layout\UnifiedNavbar.js" },
  @{ from="DashboardLayout.js"; to="components\layout\DashboardLayout.js" },
  @{ from="DashboardTabs.js";   to="components\layout\DashboardTabs.js" }
)
foreach ($f in $layouts) {
  if (Test-Path "$src\$($f.from)") {
    Move-Item "$src\$($f.from)" "$src\$($f.to)" -Force
    Write-Host "  ✅ $($f.from) → $($f.to)" -ForegroundColor Green
  }
}

# ==== STEP 5: MOVE COMMON COMPONENTS ====
Write-Host ""
Write-Host "🧩 Moving common components..." -ForegroundColor Yellow
$commons = @(
  @{ from="NotificationSystem.js"; to="components\common\NotificationSystem.js" },
  @{ from="SEOHelmet.js";          to="components\common\SEOHelmet.js" },
  @{ from="ImageUploader.js";      to="components\common\ImageUploader.js" },
  @{ from="TemplateInfo.js";       to="components\common\TemplateInfo.js" }
)
foreach ($f in $commons) {
  if (Test-Path "$src\$($f.from)") {
    Move-Item "$src\$($f.from)" "$src\$($f.to)" -Force
    Write-Host "  ✅ $($f.from) → $($f.to)" -ForegroundColor Green
  }
}

# ==== STEP 6: MOVE SERVICES ====
Write-Host ""
Write-Host "⚡ Moving services..." -ForegroundColor Yellow
$services = @(
  @{ from="firebase.js";          to="services\firebase\firebase.js" },
  @{ from="firebase-admin.js";    to="services\firebase\firebase-admin.js" },
  @{ from="api-key-manager.js";   to="services\api\api-key-manager.js" },
  @{ from="ptnpedia-api.js";      to="services\api\ptnpedia-api.js" },
  @{ from="ptnpedia-backend.js";  to="services\api\ptnpedia-backend.js" },
  @{ from="vocab-firebase.js";    to="services\vocab\vocab-firebase.js" }
)
foreach ($f in $services) {
  if (Test-Path "$src\$($f.from)") {
    Move-Item "$src\$($f.from)" "$src\$($f.to)" -Force
    Write-Host "  ✅ $($f.from) → $($f.to)" -ForegroundColor Green
  }
}

# ==== STEP 7: MOVE UTILS ====
Write-Host ""
Write-Host "🛠️ Moving utils..." -ForegroundColor Yellow
$utils = @(
  @{ from="security.js";               to="utils\security.js" },
  @{ from="irt-scoring.js";            to="utils\irt-scoring.js" },
  @{ from="multi-source-processor.js"; to="utils\multi-source-processor.js" },
  @{ from="questionTemplates.js";      to="utils\questionTemplates.js" }
)
foreach ($f in $utils) {
  if (Test-Path "$src\$($f.from)") {
    Move-Item "$src\$($f.from)" "$src\$($f.to)" -Force
    Write-Host "  ✅ $($f.from) → $($f.to)" -ForegroundColor Green
  }
}

# Move slugify.js if still in utils subdirectory (should stay in utils)
if (Test-Path "$src\utils\slugify.js") {
  Write-Host "  ✅ utils/slugify.js → already correct!" -ForegroundColor Green
}

# ==== STEP 8: MOVE CONSTANTS ====
Write-Host ""
Write-Host "📌 Moving constants..." -ForegroundColor Yellow
if (Test-Path "$src\subtestHelper.js") {
  Move-Item "$src\subtestHelper.js" "$src\constants\subtestHelper.js" -Force
  Write-Host "  ✅ subtestHelper.js → constants/subtestHelper.js" -ForegroundColor Green
}

# ==== STEP 9: MOVE CONFIG ====
Write-Host ""
Write-Host "⚙️ Moving config..." -ForegroundColor Yellow
if (Test-Path "$src\config.js") {
  Move-Item "$src\config.js" "$src\config\config.js" -Force
  Write-Host "  ✅ config.js → config/config.js" -ForegroundColor Green
}

# ==== STEP 10: MOVE STYLES ====
Write-Host ""
Write-Host "🎨 Moving styles..." -ForegroundColor Yellow
if (Test-Path "$src\notification-animations.css") {
  Move-Item "$src\notification-animations.css" "$src\styles\notification-animations.css" -Force
  Write-Host "  ✅ notification-animations.css → styles/notification-animations.css" -ForegroundColor Green
}

# ==== STEP 11: DELETE OBSOLETE FILES ====
Write-Host ""
Write-Host "🗑️ Deleting obsolete files..." -ForegroundColor Yellow
$toDelete = @(
  "$src\CommunityView_new.js",
  "$src\DashboardView_new.js",
  "$src\DashboardStyled.js"
)
foreach ($f in $toDelete) {
  if (Test-Path $f) {
    Remove-Item $f -Force
    Write-Host "  🗑️ Deleted: $f" -ForegroundColor Red
  }
}

# ==== DONE ====
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ MIGRATION COMPLETE!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  LANGKAH SELANJUTNYA (WAJIB):" -ForegroundColor Yellow
Write-Host "  1. Update import di src/index.js" -ForegroundColor White
Write-Host "  2. Update import di src/App.js (banyak perubahan)" -ForegroundColor White
Write-Host "  3. Update import di semua file di features/ & services/" -ForegroundColor White
Write-Host "  4. Jalankan: npm start" -ForegroundColor White
Write-Host "  5. Cek console untuk compile errors" -ForegroundColor White
Write-Host ""
