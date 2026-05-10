import os
from gtts import gTTS
from openai import OpenAI
from elevenlabs import ElevenLabs
from dotenv import load_dotenv

load_dotenv()

class TTSEngine:
    def __init__(self):
        self.openai_client = None
        self.eleven_client = None
        
        if os.getenv("OPENAI_API_KEY"):
            self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        if os.getenv("ELEVENLABS_API_KEY"):
            self.eleven_client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

    async def generate_audio(self, text, output_path, voice_type="Neutral AI Voice", provider="gtts"):
        if provider == "openai" and self.openai_client:
            return self._generate_openai(text, output_path, voice_type)
        elif provider == "elevenlabs" and self.eleven_client:
            return self._generate_elevenlabs(text, output_path, voice_type)
        else:
            return self._generate_gtts(text, output_path)

    def _generate_gtts(self, text, output_path):
        tts = gTTS(text=text, lang='en')
        tts.save(output_path)
        return output_path

    def _generate_openai(self, text, output_path, voice_type):
        # Map voice_type to OpenAI voices: alloy, echo, fable, onyx, nova, shimmer
        voice_map = {
            "Male Narrator": "onyx",
            "Female Narrator": "shimmer",
            "Neutral AI Voice": "alloy",
            "Teacher Voice": "fable",
            "Character Voice": "nova"
        }
        voice = voice_map.get(voice_type, "alloy")
        
        response = self.openai_client.audio.speech.create(
            model="tts-1",
            voice=voice,
            input=text
        )
        response.stream_to_file(output_path)
        return output_path

    def _generate_elevenlabs(self, text, output_path, voice_type):
        # Simplified ElevenLabs call
        audio = self.eleven_client.generate(
            text=text,
            voice="Rachel", # Default voice
            model="eleven_multilingual_v2"
        )
        with open(output_path, "wb") as f:
            for chunk in audio:
                f.write(chunk)
        return output_path
