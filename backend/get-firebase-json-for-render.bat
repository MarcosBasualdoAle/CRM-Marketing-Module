@echo off
echo ============================================================
echo   PREPARAR CREDENCIALES DE FIREBASE PARA RENDER
echo ============================================================
echo.
echo Este script te ayudara a preparar las credenciales de Firebase
echo para copiarlas directamente a Render como variable de entorno.
echo.

cd /d "%~dp0"

REM Buscar el archivo JSON de Firebase
set "FIREBASE_FILE=marketing-crm-93b99-firebase-adminsdk-fbsvc-45b38eae6a.json"

if not exist "%FIREBASE_FILE%" (
    echo ERROR: No se encontro el archivo de credenciales de Firebase.
    echo.
    echo Archivo esperado: %FIREBASE_FILE%
    echo Ubicacion esperada: %CD%
    echo.
    echo Por favor, coloca el archivo en este directorio y vuelve a ejecutar.
    pause
    exit /b 1
)

echo Archivo encontrado: %FIREBASE_FILE%
echo.
echo ============================================================
echo   CONTENIDO PARA COPIAR A RENDER
echo ============================================================
echo.
echo IMPORTANTE: Copia TODO el texto que aparece a continuacion
echo            (desde { hasta })
echo.
echo Variable en Render: FIREBASE_CREDENTIALS_JSON
echo.
echo --- INICIO DEL JSON ---
type "%FIREBASE_FILE%"
echo.
echo --- FIN DEL JSON ---
echo.
echo ============================================================
echo.
echo PASOS SIGUIENTES:
echo.
echo 1. Ve a Render Dashboard ^> Tu servicio ^> Environment
echo.
echo 2. Agrega una nueva variable:
echo    Nombre:  FIREBASE_CREDENTIALS_JSON
echo    Valor:   ^(pega el JSON de arriba, desde { hasta }^)
echo.
echo 3. Agrega otra variable:
echo    Nombre:  FIREBASE_STORAGE_BUCKET
echo    Valor:   marketing-crm-93b99.firebasestorage.app
echo.
echo 4. Guarda los cambios y espera a que Render reinicie
echo.
echo ============================================================
pause
