# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field
from typing import List, Optional, Union

# Stage 1 Models
class TTSNotes(BaseModel):
    emotion: str
    pause_required: bool

class ContentSection(BaseModel):
    section_type: str
    chapter_title: Optional[str] = None
    speaker: Optional[str] = None
    chunk_id: str
    text: str
    tts_notes: TTSNotes

class BookMetadata(BaseModel):
    language: str
    narration_style: str
    chapter_detected: bool

class Stage1Output(BaseModel):
    book_metadata: BookMetadata
    content: List[ContentSection]

# Stage 2 Models
class AudiobookChunk(BaseModel):
    chunk_id: str
    voice_type: str
    emotion: str
    speaking_speed: str
    pause_duration: str
    emphasis_words: List[str]
    pronunciation_notes: List[str]
    ssml: str
    final_text: str

class Stage2Output(BaseModel):
    audiobook_output: List[AudiobookChunk]

# Stage 3 Models
class BackgroundMusic(BaseModel):
    recommended: bool
    music_type: Optional[str] = None
    intensity: Optional[str] = None
    placement: Optional[str] = None

class AmbientEffect(BaseModel):
    chunk_id: str
    effect_type: str
    timing: str
    volume_level: str

class VoiceConsistency(BaseModel):
    narrator_voice_locked: bool
    character_voice_mapping: List[dict]
    pronunciation_dictionary: List[str]
    consistency_warnings: List[str]

class ChapterTransition(BaseModel):
    transition_type: str
    duration: str
    notes: str

class AudioMastering(BaseModel):
    volume_normalization: str
    noise_reduction: str
    compression_level: str
    stereo_mode: str

class DubbingMetadata(BaseModel):
    supported_languages: List[str]
    speaker_alignment_required: bool
    timing_sync_required: bool

class Accessibility(BaseModel):
    slow_mode_available: bool
    subtitle_sync: bool
    enhanced_pronunciation: bool

class Packaging(BaseModel):
    genre: str
    estimated_duration: str
    chapter_count: int
    podcast_segmentation: bool
    cover_art_theme: str

class Stage3Output(BaseModel):
    production_output: dict # Using dict for the full nested structure defined in the prompt
