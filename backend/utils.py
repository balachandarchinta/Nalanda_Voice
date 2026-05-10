# pyrefly: ignore [missing-import]
import pdfplumber
import pytesseract
from PIL import Image
import io
from pydub import AudioSegment
import os

def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
                else:
                    # If no text, try OCR on the page image
                    img = page.to_image().original
                    text += pytesseract.image_to_string(img) + "\n"
    except Exception as e:
        print(f"Error extracting text: {e}")
        # Fallback to simple OCR if pdfplumber fails or for image-only PDFs
        try:
            # This is a very basic fallback, could be improved
            pass
        except:
            pass
    return text

def merge_audio_files(audio_files, output_path):
    combined = AudioSegment.empty()
    for file in audio_files:
        segment = AudioSegment.from_file(file)
        combined += segment
    combined.export(output_path, format="mp3")
    return output_path
