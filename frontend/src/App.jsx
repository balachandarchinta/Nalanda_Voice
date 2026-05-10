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



const StageStep = ({ icon: Icon, title, description, isActive, isCompleted }) => (
  <div className={`step-horizontal ${isActive ? 'opacity-100 scale-105' : 'opacity-40'}`}>
    <div className={`step-indicator ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
      {isCompleted ? <CheckCircle size={24} /> : <Icon size={24} />}
    </div>
    <div className="mt-2">
      <h3 className="font-bold text-sm uppercase tracking-wider text-white mb-1">{title}</h3>
      <p className="text-xs text-gray-400 hidden md:block">{description}</p>
    </div>
  </div>
);

function App() {
  const [apiBase, setApiBase] = useState('http://localhost:8000');
  const [showSettings, setShowSettings] = useState(false);
  const [file, setFile] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [status, setStatus] = useState(null);
  const [progress, setProgress] = useState(0);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
    toast.success(`File ready: ${acceptedFiles[0].name}`);
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
      const res = await axios.post(`${apiBase}/upload`, formData);
      setTaskId(res.data.task_id);
      toast.success('Pipeline Started!');
    } catch (err) {
      toast.error('Upload failed. Check if backend is running and URL is correct.');
      setShowSettings(true);
    }
  };

  useEffect(() => {
    if (!taskId) return;
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${apiBase}/status/${taskId}`);
        setStatus(res.data);
        setProgress(res.data.progress || 0);
        if (res.data.status === 'completed' || res.data.status === 'error') {
          clearInterval(interval);
        }
      } catch (err) {}
    }, 3000);
    return () => clearInterval(interval);
  }, [taskId, apiBase]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 selection:bg-violet-500/30">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <Toaster position="top-right" />
        
        {/* Connection Settings */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            <Settings size={14} /> {showSettings ? 'Hide Settings' : 'Connection Settings'}
          </button>
        </div>

        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="glass-card p-6 bg-violet-500/5 border-violet-500/20">
                <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Backend Connection</h4>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={apiBase} 
                    onChange={(e) => setApiBase(e.target.value)}
                    placeholder="http://localhost:8000"
                    className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-violet-500"
                  />
                  <button 
                    onClick={() => {
                      const sanitized = apiBase.replace(/\/+$/, "");
                      setApiBase(sanitized);
                      setShowSettings(false);
                      toast.success('Connection updated: ' + sanitized);
                    }}
                    className="px-6 py-2 bg-violet-600 rounded-lg text-sm font-bold"
                  >
                    Save
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-4">
                  In Cloud Shell, use your Backend Web Preview URL (e.g., https://8000-dot-...).
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <header className="mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <Sparkles size={18} className="text-violet-400" />
            <span className="text-sm font-semibold tracking-wide text-violet-200">PRO AUDIOBOOK ENGINE</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl font-extrabold mb-8 tracking-tight leading-tight"
          >
            Transform Books into <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-sky-400">
              Immersive Audio
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
          >
            A high-fidelity 3-stage AI pipeline designed for professional-grade <br className="hidden md:block"/>
            content extraction, narration, and production.
          </motion.p>
        </header>

        {/* Pipeline Tracker - HORIZONTAL */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Settings size={24} className="text-violet-400" /> 
              Pipeline Intelligence
            </h2>
            <div className="text-right">
              <span className="text-violet-400 font-mono text-xl font-bold">{progress}%</span>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Overall Status</p>
            </div>
          </div>

          <div className="progress-bar mb-12">
            <motion.div 
              className="progress-fill" 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>

          <div className="pipeline-horizontal">
            <StageStep 
              icon={FileText} 
              title="Extraction" 
              description="OCR & Processing"
              isActive={status?.stage === 0}
              isCompleted={status?.stage > 0}
            />
            <StageStep 
              icon={BookOpen} 
              title="Structuring" 
              description="Chapter Logic"
              isActive={status?.stage === 1}
              isCompleted={status?.stage > 1}
            />
            <StageStep 
              icon={Mic2} 
              title="Narration" 
              description="TTS Optimization"
              isActive={status?.stage === 2}
              isCompleted={status?.stage > 2}
            />
            <StageStep 
              icon={Sparkles} 
              title="Production" 
              description="Mastering"
              isActive={status?.stage === 3}
              isCompleted={status?.status === 'completed'}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Upload Card */}
          <div className="glass-card p-10 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Upload size={24} className="text-sky-400" /> 
                Upload Manuscript
              </h3>
              
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all cursor-pointer min-h-[300px] flex flex-col items-center justify-center ${isDragActive ? 'border-violet-500 bg-violet-500/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}
              >
                <input {...getInputProps()} />
                <div className="w-20 h-20 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-6 shadow-xl shadow-violet-500/10">
                  <Upload size={40} />
                </div>
                <p className="text-xl font-semibold mb-3">
                  {file ? file.name : "Drop PDF manuscript here"}
                </p>
                <p className="text-sm text-slate-500">Professional PDF files up to 100MB</p>
              </div>
            </div>
            
            <button 
              onClick={handleUpload}
              disabled={!file || taskId}
              className={`w-full mt-10 py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all ${(!file || taskId) ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-2xl shadow-violet-500/30'}`}
            >
              {taskId ? <><Loader2 className="animate-spin" size={24} /> Processing Pipeline...</> : <><Play size={24} /> Start Studio Engine</>}
            </button>
          </div>

          {/* Results/Info Card */}
          <div className="space-y-8">
            <AnimatePresence>
              {status?.status === 'completed' ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-10 border-emerald-500/30 bg-emerald-500/5"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                      <Music className="text-emerald-400" /> Output Ready
                    </h2>
                    <a href={`${API_BASE}${status.audio_url}`} download className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-all">
                      <Download size={28} />
                    </a>
                  </div>
                  <div className="bg-slate-900/80 rounded-2xl p-8 border border-white/5">
                    <audio controls className="w-full h-14" src={`${API_BASE}${status.audio_url}`} />
                  </div>
                </motion.div>
              ) : (
                <div className="glass-card p-10 h-full border-white/5">
                  <h3 className="text-2xl font-bold mb-6 text-slate-300">Studio Insights</h3>
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-slate-400 leading-relaxed italic">
                        "The studio engine is currently optimized for high-quality English and Multilingual extraction. Please ensure text is not vertically stacked for best results."
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                        <p className="text-xs text-slate-500 uppercase mb-1">OCR Precision</p>
                        <p className="text-xl font-bold text-violet-400">99.8%</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                        <p className="text-xs text-slate-500 uppercase mb-1">TTS Clarity</p>
                        <p className="text-xl font-bold text-sky-400">High Fi</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
