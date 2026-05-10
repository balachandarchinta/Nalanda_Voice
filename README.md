# Audiobook Platform

A professional audiobook generation platform using a 3-stage AI pipeline.

## Features
- **Stage 1**: OCR cleanup, chapter detection, and content structuring.
- **Stage 2**: Narration generation with SSML optimization and voice assignment.
- **Stage 3**: Production enhancement with ambient sound design and mastering.
- **TTS Support**: gTTS (default), OpenAI TTS, and ElevenLabs.
- **Premium UI**: Dark mode, glassmorphism dashboard.

## Setup

### Prerequisites
- Python 3.9+
- Node.js 16+
- Tesseract OCR (for scanned PDFs)

### Installation

1. **Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
   Create a `.env` file in the `backend` directory (copy from `.env.example`).

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   ```

### Running the App

1. **Start Backend**:
   ```bash
   cd backend
   python main.py
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

## License
MIT
