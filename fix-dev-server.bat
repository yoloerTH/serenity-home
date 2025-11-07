@echo off
REM Fix for MIME type module script error in Vite development server

echo Fixing Vite MIME type error...
echo.

REM Step 1: Clear Vite cache
echo 1. Clearing Vite cache...
if exist node_modules\.vite rmdir /s /q node_modules\.vite
if exist dist rmdir /s /q dist

REM Step 2: Clear node_modules cache
echo 2. Clearing dependency cache...
if exist node_modules\.cache rmdir /s /q node_modules\.cache

REM Step 3: Rebuild
echo 3. Rebuilding project...
call npm run build

echo.
echo Done! Now:
echo    1. Clear your browser cache (Ctrl+Shift+Delete)
echo    2. Run: npm run dev
echo    3. Hard refresh browser (Ctrl+Shift+R)
echo.
pause
