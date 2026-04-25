# IntelliLearn: Universal Adaptive AI Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Host: GitHub Pages](https://img.shields.io/badge/Host-GitHub_Pages-blue?logo=github)](https://pages.github.com/)

**IntelliLearn** is a lightweight, high-performance learning platform that uses on-device AI to personalize education. It adapts to your pace, detects confusion via NLP, and covers multiple subjects from Quantum Physics to Web Architecture.

![IntelliLearn UI](https://via.placeholder.com/800x450/0a0b10/00d4ff?text=IntelliLearn+Universal+AI)

## 🚀 Key Features

- **Multi-Disciplinary**: Learn ML, Quantum Physics, Web Dev, and more in one place.
- **Document Mode (Beta)**: Lightweight semantic retrieval for structured documents.
- **On-Device NLP**: Uses `Transformers.js` to run a `MobileBERT` model directly in your browser. No server required.
- **Adaptive Logic**: Automatically shifts between Basic and Advanced modules based on your interactions.
- **Zero-Dependency Hosting**: A single optimized HTML file that can be hosted anywhere (GitHub Pages, Vercel, or local).
- **Privacy First**: Your learning data and feedback never leave your device.

## 🛠️ Quick Start

### 1. Run Locally
Simply download `index.html` and open it in any modern browser.

### 2. Deploy to GitHub Pages
1. Create a new repository on GitHub.
2. Upload `index.html`.
3. Go to **Settings > Pages** and select `main` branch.
4. Your AI assistant is live!

## 🧪 AI Engine
The system leverages **Transformers.js** with a 4-bit quantized `Xenova/mobilebert-uncased-mnli` model. It performs **Zero-Shot Classification** to categorize user feedback into:
- `confused`: Triggers simplified content.
- `ready`: Advances to the next topic or complexity level.
- `bored`: Jumps to new application scenarios.

## 🤝 Contributing
We welcome contributions! Please see `CONTRIBUTING.md` for guidelines.

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
