@echo off
chcp 65001 >nul
title Lang Giao Tac - Nap bai tin tuc len Firestore

echo ============================================
echo   NAP BAI TIN TUC LEN CLOUD FIRESTORE
echo ============================================
echo.

set ROOT=%~dp0
cd /d "%ROOT%frontend"

if not exist "scripts\serviceAccountKey.json" (
  echo [!] Chua co khoa Service Account.
  echo     Firebase Console ^> Project settings ^> Service accounts
  echo     ^> Generate new private key, luu thanh:
  echo     frontend\scripts\serviceAccountKey.json
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\firebase-admin" (
  echo Dang cai dat thu vien firebase-admin...
  call npm install
)

call npm run seed:tin-tuc
echo.
pause
