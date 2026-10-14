@echo off
title Trien khai Website Lang Giao Tac
echo ========================================================
echo   DANG XUAT BAN WEBSITE LEN FIREBASE HOSTING
echo ========================================================
echo.
echo [1/3] Kiem tra va dang nhap Firebase...
call npx -y firebase-tools login
echo.
echo [2/3] Dong goi Frontend (Build)...
cd /d "%~dp0frontend"
call npm run build
cd /d "%~dp0"
echo.
echo [3/3] Tai len Firebase Hosting...
call npx -y firebase-tools deploy --only hosting
echo.
echo ========================================================
echo   HOAN TAT XUAT BAN!
echo   Website: https://lang-giao-tac-tdp9.web.app
echo ========================================================
pause
