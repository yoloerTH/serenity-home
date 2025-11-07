#!/bin/bash
# Fix for MIME type module script error in Vite development server

echo "🔧 Fixing Vite MIME type error..."

# Step 1: Stop any running dev servers
echo "1. Stopping any running dev servers..."
pkill -f "vite" 2>/dev/null || true

# Step 2: Clear Vite cache
echo "2. Clearing Vite cache..."
rm -rf node_modules/.vite
rm -rf dist

# Step 3: Clear node_modules cache (optional but recommended)
echo "3. Clearing dependency cache..."
rm -rf node_modules/.cache

# Step 4: Rebuild
echo "4. Rebuilding project..."
npm run build

echo ""
echo "✅ Done! Now:"
echo "   1. Clear your browser cache (Ctrl+Shift+Delete)"
echo "   2. Run: npm run dev"
echo "   3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)"
echo ""
