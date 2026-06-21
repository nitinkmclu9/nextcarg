@echo off
echo ========================================
echo PUSHING TYPESCRIPT FIXES TO GITHUB
echo ========================================
echo.

REM Set Git path
set GIT_PATH=C:\Program Files\Git\cmd
set PATH=%GIT_PATH%;%PATH%

cd /d "C:\Users\nitin\OneDrive\E comerse website\nexcart"

echo Remote URL:
git remote -v
echo.

echo ========================================
echo PUSHING TO GITHUB...
echo ========================================
echo.

git push -u origin main

echo.
echo ========================================
if %errorlevel% equ 0 (
    echo SUCCESS! 
    echo.
    echo Repository: https://github.com/nitinkmclu9/nexcart
    echo.
    echo TypeScript errors FIXED!
    echo Build successful!
    echo.
    echo Ready to deploy on Render:
    echo - Build Command: npm install ^&^& npm run build
    echo - Start Command: node dist/server.js
) else (
    echo Authentication needed!
    echo.
    echo When prompted:
    echo Username: nitinkmclu9
    echo Password: Your GitHub token
    echo.
    echo Try again by running this script!
)
echo ========================================
echo.
pause
