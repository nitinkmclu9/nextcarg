@echo off
echo ========================================
echo PUSHING RESTRUCTURED PROJECT TO GITHUB
echo ========================================
echo.

REM Set Git path
set GIT_PATH=C:\Program Files\Git\cmd
set PATH=%GIT_PATH%;%PATH%

cd /d "C:\Users\nitin\OneDrive\E comerse website\nexcart"

echo Storing credentials securely...
git config --global credential.helper store

echo Setting remote URL...
git remote set-url origin https://github.com/nitinkmclu9/nexcart.git

echo.
echo ========================================
echo PUSHING TO GITHUB...
echo ========================================
echo.
echo You will be prompted ONCE for credentials:
echo - Username: nitinkmclu9
echo - Password: Your GitHub TOKEN
echo.
echo After this, credentials will be saved!
echo.
echo ========================================
echo.

git push -u origin main --force

echo.
echo ========================================
if %errorlevel% equ 0 (
    echo SUCCESS! 
    echo.
    echo Repository: https://github.com/nitinkmclu9/nexcart
    echo.
    echo Project restructured - backend is now at root!
    echo Ready to deploy on Render with NO Root Directory setting.
) else (
    echo PUSH FAILED!
    echo.
    echo Try manual push:
    echo git push -u origin main --force
)
echo ========================================
echo.
pause
