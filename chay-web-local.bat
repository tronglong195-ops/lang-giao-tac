@echo off
chcp 65001 >nul
title Lang Giao Tac - Khoi chay Local Dev

echo ============================================
echo   KHOI CHAY WEB LANG GIAO TAC (LOCAL DEV)
echo ============================================
echo.

REM --- Thu muc goc cua du an (noi dat file .bat nay) ---
set ROOT=%~dp0

echo [1/2] Dang mo cua so Backend (cong 5000)...
start "Lang Giao Tac - BACKEND (5000)" cmd /k "cd /d "%ROOT%backend" && npx prisma db push && npm run prisma:seed && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/2] Dang mo cua so Frontend (cong 5173)...
start "Lang Giao Tac - FRONTEND (5173)" cmd /k "cd /d "%ROOT%frontend" && npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo Dang mo trinh duyet tai http://localhost:5173 ...
start "" "http://localhost:5173"

echo.
echo ============================================
echo   Neu bao loi ket noi Database:
echo   - Kiem tra PostgreSQL da cai va dang chay
echo     (Windows: Services ^> postgresql-x64-... ^> Running)
echo   - Kiem tra file backend\.env co DATABASE_URL dung
echo     voi user/mat khau PostgreSQL tren may ban
echo ============================================
echo.
pause
