@echo off
echo ========================================
echo FIXING PUSH & DEPLOYING TO RENDER
echo ========================================
echo.

REM Set Git path
set GIT_PATH=C:\Program Files\Git\cmd
set PATH=%GIT_PATH%;%PATH%

cd /d "C:\Users\nitin\OneDrive\E comerse website\nexcart"

echo Removing problematic files from tracking...
git rm --cached deploy-to-render-guide.html COMPLETE-DEPLOYMENT-GUIDE.md DEPLOY-BACKEND.md RENDER-DEPLOY-CHECKLIST.md RENDER-QUICK-REFERENCE.txt DEPLOYMENT-ARCHITECTURE.md DEPLOYMENT.md 2>nul
echo.

echo Committing render.yaml fix...
git add backend/render.yaml
git commit -m "Fix: Add rootDir to render.yaml for correct deployment"
echo.

echo Pushing to GitHub...
git push origin main --force

echo.
echo ========================================
echo CHECK RESULT
echo ========================================
echo.
pause
