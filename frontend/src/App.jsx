import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Settings, 
  Sparkles, 
  Play, 
  CheckCircle, 
  Loader2, 
  Download,
  BookOpen,
  Mic2,
  Music
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE = 'http://localhost:8000';

const StageStep = ({ icon: Icon, title, description, isActive, isCompleted }) => (
  <div className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-500 ${isActive ? 'bg-white/5 border border-white/10' : 'opacity-50'}`}>
    <div className={`step-indicator ${isActive || isCompleted ? 'active' : ''}`}>
      {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
    </div>
    <div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </div>
);

function App() {
  const [file, setFile] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [status, setStatus] = useState(null);
  const [progress, setProgress] = useState(0);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
    toast.success(`File "${acceptedFiles[0].name}" ready for processing`);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API_BASE}/upload`, formData);
      setTaskId(res.data.task_id);
      toast.promise(Promise.resolve(), {
        loading: 'Uploading and starting pipeline...',
        success: 'Pipeline started!',
        error: 'Upload failed',
      });
    } catch (err) {
      toast.error('Failed to upload file');
    }
  };

  useEffect(() => {
    if (!taskId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${API_BASE}/status/${taskId}`);
        setStatus(res.data);
        setProgress(res.data.progress || 0);
        
        if (res.data.status === 'completed' || res.data.status === 'error') {
          clearInterval(interval);
          if (res.data.status === 'completed') toast.success('Audiobook generated successfully!');
          if (res.data.status === 'error') toast.error(`Error: ${res.data.error_message}`);
        }
      } catch (err) {
        console.error('Status fetch error', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [taskId]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Toaster position="top-right" />
      
      <header className="mb-12 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4"
        >
          <Sparkles size={16} className="text-violet-400" />
          <span className="text-sm font-medium text-violet-200">AI-Powered Audiobook Platform</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-bold mb-4 tracking-tight"
        >
          Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-sky-400">Books</span> into Immersive <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-400">Audio</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto"
        >
          Using a high-fidelity 3-stage AI pipeline to extract, narrate, and enhance your content with professional quality.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Upload Section */}
          <div className="glass-card p-8">
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${isDragActive ? 'border-violet-500 bg-violet-500/5' : 'border-white/10 hover:border-white/20'}`}
            >
              <input {...getInputProps()} />
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                  <Upload size={32} />
                </div>
              </div>
              <p className="text-lg font-medium mb-2">
                {file ? file.name : "Drag & drop your PDF here, or click to select"}
              </p>
              <p className="text-sm text-gray-500">Supports PDF files up to 50MB</p>
            </div>
            
            <button 
              onClick={handleUpload}
              disabled={!file || taskId}
              className={`btn-primary w-full mt-6 justify-center text-lg py-4 ${(!file || taskId) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {taskId ? (
                <>
                  <Loader2 className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Play size={20} /> Start Generation
                </>
              )}
            </button>
          </div>

          {/* Result Section */}
          <AnimatePresence>
            {status?.status === 'completed' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-8 border-violet-500/30"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Music className="text-violet-400" /> Final Audiobook
                  </h2>
                  <a 
                    href={`${API_BASE}${status.audio_url}`} 
                    download 
                    className="flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    <Download size={20} /> Download MP3
                  </a>
                </div>
                <div className="bg-white/5 rounded-2xl p-6">
                  <audio controls className="w-full" src={`${API_BASE}${status.audio_url}`}>
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Status */}
        <div className="space-y-8">
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Settings size={20} className="text-gray-400" /> Pipeline Progress
            </h2>
            
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Total Progress</span>
                <span className="font-semibold">{progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            <div className="space-y-4">
              <StageStep 
                icon={FileText} 
                title="Extraction" 
                description="OCR & text processing"
                isActive={status?.stage === 0}
                isCompleted={status?.stage > 0}
              />
              <StageStep 
                icon={BookOpen} 
                title="Stage 1" 
                description="Structuring & Cleaning"
                isActive={status?.stage === 1}
                isCompleted={status?.stage > 1}
              />
              <StageStep 
                icon={Mic2} 
                title="Stage 2" 
                description="Narration Generation"
                isActive={status?.stage === 2}
                isCompleted={status?.stage > 2}
              />
              <StageStep 
                icon={Sparkles} 
                title="Stage 3" 
                description="Production Enhancement"
                isActive={status?.stage === 3}
                isCompleted={status?.status === 'completed'}
              />
            </div>
          </div>

          <div className="glass-card p-6 bg-gradient-to-br from-violet-500/10 to-transparent">
            <h3 className="font-bold mb-2">Pro Tip</h3>
            <p className="text-sm text-gray-400">
              Ensure your PDF has clear text for better OCR results. Multilingual books are automatically detected!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
