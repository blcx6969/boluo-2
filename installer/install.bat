@echo off
chcp 65001 >nul
title 菠萝2号 Installer
echo ============================================
echo   菠萝2号 v1.0.0 - 安装程序
echo ============================================
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js 16+
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo [√] Node.js 已检测

REM Check npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 npm
    pause
    exit /b 1
)

echo [√] npm 已检测

REM Set project root
set PROJECT_DIR=%~dp0..
cd /d "%PROJECT_DIR%"
echo.
echo 安装目录: %CD%
echo.

REM Install dependencies
echo [*] 正在安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo [错误] 依赖安装失败
    pause
    exit /b 1
)
echo [√] 依赖安装完成

REM Ask build option
echo.
echo 请选择构建选项:
echo  1) 直接启动应用 (开发模式)
echo  2) 构建安装包 (推荐)
echo  3) 构建便携版
echo.
set /p choice="请输入选项 (1/2/3): "

if "%choice%"=="1" (
    echo.
    echo [*] 正在启动 菠萝2号...
    call npm start
) else if "%choice%"=="2" (
    echo.
    echo [*] 正在构建 Windows 安装包...
    call npm run build:win
    if %errorlevel% equ 0 (
        echo [√] 安装包构建完成!
        echo 文件位置: dist\菠萝2号-Setup-1.0.0.exe
    ) else (
        echo [错误] 构建失败
    )
) else if "%choice%"=="3" (
    echo.
    echo [*] 正在构建便携版...
    call npm run pack
    if %errorlevel% equ 0 (
        echo [√] 便携版构建完成!
        echo 文件位置: dist\win-unpacked\
    ) else (
        echo [错误] 构建失败
    )
) else (
    echo [错误] 无效选项
)

echo.
pause
