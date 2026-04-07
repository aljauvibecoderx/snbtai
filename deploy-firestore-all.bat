@echo off
echo ========================================================
echo Deploying Firestore Rules and Indexes to Firebase...
echo ========================================================
echo.
echo Step 1: Deploying Rules...
call firebase deploy --only firestore:rules
echo.
echo Step 2: Deploying Indexes...
call firebase deploy --only firestore:indexes
echo.
echo ========================================================
echo Deployment Complete!
echo.
echo IMPORTANT:
echo - Rules are active immediately
echo - Indexes may take 2-5 minutes to build
echo - Refresh your browser after deployment
echo ========================================================
pause
