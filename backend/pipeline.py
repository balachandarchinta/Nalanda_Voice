import os
import json
from google import genai
from dotenv import load_dotenv
from models import Stage1Output, Stage2Output, Stage3Output

load_dotenv()

# Configure Gemini
api_key = os.getenv("GOOGLE_API_KEY")
if api_key:
    client = genai.Client(api_key=api_key)
else:
    client = None

class AudiobookPipeline:
    def __init__(self):
        self.system_prompts = {
            "stage1": """Role: You are a strict Book Content Extraction & Structuring Engine.
Your sole purpose is to extract, clean, classify, and structure book content for audiobook generation without adding creative interpretation.
Task: Analyze raw OCR/book text and return structured chapter-wise narration-ready content.
Objectives: Detect chapter boundaries, Clean OCR noise, Preserve paragraph flow, Identify dialogues, Detect language, Extract narration metadata, Prepare content chunks for TTS.
Output ONLY valid JSON.""",
            "stage2": """Role: You are a controlled Audiobook Narration Generation Engine.
Your task is to transform structured book content into Text-to-Speech optimized narration instructions.
You must generate: voice guidance, pacing controls, SSML-compatible narration metadata, speaker handling, emotion mapping without changing the original text.
Output ONLY valid JSON.""",
            "stage3": """Role: You are a professional Audiobook Enhancement & Production Engine.
Your sole purpose is to enhance generated audiobook narration into a polished, immersive, production-ready audiobook experience.
You must improve listening quality while preserving the integrity of the original narration.
Output ONLY valid JSON."""
        }

    async def run_stage1(self, raw_text: str):
        if not client:
            return {"error": "API Key not configured"}
        
        prompt = f"{self.system_prompts['stage1']}\n\nInput Text:\n{raw_text}\n\nOutput Schema: {json.dumps(Stage1Output.model_json_schema())}"
        response = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=prompt
        )
        return json.loads(response.text)

    async def run_stage2(self, stage1_json: dict):
        if not client:
            return {"error": "API Key not configured"}
        
        prompt = f"{self.system_prompts['stage2']}\n\nInput JSON:\n{json.dumps(stage1_json)}\n\nOutput Schema: {json.dumps(Stage2Output.model_json_schema())}"
        response = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=prompt
        )
        return json.loads(response.text)

    async def run_stage3(self, stage2_json: dict):
        if not client:
            return {"error": "API Key not configured"}
        
        prompt = f"{self.system_prompts['stage3']}\n\nInput JSON:\n{json.dumps(stage2_json)}\n\nOutput Schema: {json.dumps(Stage3Output.model_json_schema())}"
        response = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=prompt
        )
        return json.loads(response.text)
