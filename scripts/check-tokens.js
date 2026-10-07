#!/usr/bin/env node

/**
 * CutiReady — Design Token & Arbitrary Style Validator
 * Scans JSX, TSX, JS, and TS files for unauthorized raw hex codes outside CSS files.
 *
 * Usage:
 *   node scripts/check-tokens.js [optional-file-or-dir]
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// Permitted files (CSS files legitimately define hex constants in :root)
const ALLOWED_DEFINITIONS = [
  'src/index.css',
  'src/App.css',
];

const IGNORED_PATHS = [
  'node_modules',
  'dist',
  '.git',
  '.agent',
];

const HEX_REGEX = /#([0-9a-fA-F]{3,8})\b/g;

function isIgnored(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  return IGNORED_PATHS.some(ignored => normalized.startsWith(ignored) || normalized.includes(`/${ignored}/`));
}

function isAllowedDefinition(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  return ALLOWED_DEFINITIONS.some(allowed => normalized === allowed);
}

function scanFile(filePath) {
  const relPath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
  if (isIgnored(relPath) || isAllowedDefinition(relPath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const violations = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      return;
    }

    let match;
    HEX_REGEX.lastIndex = 0;
    while ((match = HEX_REGEX.exec(line)) !== null) {
      violations.push({
        file: relPath,
        line: index + 1,
        code: match[0],
        snippet: trimmed,
      });
    }
  });

  return violations;
}

function scanDirectory(dirPath) {
  let allViolations = [];
  if (!fs.existsSync(dirPath)) return allViolations;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relPath = path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/');

    if (isIgnored(relPath)) continue;

    if (entry.isDirectory()) {
      allViolations = allViolations.concat(scanDirectory(fullPath));
    } else if (entry.isFile() && /\.(jsx?|tsx?)$/.test(entry.name)) {
      allViolations = allViolations.concat(scanFile(fullPath));
    }
  }

  return allViolations;
}

function main() {
  const target = process.argv[2] ? path.resolve(ROOT_DIR, process.argv[2]) : null;
  let violations = [];

  console.log('🔍 Checking for unauthorized arbitrary hex colors in CutiReady...\n');

  if (target) {
    if (!fs.existsSync(target)) {
      console.log(`Target path "${target}" does not exist yet. Skipping.`);
      process.exit(0);
    }
    if (fs.statSync(target).isDirectory()) {
      violations = scanDirectory(target);
    } else {
      violations = scanFile(target);
    }
  } else {
    const srcDir = path.join(ROOT_DIR, 'src');
    if (fs.existsSync(srcDir)) {
      violations = scanDirectory(srcDir);
    } else {
      console.log('src/ directory does not exist yet. Ready for project scaffolding.');
      process.exit(0);
    }
  }

  if (violations.length === 0) {
    console.log('✅ PASS: Zero unauthorized arbitrary hex codes found! Full token compliance.');
    process.exit(0);
  } else {
    console.log(`⚠️  Found ${violations.length} hardcoded hex code instances across source files:\n`);

    const byFile = {};
    violations.forEach(v => {
      if (!byFile[v.file]) byFile[v.file] = [];
      byFile[v.file].push(v);
    });

    for (const [file, items] of Object.entries(byFile)) {
      console.log(`📄 ${file} (${items.length} occurrences):`);
      items.slice(0, 5).forEach(item => {
        console.log(`   Line ${item.line}: ${item.code} -> "${item.snippet}"`);
      });
      if (items.length > 5) {
        console.log(`   ... and ${items.length - 5} more`);
      }
      console.log('');
    }

    console.log('💡 Fix: Replace hardcoded hex codes with CSS variables `var(--...)` from src/index.css.');
    process.exit(1);
  }
}

main();
