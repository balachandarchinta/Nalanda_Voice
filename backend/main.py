from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import uuid
from .utils import extract_text_from_pdf, merge_audio_files
from .pipeline import AudiobookPipeline
from .tts_engine import TTSEngine

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
AUDIO_DIR = "audio_output"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(AUDIO_DIR, exist_ok=True)

pipeline = AudiobookPipeline()
tts_engine = TTSEngine()

# In-memory storage for task status (for demo purposes)
tasks = {}

@app.post("/upload")
async def upload_book(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    task_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{task_id}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    tasks[task_id] = {"status": "processing", "stage": 0, "progress": 0}
    background_tasks.add_task(process_audiobook, task_id, file_path)
    
    return {"task_id": task_id}

@app.get("/status/{task_id}")
async def get_status(task_id: str):
    return tasks.get(task_id, {"status": "not_found"})

async def process_audiobook(task_id, file_path):
    try:
        # Stage 0: Extraction
        tasks[task_id]["stage"] = 0
        tasks[task_id]["progress"] = 10
        raw_text = extract_text_from_pdf(file_path)
        
        # Stage 1: Structuring
        tasks[task_id]["stage"] = 1
        tasks[task_id]["progress"] = 30
        stage1_data = await pipeline.run_stage1(raw_text)
        tasks[task_id]["stage1_output"] = stage1_data
        
        # Stage 2: Narration
        tasks[task_id]["stage"] = 2
        tasks[task_id]["progress"] = 50
        stage2_data = await pipeline.run_stage2(stage1_data)
        tasks[task_id]["stage2_output"] = stage2_data
        
        # Stage 3: Enhancement
        tasks[task_id]["stage"] = 3
        tasks[task_id]["progress"] = 70
        stage3_data = await pipeline.run_stage3(stage2_data)
        tasks[task_id]["stage3_output"] = stage3_data
        
        # Audio Generation
        tasks[task_id]["progress"] = 80
        audio_files = []
        for i, chunk in enumerate(stage2_data.get("audiobook_output", [])):
            chunk_audio_path = os.path.join(AUDIO_DIR, f"{task_id}_chunk_{i}.mp3")
            await tts_engine.generate_audio(chunk["final_text"], chunk_audio_path, chunk["voice_type"])
            audio_files.append(chunk_audio_path)
        
        # Final Merge
        tasks[task_id]["progress"] = 95
        final_audio_path = os.path.join(AUDIO_DIR, f"{task_id}_final.mp3")
        merge_audio_files(audio_files, final_audio_path)
        
        tasks[task_id]["status"] = "completed"
        tasks[task_id]["progress"] = 100
        tasks[task_id]["audio_url"] = f"/audio/{task_id}_final.mp3"
        
    except Exception as e:
        tasks[task_id]["status"] = "error"
        tasks[task_id]["error_message"] = str(e)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
