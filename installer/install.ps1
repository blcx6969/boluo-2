# 菠萝2号 - PowerShell Installer
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  菠萝2号 v1.0.0 - " -NoNewline -ForegroundColor Cyan
Write-Host "安装程序" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
try {
    $nodeVer = node --version
    Write-Host "[`u{221A}] Node.js 已检测: $nodeVer" -ForegroundColor Green
} catch {
    Write-Host "[错误] 未检测到 Node.js，请先安装 Node.js 16+" -ForegroundColor Red
    Write-Host "下载地址: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "按回车键退出"
    exit 1
}

# Set project root
$projectRoot = Resolve-Path "$PSScriptRoot\.."
Set-Location $projectRoot
Write-Host "`n安装目录: $projectRoot" -ForegroundColor Gray

# Install dependencies
Write-Host "`n[*] 正在安装依赖..." -ForegroundColor Yellow
npm install --loglevel=error
if ($LASTEXITCODE -ne 0) {
    Write-Host "[错误] 依赖安装失败" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}
Write-Host "[`u{221A}] 依赖安装完成" -ForegroundColor Green

# Build options
Write-Host "`n请选择操作:" -ForegroundColor White
Write-Host "  1) 直接启动应用 (开发模式)" -ForegroundColor Cyan
Write-Host "  2) 构建安装包 (推荐)" -ForegroundColor Cyan
Write-Host "  3) 构建便携版" -ForegroundColor Cyan
Write-Host ""

$choice = Read-Host "请输入选项 (1/2/3)"

switch ($choice) {
    "1" {
        Write-Host "`n[*] 正在启动 菠萝2号..." -ForegroundColor Yellow
        npm start
    }
    "2" {
        Write-Host "`n[*] 正在构建 Windows 安装包..." -ForegroundColor Yellow
        npm run build:win
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[`u{221A}] 安装包构建完成!" -ForegroundColor Green
            Write-Host "文件位置: dist\菠萝2号-Setup-1.0.0.exe" -ForegroundColor White
        } else {
            Write-Host "[错误] 构建失败" -ForegroundColor Red
        }
    }
    "3" {
        Write-Host "`n[*] 正在构建便携版..." -ForegroundColor Yellow
        npm run pack
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[`u{221A}] 便携版构建完成!" -ForegroundColor Green
            Write-Host "文件位置: dist\win-unpacked\" -ForegroundColor White
        } else {
            Write-Host "[错误] 构建失败" -ForegroundColor Red
        }
    }
    default {
        Write-Host "[错误] 无效选项" -ForegroundColor Red
    }
}

Read-Host "`n按回车键退出"
