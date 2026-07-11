@echo off
chcp 65001 >nul
title AI Agent Hub - GitHub Uploader

echo ============================================
echo   AI Agent Hub - GitHub 上传工具
echo ============================================
echo.

set GIT="C:\Users\21327\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe"

echo 正在准备上传到 GitHub...
echo 仓库: https://github.com/blcx6969/菠萝2号
echo.

cd /d "%~dp0"
%GIT% add -A
%GIT% commit -m "update: AI Agent Hub v1.0.0"
%GIT% push -u origin main

echo.
if %errorlevel% equ 0 (
    echo [成功] 已上传到 GitHub!
) else (
    echo [提示] 如果失败，请确保:
    echo  1. 已在 GitHub 创建仓库: https://github.com/new
    echo     - 仓库名: 菠萝2号
    echo  2. 已在 GitHub 生成 Personal Access Token
    echo     - 设置 Token 后运行: git push -u origin main
    echo.
    echo  或者运行以下命令手动推送:
    echo  git push https://YOUR_TOKEN@github.com/blcx6969/菠萝2号.git main
)

pause
