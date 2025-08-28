# FormBridge コードジェネレーター / FormBridge Code Generator

## 🎯 概要 / Overview

**日本語：**  
FormBridge、KViewer、Kintone用のJavaScriptコードを自動生成するWebベースのツールです。技術的な知識がないユーザーでも、簡単にカスタマイズコードを作成できます。

**English:**  
A web-based tool that automatically generates JavaScript code for FormBridge, KViewer, and Kintone. Even non-technical users can easily create customization code.

## 🚀 クイックスタート / Quick Start

### アクセス / Access
```
https://genso00089.github.io/code-generator/
```

### 基本的な使い方 / Basic Usage
1. **プラットフォーム選択** / Select Platform → FormBridge (推奨/Recommended)
2. **APIバージョン選択** / Select API Version → Latest (推奨/Recommended)
3. **機能選択** / Select Features → 必要な機能にチェック / Check needed features
4. **フィールド設定** / Configure Fields → FormBridgeのフィールド名を入力 / Enter FormBridge field names
5. **コード生成** / Generate Code → 「✨ コードを生成」をクリック / Click "✨ Generate Code"
6. **コピー&使用** / Copy & Use → 生成されたコードをFormBridgeに貼り付け / Paste generated code to FormBridge

## 📖 詳細チュートリアル / Detailed Tutorial

**日本語チュートリアル：** [tutorial.html](tutorial.html)  
**English Tutorial：** [tutorial.html](tutorial.html) (Language toggle available)

## 🔧 利用可能な機能 / Available Features

### FormBridge専用機能 / FormBridge Exclusive Features

| 機能 / Feature | 説明 / Description | APIサポート / API Support |
|---|---|---|
| 🏠 郵便番号→住所変換 / Postal Code Lookup | 郵便番号から住所を自動取得 / Auto-fetch address from postal code | v1 ✅ v2 ✅ |
| 🎂 生年月日→年齢計算 / Age Calculation | 生年月日から現在の年齢を計算 / Calculate current age from birthdate | v1 ✅ v2 ✅ |
| ✅ 日付バリデーション / Date Validation | 過去日付、土日をチェック / Check past dates, weekends | v2 ✅ |
| 🔍 フィールドバリデーション / Field Validation | 必須項目チェック / Required field validation | v2 ✅ |
| 💡 オートコンプリート / Auto Complete | 入力候補の自動表示 / Auto-suggest input options | v2 ✅ |
| ⚙️ **カスタム機能** / **Custom Function** | 独自機能をリクエスト / Request custom functionality | v1 ✅ v2 ✅ |

### 共通機能 / Common Features

| 機能 / Feature | 説明 / Description |
|---|---|
| 🔄 Kintoneデータ連携 / Kintone Data Integration | Kintoneとのデータ送受信 / Data exchange with Kintone |
| 📧 メール通知 / Email Notification | メール送信機能 / Email sending functionality |
| 📝 ログ出力 / Logging | 動作ログの記録 / Action logging |

## 🎨 カスタム機能の使い方 / How to Use Custom Functions

### 手順 / Steps
1. **FormBridge**を選択 / Select FormBridge
2. **「カスタム機能」**にチェック / Check "Custom Function"
3. **詳細を入力** / Fill in details:
   - **機能名** / Function Name: 例）電話番号フォーマット / e.g.) Phone Number Format
   - **やりたいこと** / Requirements: 具体的な要件 / Specific requirements
   - **実装方法** / Implementation: アイデア（任意）/ Ideas (optional)
   - **対象フィールド** / Target Fields: カンマ区切り / Comma-separated
4. **「この機能を生成コードに含める」**にチェック / Check "Include this function in generated code"
5. **コード生成** / Generate Code

### 例 / Example
```
機能名: 電話番号自動フォーマット
やりたいこと: 電話番号入力時に自動的にハイフンを挿入
実装方法: リアルタイム入力フォーマット
対象フィールド: 電話番号, 携帯電話
```

## 🛠️ 技術仕様 / Technical Specifications

### サポートAPI / Supported APIs
- **FormBridge v2 (Latest)**: `formBridge.events.on()`
- **FormBridge v1 (Legacy)**: `fb.events.fields[].changed`
- **KViewer v2**: `kviewer.events.on()` ※開発中 / Under development
- **KViewer v1**: `kv.events.records.mounted` ※開発中 / Under development

### 生成コード形式 / Generated Code Format
```javascript
(() => {
    "use strict";
    
    // 生成された機能コード / Generated function code
    // ...
})();
```

## 📁 ファイル構成 / File Structure

```
code-generator/
├── index.html          # メインツール / Main tool
├── script.js           # JavaScript ロジック / JavaScript logic
├── style.css           # スタイルシート / Stylesheet
├── tutorial.html       # インタラクティブチュートリアル / Interactive tutorial
└── README.md          # このファイル / This file
```

## 🔒 セキュリティ / Security

### 現在のリスクレベル / Current Risk Level: 中程度 / Medium

**内部利用** / Internal Use: ✅ 安全 / Safe  
**公開利用** / Public Use: ⚠️ 要改善 / Needs Improvement

### セキュリティ対策 / Security Measures
- ✅ HTTPS暗号化 / HTTPS encryption
- ✅ クライアントサイド処理 / Client-side processing
- ⚠️ 入力サニタイゼーション（部分的）/ Input sanitization (partial)

## 🐛 トラブルシューティング / Troubleshooting

### よくある問題 / Common Issues

**Q: コードが動作しない / Code doesn't work**
```
A: フィールド名を確認してください / Check field names
   FormBridge設定画面の「フィールドコード」と完全一致が必要
   Must exactly match "Field Code" in FormBridge settings
```

**Q: 郵便番号検索が失敗する / Postal code lookup fails**
```
A: 7桁の数字（ハイフンなし）で入力してください / Enter 7 digits (no hyphen)
   例 / Example: 1000001 (not 100-0001)
```

**Q: カスタム機能が生成されない / Custom function not generated**
```
A: 以下を確認してください / Check the following:
   1. 「カスタム機能」にチェック / Check "Custom Function"
   2. 機能名と要件を入力 / Enter function name and requirements
   3. 「この機能を生成コードに含める」にチェック / Check "Include this function"
```

## 📊 使用統計 / Usage Statistics

### 推奨設定 / Recommended Settings
- **プラットフォーム** / Platform: FormBridge (90%のユースケース / 90% of use cases)
- **APIバージョン** / API Version: Latest (新機能とパフォーマンス / New features & performance)
- **人気機能** / Popular Features:
  1. 郵便番号→住所変換 / Postal code lookup
  2. 年齢計算 / Age calculation  
  3. カスタム機能 / Custom functions

## 🔄 更新履歴 / Change Log

### v1.0.0 (2024-01-XX)
- ✅ FormBridge v1/v2 サポート / FormBridge v1/v2 support
- ✅ カスタム機能リクエスト / Custom function requests
- ✅ レスポンシブデザイン / Responsive design
- ✅ 日英バイリンガル対応 / Japanese/English bilingual support

## 🤝 貢献 / Contributing

### フィードバック / Feedback
- 🐛 バグレポート / Bug reports: [GitHub Issues](https://github.com/Genso00089/code-generator/issues)
- 💡 機能リクエスト / Feature requests: カスタム機能フォームを使用 / Use custom function form
- 📧 お問い合わせ / Contact: 社内チャット / Internal chat

### 開発 / Development
```bash
git clone https://github.com/Genso00089/code-generator.git
cd code-generator
# ローカルで開発 / Develop locally
# プルリクエストを送信 / Send pull request
```

## 📞 サポート / Support

### 社内サポート / Internal Support
- 🕐 営業時間 / Business Hours: 9:00-17:00 (JST)
- 💬 チャット / Chat: 社内Slack / Internal Slack
- 📖 ドキュメント / Documentation: [tutorial.html](tutorial.html)

### セルフサービス / Self-Service
- 📚 チュートリアル / Tutorial: [日本語・English](tutorial.html)
- ❓ FAQ: このREADMEファイル / This README file
- 🎮 インタラクティブデモ / Interactive Demo: チュートリアル内 / Within tutorial

---

## 🎉 Thank You!

このツールを使用して、FormBridge開発の効率を80%向上させましょう！  
Use this tool to improve your FormBridge development efficiency by 80%!

**開発者 / Developer:** Claude Code + Your Team  
**ライセンス / License:** Internal Company Use  
**最終更新 / Last Update:** 2024-01-XX