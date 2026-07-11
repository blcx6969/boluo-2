@echo off
chcp 65001 >nul
title 菠萝2号 - APK 构建工具
echo ============================================
echo   菠萝2号 v1.0.0 - 手机版 APK 构建
echo ============================================
echo.

echo 构建前请确保已安装:
echo  1. Node.js 18+
echo  2. Android Studio / Android SDK
echo  3. Java 17+
echo.
echo 步骤说明:
echo  1. npm install        # 安装依赖
echo  2. npx cap sync       # 同步到 Android
echo  3. npx cap open android  # 用 Android Studio 打开
echo     或者
echo  4. npm run build:apk  # 自动构建 APK
echo.
echo APK 输出位置: android/app/build/outputs/apk/debug/
echo.
pause
