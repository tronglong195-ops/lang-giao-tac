@echo off
chcp 65001 >nul
title Lang Giao Tac - Nap tin tuc, album anh & bai viet len Firestore

echo =======================================================
echo   NAP TIN TUC, ALBUM ANH & BAI VIET LEN CLOUD FIRESTORE
echo =======================================================
echo.

set ROOT=%~dp0
cd /d "%ROOT%frontend"

echo [1/2] Dang nap toan bo Tin tuc moi, Album anh Fanpage va Bai viet...
node scripts/seedFullCommunityAndMedia.mjs
if %errorlevel% neq 0 (
  echo.
  echo [!] Luu y: Neu bi bao thieu quyen, se thu bang khoa Service Account...
  if exist "scripts\serviceAccountKey.json" (
    call npm run seed:tin-tuc
  )
)

echo.
echo =======================================================
echo Hoan tat! Xem ket qua tai:
echo https://lang-giao-tac-tdp9.web.app/tin-tuc
echo https://lang-giao-tac-tdp9.web.app/thu-vien-anh
echo =======================================================
echo.
pause
