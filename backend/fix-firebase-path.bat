@echo off
echo ============================================
echo   ACTUALIZACION DE CONFIGURACION DE FIREBASE
echo ============================================
echo.
echo Este script te ayudara a configurar Firebase correctamente.
echo.
echo IMPORTANTE: Asegurate de tener el archivo de credenciales JSON
echo en el directorio backend/ antes de continuar.
echo.
pause

echo.
echo Actualizando .env con ruta relativa...
echo.

cd /d "%~dp0"

REM Verificar si existe .env
if not exist ".env" (
    echo ERROR: No se encontro el archivo .env
    echo Copia .env.example a .env primero:
    echo   copy .env.example .env
    pause
    exit /b 1
)

REM Hacer backup
echo Creando backup de .env...
copy .env .env.backup >nul
echo Backup creado: .env.backup

REM Actualizar la ruta de Firebase
powershell -Command "(Get-Content .env) -replace 'FIREBASE_CREDENTIALS_PATH=C:/Users/.*?/.*?/marketing-crm-93b99-firebase-adminsdk-fbsvc-45b38eae6a.json', 'FIREBASE_CREDENTIALS_PATH=./marketing-crm-93b99-firebase-adminsdk-fbsvc-45b38eae6a.json' | Set-Content .env"

echo.
echo ============================================
echo   CONFIGURACION ACTUALIZADA
echo ============================================
echo.
echo La ruta de Firebase ahora usa una ruta relativa.
echo.
echo SIGUIENTE PASO:
echo   1. Coloca tu archivo de credenciales Firebase JSON
echo      en el directorio backend/ (este directorio)
echo.
echo   2. Verifica que el nombre del archivo coincida con:
echo      marketing-crm-93b99-firebase-adminsdk-fbsvc-45b38eae6a.json
echo.
echo   3. Inicia el servidor con: mvn spring-boot:run
echo.
pause
