const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');

// Patterns that must NEVER appear in user-facing UI files
const FORBIDDEN_PATTERNS = [
  { regex: /127\.0\.0\.1:5433/i, reason: 'Exposes internal PostgreSQL host/port (127.0.0.1:5433)' },
  { regex: /unified_health/i, reason: 'Exposes internal database name (unified_health)' },
  { regex: /JSON\.stringify\s*\(/, reason: 'Renders raw JSON response in the UI' },
  { regex: /DB_PASSWORD|DATABASE_URL/, reason: 'Exposes backend database credential variable' },
  { regex: /\bFR-\d+\.\d+\b/, reason: 'Exposes internal requirement specification ID in UI' },
];

// Responsive utility classes expected in page/layout files
const RESPONSIVE_BREAKPOINT_REGEX = /\b(sm:|md:|lg:|xl:)/;

function getAllFiles(dirPath, fileList = []) {
  if (!fs.existsSync(dirPath)) return fileList;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function runChecks() {
  const files = getAllFiles(SRC_DIR);
  const errors = [];
  const warnings = [];

  for (const file of files) {
    const relPath = path.relative(path.join(__dirname, '..'), file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf8');

    // 1. Check for forbidden backend/credential leaks in UI files
    if (relPath.startsWith('src/app/') || relPath.startsWith('src/components/')) {
      for (const rule of FORBIDDEN_PATTERNS) {
        if (rule.regex.test(content)) {
          errors.push(`[Security/Leak] ${relPath}: ${rule.reason}`);
        }
      }
    }

    // 2. Check page.js and layout components for mobile-responsive breakpoints
    const isPageFile = /src\/app\/.*page\.(js|jsx|tsx)$/.test(relPath);
    const isLayoutNav = /src\/components\/layout\/.*\.(js|jsx|tsx)$/.test(relPath);

    if (isPageFile || isLayoutNav) {
      if (!RESPONSIVE_BREAKPOINT_REGEX.test(content)) {
        errors.push(
          `[Mobile Responsiveness] ${relPath}: Missing responsive Tailwind breakpoints (sm:, md:, lg:)`
        );
      }

      // Check for fixed pixel widths that could overflow mobile screens
      if (/style=\{\{[^}]*width:\s*['"]\d{4,}px['"]/.test(content)) {
        errors.push(`[Mobile Responsiveness] ${relPath}: Contains fixed width >= 1000px`);
      }
    }
  }

  if (warnings.length > 0) {
    console.warn('⚠️ UI Warnings:\n' + warnings.map((w) => '  - ' + w).join('\n'));
  }

  if (errors.length > 0) {
    console.error('❌ UI Mobile Responsiveness & Security Check Failed:\n' + errors.map((e) => '  - ' + e).join('\n'));
    process.exit(1);
  }

  console.log(`✅ UI Check Passed (${files.length} files verified: mobile-responsive & zero backend/credential leaks).`);
}

runChecks();

