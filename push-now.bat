@echo off
echo ========================================
echo PUSHING NEXCART TO GITHUB
echo ========================================
echo.

REM Set Git path
set GIT_PATH=C:\Program Files\Git\cmd
set PATH=%GIT_PATH%;%PATH%

cd /d "C:\Users\nitin\OneDrive\E comerse website\nexcart"

echo Adding remote origin...
git remote add origin https://github.com/nitinkmclu9/nexcart.git
echo [OK] Remote added
echo.

echo Switching to main branch...
git branch -M main
echo [OK] Branch renamed to main
echo.

echo ========================================
echo PUSHING TO GITHUB...
echo ========================================
echo.
echo You will be prompted for credentials:
echo - Username: nitinkmclu9
echo - Password: Your GitHub TOKEN (not password!)
echo.
echo ========================================
echo.

git push -u origin main

echo.
echo ========================================
if %errorlevel% equ 0 (
    echo SUCCESS! Code pushed to GitHub!
    echo.
    echo Your repository: https://github.com/nitinkmclu9/nexcart
    echo.
    echo Next: Deploy to Render at https://render.com
) else (
    echo PUSH FAILED!
    echo.
    echo Possible issues:
    echo 1. Repository doesn't exist on GitHub - Create it at: https://github.com/new
    echo 2. Wrong token - Create new token at: https://github.com/settings/tokens
    echo 3. Token expired - Revoke and create new one
)
echo ========================================
echo.
pause
