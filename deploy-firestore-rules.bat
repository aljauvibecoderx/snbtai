@echo off
echo =======================================================
echo Deploying Firestore Rules to Firebase...
echo =======================================================
echo.
echo Make sure you have installed Firebase CLI globally:
echo npm install -g firebase-tools
echo And logged in: firebase login
echo.
call firebase deploy --only firestore:rules
echo.
echo =======================================================
echo Deployment attempted. Read the logs above for success.
echo =======================================================
pause
