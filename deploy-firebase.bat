@echo off
chcp 65001 >nul
echo ========================================================
echo   TRIỂN KHAI WEBSITE LÀNG GIAO TÁC LÊN FIREBASE HOSTING
echo ========================================================
echo.
echo 1. Kiểm tra đăng nhập Firebase...
call npx firebase-tools login
echo.
echo 2. Tiến hành đóng gói (Build) bản mới nhất của Frontend...
cd frontend
call npm run build
cd ..
echo.
echo 3. Tiến hành xuất bản lên Firebase Hosting...
call npx firebase-tools deploy --only hosting
echo.
echo ========================================================
echo   🎉 ĐÃ TRIỂN KHAI THÀNH CÔNG!
echo   👉 Địa chỉ website chính thức: https://lang-giao-tac-tdp9.web.app
echo ========================================================
pause
