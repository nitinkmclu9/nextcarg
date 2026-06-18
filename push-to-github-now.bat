@echo off
echo ========================================
echo PUSHING TO GITHUB NOW
echo ========================================
echo.

REM Set Git path
set GIT_PATH=C:\Program Files\Git\cmd
set PATH=%GIT_PATH%;%PATH%

cd /d "C:\Users\nitin\OneDrive\E comerse website\nexcart"

echo Removing old remote...
git remote remove origin 2>nul

echo Adding remote with authentication...
git remote add origin https://nitinkmclu9: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@github.com/nitinkmclu9/nexcart.git
echo [OK] Remote configured
echo.

echo Switching to main branch...
git branch -M main
echo [OK] Branch is main
echo.

echo ========================================
echo PUSHING TO GITHUB...
echo ========================================
echo.

git push -u origin main --force

echo.
echo ========================================
if %errorlevel% equ 0 (
    echo SUCCESS! 
    echo.
    echo Your repository: https://github.com/nitinkmclu9/nexcart
    echo.
    echo Next step: Deploy to Render
) else (
    echo PUSH FAILED!
    echo.
    echo Check:
    echo 1. Repository exists at https://github.com/nitinkmclu9/nexcart
    echo 2. Token is valid (not expired/revoked)
)
echo ========================================
echo.
pause
