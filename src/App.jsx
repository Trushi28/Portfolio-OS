import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal, Folder, User, Cpu, X, Minus, Square,
  Gamepad2, Activity, Power, Search, Zap, Monitor,
  Maximize2, Minimize2, AlertCircle, ChevronRight,
  FileCode, FileText, Play, ArrowLeft, Save, Type, Leaf, Layers, Box,
  CheckCircle2, Clock, Layout, Settings, Plus, Trash2, GripHorizontal, Lightbulb, RotateCcw,
  Globe, Sparkles, Volume2, VolumeX, Mail, Award, FolderOpen, Trophy, Command
} from 'lucide-react';

// 3D Components
import { PowerScene, BiosScene, GrubScene } from './components/three/Boot3D';
import DesktopBackground3D from './components/three/DesktopBackground3D';
import { GlitchTransition, CRTOverlay, HolographicIcon, CyberLoader } from './components/three/GlitchTransition';
import AppSkillsOrbit from './components/apps/AppSkillsOrbit';
import App3DTerminal from './components/apps/App3DTerminal';
import AppAbout from './components/apps/AppAbout';
import AppProjects from './components/apps/AppProjects';
import AppContact from './components/apps/AppContact';
import { CYBER_COLORS } from './components/three/ThreeBackground';
import { NotificationSystem } from './components/NotificationSystem';
import { useSettingsStore } from './store/settingsStore';

// New Feature Components
import CommandPalette from './components/CommandPalette';
import AchievementSystem, { AchievementBadge } from './components/AchievementSystem';
import MatrixRain, { MatrixRainToggle } from './components/MatrixRain';
import ParticleCursor, { ParticlesToggle } from './components/ParticleCursor';
import CyberWorld from './components/games/CyberWorld';
import CreativeResume from './components/CreativeResume';

// --- 📝 RESUME DATA STORE ---
const RESUME_DATA = {
  header: {
    name: "BETHU TRUSHI",
    role: "Computer Science Student | Systems Programmer",
    contact: "+91 9059165740 | trushibethu@gmail.com",
    links: ["LinkedIn", "GitHub"]
  },
  summary: "Innovative Computer Science student passionate about systems programming, fullstack development, and compiler design. Skilled in building robust, efficient solutions from low-level utilities to scalable fullstack apps.",
  education: [
    { school: "CMR Engineering College", degree: "B.Tech in CSE", grade: "CGPA: 8.55", year: "2027 (Expected)" },
    { school: "Rajiv Gandhi University of Knowledge and Technology", degree: "Intermediate (MPC)", grade: "80%", year: "2023" }
  ],
  skills: {
    languages: ["C", "C++", "Rust", "Python", "Java", "Assembly", "Lua"],
    web: ["ReactJS", "Node.js", "ExpressJS", "TypeScript", "HTML/CSS"],
    tools: ["Git", "Electron.js", "PostgreSQL", "Supabase", "Axios"]
  },
  projects: [
    { name: "EcoScan", desc: "Sustainability checker using React & Node.js. Eco-score visuals & Open Food Facts API integration." },
    { name: "C Algorithms Lib", desc: "Custom memory allocators & data structures (Linked Lists, Trees) built from scratch." },
    { name: "Toy Compiler", desc: "Lexical analyzer & parser with intermediate code generation." }
  ]
};

// --- 🔊 AUDIO ENGINE ---
const useAudio = () => {
  const { volume, isMuted } = useSettingsStore();

  const playSound = (type) => {
    if (isMuted) return;

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    const sounds = {
      power: (v) => { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(50, now); osc.frequency.linearRampToValueAtTime(100, now + 1); gain.gain.setValueAtTime(0.2 * v, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5); osc.stop(now + 1.5); },
      bios: (v) => { osc.type = 'square'; osc.frequency.setValueAtTime(800, now); gain.gain.setValueAtTime(0.1 * v, now); osc.stop(now + 0.15); },
      click: (v) => { osc.type = 'sine'; osc.frequency.setValueAtTime(600, now); gain.gain.setValueAtTime(0.05 * v, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1); osc.stop(now + 0.1); },
      scan: (v) => { osc.type = 'triangle'; osc.frequency.setValueAtTime(300, now); osc.frequency.linearRampToValueAtTime(600, now + 0.2); gain.gain.setValueAtTime(0.05 * v, now); osc.stop(now + 0.2); },
      error: (v) => { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now); gain.gain.setValueAtTime(0.1 * v, now); gain.gain.linearRampToValueAtTime(0, now + 0.2); osc.stop(now + 0.2); },
      slide: (v) => { osc.type = 'sine'; osc.frequency.setValueAtTime(200, now); osc.frequency.linearRampToValueAtTime(100, now + 0.1); gain.gain.setValueAtTime(0.05 * v, now); osc.stop(now + 0.1); },
      glitch: (v) => { osc.type = 'square'; osc.frequency.setValueAtTime(100, now); osc.frequency.linearRampToValueAtTime(50, now + 0.1); gain.gain.setValueAtTime(0.08 * v, now); osc.stop(now + 0.15); },
    };
    if (sounds[type]) { osc.start(now); sounds[type](volume); }
  };

  return playSound;
};

// --- 🐍 APP: SNAKE GAME ---
const AppSnake = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { trackSnakeScore } = useSettingsStore();

  // Track score when game ends
  useEffect(() => {
    if (gameOver && score > 0) {
      trackSnakeScore(score);
    }
  }, [gameOver, score]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    let snake = [{ x: 10, y: 10 }], food = { x: 15, y: 15 }, dir = { x: 1, y: 0 };
    const loop = setInterval(() => {
      if (gameOver) return;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x === food.x && head.y === food.y) { setScore(s => s + 1); food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 15) }; }
      else snake.pop();
      if (head.x < 0 || head.x >= 30 || head.y < 0 || head.y >= 20 || snake.some(s => s.x === head.x && s.y === head.y)) return setGameOver(true);
      snake.unshift(head);
      ctx.fillStyle = '#0a0a0f'; ctx.fillRect(0, 0, 600, 400);
      ctx.fillStyle = CYBER_COLORS.primary; snake.forEach(s => ctx.fillRect(s.x * 20, s.y * 20, 18, 18));
      ctx.fillStyle = CYBER_COLORS.accent; ctx.fillRect(food.x * 20, food.y * 20, 18, 18);
    }, 100);
    const h = (e) => { if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault(); if (e.key === 'ArrowUp' && dir.y !== 1) dir = { x: 0, y: -1 }; if (e.key === 'ArrowDown' && dir.y !== -1) dir = { x: 0, y: 1 }; if (e.key === 'ArrowLeft' && dir.x !== 1) dir = { x: -1, y: 0 }; if (e.key === 'ArrowRight' && dir.x !== -1) dir = { x: 1, y: 0 }; };
    window.addEventListener('keydown', h);
    return () => { clearInterval(loop); window.removeEventListener('keydown', h); };
  }, [gameOver]);
  return <div className="h-full bg-gray-900 flex flex-col items-center justify-center text-white"><canvas ref={canvasRef} width="600" height="400" className="bg-black border border-gray-700 w-full h-full object-contain" /><div className="absolute top-2 right-4 font-mono text-green-400">{gameOver ? "GAME OVER" : `SCORE: ${score}`}</div></div>;
};

// --- 🧩 APP: SLIDING PUZZLE ---
const AppPuzzle = () => {
  const [grid, setGrid] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMove = (index) => {
    const emptyIndex = grid.indexOf(0);
    const row = Math.floor(index / 4), col = index % 4;
    const emptyRow = Math.floor(emptyIndex / 4), emptyCol = emptyIndex % 4;
    const isAdjacent = (Math.abs(row - emptyRow) === 1 && col === emptyCol) || (Math.abs(col - emptyCol) === 1 && row === emptyRow);
    if (isAdjacent) {
      const newGrid = [...grid];
      [newGrid[index], newGrid[emptyIndex]] = [newGrid[emptyIndex], newGrid[index]];
      setGrid(newGrid);
      setMoves(m => m + 1);
      playSound('slide');
      const isSolved = newGrid.slice(0, 15).every((val, i) => val === i + 1);
      if (isSolved) setSolved(true);
    }
  };

  const shuffle = () => {
    let newGrid = [...grid];
    for (let i = 0; i < 100; i++) {
      const emptyIdx = newGrid.indexOf(0);
      const neighbors = [];
      if (emptyIdx % 4 > 0) neighbors.push(emptyIdx - 1);
      if (emptyIdx % 4 < 3) neighbors.push(emptyIdx + 1);
      if (emptyIdx >= 4) neighbors.push(emptyIdx - 4);
      if (emptyIdx < 12) neighbors.push(emptyIdx + 4);
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      [newGrid[emptyIdx], newGrid[randomNeighbor]] = [newGrid[randomNeighbor], newGrid[emptyIdx]];
    }
    setGrid(newGrid); setMoves(0); setTime(0); setSolved(false);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center text-white font-sans p-4" style={{ background: `linear-gradient(135deg, ${CYBER_COLORS.purple}, ${CYBER_COLORS.secondary})` }}>
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold mb-1 flex items-center justify-center gap-2"><Gamepad2 /> Sliding Puzzle</h2>
      </div>
      <div className="flex justify-between w-64 mb-4 text-sm font-mono bg-black/20 p-2 rounded-lg">
        <span>Moves: {moves}</span>
        <span>Time: {new Date(time * 1000).toISOString().substr(14, 5)}</span>
      </div>
      <div className="grid grid-cols-4 gap-2 p-2 bg-white/10 rounded-xl backdrop-blur-md shadow-2xl">
        {grid.map((num, i) => (
          <motion.div key={`${i}-${num}`} layout onClick={() => num !== 0 && handleMove(i)}
            className={`w-16 h-16 flex items-center justify-center rounded-lg text-xl font-bold cursor-pointer shadow-md select-none transition-colors ${num === 0 ? 'invisible' : 'bg-gray-100 text-gray-800 hover:bg-white'}`}>
            {num}
          </motion.div>
        ))}
      </div>
      <div className="flex gap-4 mt-6">
        <button onClick={shuffle} className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg font-bold shadow-lg"><RotateCcw size={16} /> New Game</button>
      </div>
      {solved && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 bg-black/80 flex items-center justify-center flex-col z-10">
          <h1 className="text-4xl font-bold text-green-400 mb-4">SOLVED!</h1>
          <button onClick={shuffle} className="px-6 py-2 bg-white text-black rounded-full font-bold">Play Again</button>
        </motion.div>
      )}
    </div>
  );
};

// --- ✅ APP: DASHBOARD & TODO ---
const AppDashboard = () => {
  const [view, setView] = useState('dashboard');
  const [theme, setTheme] = useState('cyber');
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);

  const themes = {
    cyber: { from: CYBER_COLORS.purple, to: CYBER_COLORS.secondary, bg: 'bg-purple-900' },
    blue: { from: '#3b82f6', to: '#06b6d4', bg: 'bg-blue-900' },
    green: { from: '#10b981', to: '#059669', bg: 'bg-emerald-900' },
  };

  const addTodo = () => {
    if (!inputValue.trim()) return;
    setTodos([{ id: Date.now(), text: inputValue, completed: false }, ...todos]);
    setInputValue(""); setShowModal(false); playSound('click');
  };

  const toggleTodo = (id) => { setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)); playSound('click'); };
  const deleteTodo = (id) => { setTodos(todos.filter(t => t.id !== id)); playSound('error'); };
  const activeTheme = themes[theme];

  return (
    <div className="h-full flex text-white font-sans overflow-hidden" style={{ background: `linear-gradient(135deg, ${activeTheme.from}, ${activeTheme.to})` }}>
      <div className="w-64 bg-white/10 backdrop-blur-xl border-r border-white/20 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-2"><Layout /> Dashboard</h1>
        <nav className="space-y-2 flex-1">
          {[{ id: 'dashboard', icon: <Layout size={18} />, label: 'Overview' }, { id: 'todos', icon: <CheckCircle2 size={18} />, label: 'To-Do' }].map(item => (
            <button key={item.id} onClick={() => setView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === item.id ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'}`}>{item.icon} {item.label}</button>
          ))}
        </nav>
        <div className="bg-black/20 p-4 rounded-xl">
          <div className="text-xs font-bold opacity-70 mb-3 uppercase">Theme</div>
          <div className="flex gap-2">{Object.keys(themes).map(t => (<div key={t} onClick={() => setTheme(t)} className={`w-6 h-6 rounded-full cursor-pointer border-2 ${theme === t ? 'border-white scale-110' : 'border-transparent'}`} style={{ background: themes[t].from }} />))}</div>
        </div>
      </div>
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-1">Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}!</h2>
            <p className="opacity-70">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-white text-purple-600 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"><Plus size={20} /> New Task</button>
        </div>
        {view === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <div className="flex items-center gap-3 mb-4 text-xl font-bold"><CheckCircle2 /> Quick Stats</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-4 rounded-xl text-center"><div className="text-3xl font-bold">{todos.length}</div><div className="text-xs opacity-70">Total</div></div>
                <div className="bg-black/20 p-4 rounded-xl text-center"><div className="text-3xl font-bold text-green-400">{todos.filter(t => t.completed).length}</div><div className="text-xs opacity-70">Done</div></div>
              </div>
            </div>
          </div>
        )}
        <div className="mt-8 space-y-3">
          {todos.length === 0 && <div className="text-center opacity-50 py-10">No tasks yet.</div>}
          {todos.map(todo => (
            <motion.div layout key={todo.id} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex items-center justify-between group hover:bg-white/20">
              <div className="flex items-center gap-4">
                <div onClick={() => toggleTodo(todo.id)} className={`w-6 h-6 rounded-md border-2 border-white/50 cursor-pointer flex items-center justify-center ${todo.completed ? 'bg-green-500 border-green-500' : ''}`}>{todo.completed && <CheckCircle2 size={14} />}</div>
                <span className={`${todo.completed ? 'line-through opacity-50' : ''}`}>{todo.text}</span>
              </div>
              <button onClick={() => deleteTodo(todo.id)} className="text-red-400 opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg"><Trash2 size={18} /></button>
            </motion.div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {showModal && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-900 p-6 rounded-2xl w-96 border border-white/20">
              <h2 className="text-xl font-bold mb-4">Add Task</h2>
              <input autoFocus value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTodo()} placeholder="What needs to be done?" className="w-full bg-black/30 border border-white/10 p-3 rounded-lg mb-4 text-white focus:outline-none focus:border-indigo-500" />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm hover:bg-white/10 rounded-lg">Cancel</button>
                <button onClick={addTodo} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-bold">Add</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- 🌿 APP: ECOSCAN ---
const AppEcoScan = () => {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true); playSound('click');
    setTimeout(() => {
      setLoading(false); playSound('scan');
      setResult({ name: search || "Unknown", score: ['A', 'B', 'C', 'D', 'E'][Math.floor(Math.random() * 5)], co2: Math.floor(Math.random() * 500) + "g", packaging: "Recyclable" });
    }, 1500);
  };

  return (
    <div className="h-full bg-linear-to-br from-green-50 to-emerald-100 text-slate-800 flex flex-col font-sans">
      <div className="bg-emerald-600 text-white p-4 shadow-md flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 font-bold text-lg"><Leaf /> EcoScan</div>
        <div className="text-xs bg-white/20 px-2 py-1 rounded">BETA</div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="w-full max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-emerald-900 mb-2">Check Product Impact</h2>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-lg mx-auto">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="e.g. Apple, Soda..." className="flex-1 p-3 rounded-lg border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <button type="submit" className="bg-emerald-600 text-white px-6 rounded-lg font-bold hover:bg-emerald-700">SCAN</button>
          </form>
          {loading && <div className="text-center p-10"><div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" /></div>}
          {result && !loading && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-6 rounded-xl shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center justify-center">
                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-5xl font-black text-white shadow-lg ${result.score === 'A' ? 'bg-green-500' : result.score === 'B' ? 'bg-lime-500' : result.score === 'C' ? 'bg-yellow-500' : 'bg-red-500'}`}>{result.score}</div>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold text-slate-800 capitalize mb-4">{result.name}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg"><div className="text-xs text-slate-500 uppercase font-bold">CO2</div><div className="font-mono text-xl font-bold">{result.co2}</div></div>
                  <div className="bg-slate-50 p-4 rounded-lg"><div className="text-xs text-slate-500 uppercase font-bold">Packaging</div><div className="font-mono text-xl font-bold">{result.packaging}</div></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- 📄 APP: RESUME VIEWER ---
const AppResume = () => (
  <div className="h-full bg-slate-50 overflow-y-auto text-slate-900 font-sans">
    <div className="max-w-3xl mx-auto bg-white min-h-full shadow-2xl p-8 md:p-12">
      <div className="border-b-2 border-slate-800 pb-6 mb-8">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-2">{RESUME_DATA.header.name}</h1>
        <p className="text-xl text-slate-600 font-medium">{RESUME_DATA.header.role}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500 font-mono">
          <span>{RESUME_DATA.header.contact}</span>
          {RESUME_DATA.header.links.map(l => <span key={l} className="text-blue-600 cursor-pointer hover:underline">{l}</span>)}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section><h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Summary</h2><p className="text-slate-700 leading-relaxed">{RESUME_DATA.summary}</p></section>
          <section><h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Projects</h2><div className="space-y-4">{RESUME_DATA.projects.map((p, i) => (<div key={i}><h3 className="font-bold text-slate-900">{p.name}</h3><p className="text-sm text-slate-600">{p.desc}</p></div>))}</div></section>
        </div>
        <div><section><h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Skills</h2><div className="space-y-4"><div><h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Languages</h3><div className="flex flex-wrap gap-2">{RESUME_DATA.skills.languages.map(s => <span key={s} className="bg-slate-100 px-2 py-1 rounded text-xs font-mono border border-slate-200">{s}</span>)}</div></div></div></section></div>
      </div>
    </div>
  </div>
);

// --- 📂 VIRTUAL FILE SYSTEM ---
const FILE_SYSTEM = {
  'home': {
    type: 'dir', children: {
      'user': {
        type: 'dir', children: {
          'projects': {
            type: 'dir', children: {
              'ecoscan_web': { type: 'file', fileType: 'app', appName: 'ecoscan', content: "Launching EcoScan..." },
              'skills.orbit': { type: 'file', fileType: 'app', appName: 'skills', content: "Launching Skills Orbit..." },
            }
          },
          'resume.pdf': { type: 'file', fileType: 'pdf', content: "RESUME_VIEWER" }
        }
      }
    }
  }
};

// --- 📂 APP: FILE EXPLORER ---
const AppExplorer = ({ onLaunch }) => {
  const [path, setPath] = useState(['home', 'user']);

  const getPathContent = (pathArray) => {
    let current = { children: FILE_SYSTEM };
    for (const part of pathArray) { if (current.children && current.children[part]) { current = current.children[part]; } else { return null; } }
    return current;
  };

  const currentDir = getPathContent(path);
  const handleNavigate = (key, item) => {
    if (item.type === 'dir') { setPath([...path, key]); }
    else {
      if (item.appName === 'ecoscan') onLaunch('ecoscan');
      else if (item.appName === 'skills') onLaunch('skills');
      else if (item.fileType === 'pdf') onLaunch('resume');
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white">
      <div className="h-10 bg-white/5 flex items-center px-2 gap-2 border-b border-white/10">
        <button onClick={() => path.length > 1 && setPath(path.slice(0, -1))} className="p-1 hover:bg-white/10 rounded disabled:opacity-30" disabled={path.length <= 1}><ArrowLeft size={16} /></button>
        <div className="flex-1 bg-black/50 px-2 py-1 text-xs font-mono rounded text-gray-400">/{path.join('/')}</div>
      </div>
      <div className="flex-1 p-4 grid grid-cols-4 gap-4 content-start overflow-y-auto">
        {currentDir && Object.entries(currentDir.children).map(([key, item]) => (
          <div key={key} onDoubleClick={() => handleNavigate(key, item)} className="flex flex-col items-center cursor-pointer p-2 hover:bg-white/5 rounded group">
            <div className="text-gray-300 group-hover:text-cyan-400 mb-2">
              {item.type === 'dir' ? <Folder size={40} className="text-yellow-500" /> :
                item.appName === 'skills' ? <Globe size={35} className="text-purple-400" /> :
                  item.fileType === 'app' ? <Zap size={35} className="text-green-400" /> :
                    <FileText size={35} className="text-red-400" />}
            </div>
            <span className="text-xs text-center w-full truncate">{key}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- ⌨️ APP: TERMINAL (2D Fallback) ---
const AppTerminal = ({ onLaunch }) => {
  const [history, setHistory] = useState(["NEXUS SHELL v3.0", "Type 'help' for commands."]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState(['home', 'user']);
  const bottomRef = useRef(null);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [history]);

  const handleCmd = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      const command = cmd.split(' ')[0].toLowerCase();
      const newHistory = [...history, `user@nexus:/${cwd.join('/')}$ ${cmd}`];

      if (command === 'help') { newHistory.push("Commands: ls, cd, clear, skills, 3d"); }
      else if (command === 'clear') { setHistory([]); setInput(""); return; }
      else if (command === 'ls') { newHistory.push("projects/  resume.pdf  skills.orbit"); }
      else if (command === 'skills') { onLaunch('skills'); newHistory.push("Launching Skills Orbit..."); }
      else if (command === '3d') { onLaunch('terminal3d'); newHistory.push("Switching to 3D mode..."); }
      else if (command === 'cd') {
        const target = cmd.split(' ')[1];
        if (!target) { newHistory.push("cd: missing operand"); }
        else if (target === "..") { if (cwd.length > 1) setCwd(cwd.slice(0, -1)); }
        else {
          const next = [...cwd, target];
          const getPathContent = (pathArray) => {
            let node = { children: FILE_SYSTEM };
            for (const part of pathArray) {
              if (!node.children || !node.children[part]) return null;
              node = node.children[part];
            }
            return node;
          };
          const found = getPathContent(next);
          if (found && found.type === "dir") {
            setCwd(next);
          } else {
            newHistory.push(`cd: ${target}: No such directory`);
          }
        }
      }
      else { newHistory.push(`bash: ${command}: command not found`); }
      setHistory(newHistory); setInput("");
    }
  };

  return (
    <div className="h-full bg-black p-4 font-mono text-sm text-green-400 overflow-y-auto" onClick={() => document.getElementById('t-in')?.focus()}>
      {history.map((l, i) => <div key={i} dangerouslySetInnerHTML={{ __html: l }} className="mb-1" />)}
      <div className="flex text-white"><span className="text-blue-400 mr-2">user@nexus:/{cwd.join('/')}$</span><input id="t-in" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleCmd} className="bg-transparent outline-none flex-1" autoFocus /></div>
      <div ref={bottomRef} />
    </div>
  );
};

// --- 🖥️ DESKTOP ---
const Desktop = () => {
  const [windows, setWindows] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [showGlitch, setShowGlitch] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const { volume, setVolume, isMuted, toggleMute, addNotification, trackAppOpen, trackShortcut, checkNightOwl } = useSettingsStore();
  const playSound = useAudio();

  // Check night owl achievement on mount
  useEffect(() => {
    checkNightOwl();
  }, []);

  const APPS = {
    terminal: { id: 'terminal', icon: <Terminal />, title: 'Terminal', comp: AppTerminal },
    terminal3d: { id: 'terminal3d', icon: <Sparkles />, title: 'Holo Terminal', comp: App3DTerminal },
    explorer: { id: 'explorer', icon: <Folder />, title: 'Files', comp: AppExplorer },
    about: { id: 'about', icon: <User />, title: 'About Me', comp: AppAbout },
    projects: { id: 'projects', icon: <FolderOpen />, title: 'Projects', comp: AppProjects },
    contact: { id: 'contact', icon: <Mail />, title: 'Contact', comp: AppContact },
    ecoscan: { id: 'ecoscan', icon: <Leaf />, title: 'EcoScan', comp: AppEcoScan },
    resume: { id: 'resume', icon: <FileText />, title: 'Resume', comp: AppResume },
    snake: { id: 'snake', icon: <Gamepad2 />, title: 'Snake', comp: AppSnake },
    dashboard: { id: 'dashboard', icon: <Layout />, title: 'Dashboard', comp: AppDashboard },
    puzzle: { id: 'puzzle', icon: <GripHorizontal />, title: 'Puzzle', comp: AppPuzzle },
    skills: { id: 'skills', icon: <Globe />, title: 'Skills Orbit', comp: AppSkillsOrbit },
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd+K or Ctrl+K - Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
        trackShortcut();
        playSound('click');
      }

      // Esc - Close active window or command palette
      if (e.key === 'Escape') {
        if (showCommandPalette) {
          setShowCommandPalette(false);
        } else if (showAchievements) {
          setShowAchievements(false);
        } else if (activeId) {
          close(activeId);
          playSound('click');
        }
      }

      // Alt+Tab - Switch windows
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        trackShortcut();
        const visibleWindows = windows.filter(w => !w.minimized);
        if (visibleWindows.length > 0) {
          const currentIndex = visibleWindows.findIndex(w => w.id === activeId);
          const nextIndex = (currentIndex + 1) % visibleWindows.length;
          setActiveId(visibleWindows[nextIndex].id);
          playSound('click');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeId, windows, showCommandPalette, showAchievements]);

  const launch = (key, data = null) => {
    playSound('click');
    setShowGlitch(true);
    setTimeout(() => setShowGlitch(false), 300);
    const instanceId = key;

    // Track for achievements
    trackAppOpen(key);

    const existing = windows.find(w => w.id === instanceId);
    if (existing) {
      // If minimized, restore it
      if (existing.minimized) {
        setWindows(p => p.map(w => w.id === instanceId ? { ...w, minimized: false } : w));
      }
      setActiveId(instanceId);
    } else {
      setWindows(p => [...p, {
        id: instanceId,
        title: APPS[key].title,
        icon: APPS[key].icon,
        comp: APPS[key].comp,
        data,
        z: p.length + 1,
        max: false,
        minimized: false
      }]);
      setActiveId(instanceId);
    }
  };

  const close = (id) => {
    setWindows(p => p.filter(w => w.id !== id));
    playSound('click');
  };

  const toggleMax = (id) => setWindows(p => p.map(w => w.id === id ? { ...w, max: !w.max } : w));

  const minimize = (id) => {
    setWindows(p => p.map(w => w.id === id ? { ...w, minimized: true } : w));
    playSound('slide');
    if (activeId === id) {
      const visibleWindows = windows.filter(w => w.id !== id && !w.minimized);
      setActiveId(visibleWindows.length > 0 ? visibleWindows[0].id : null);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative font-sans select-none">
      {/* 3D Background */}
      <DesktopBackground3D />

      {/* Matrix Rain Effect */}
      <MatrixRain />

      {/* Particle Cursor */}
      <ParticleCursor />

      {/* CRT Effect Overlay */}
      <CRTOverlay intensity={0.5} />

      {/* Glitch Transition */}
      <GlitchTransition isActive={showGlitch} duration={300} />

      {/* Notification System */}
      <NotificationSystem />

      {/* Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onLaunch={launch}
      />

      {/* Achievement System Modal */}
      <AchievementSystem
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
      />

      {/* Top Bar */}
      <div className="absolute top-0 w-full h-8 bg-black/60 backdrop-blur-md border-b border-white/10 flex justify-between px-4 items-center z-[100] text-xs text-white">
        <div className="flex items-center gap-4">
          <span className="font-bold tracking-widest" style={{ color: CYBER_COLORS.primary }}>◈ NEXUS HYPERVISOR</span>

          {/* Command Palette Trigger */}
          <button
            onClick={() => setShowCommandPalette(true)}
            className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <Command size={12} />
            <span className="text-[10px] font-mono">Ctrl+K</span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Visual Effects Toggles */}
          <div className="flex items-center gap-2">
            <MatrixRainToggle />
            <ParticlesToggle />
          </div>

          {/* Achievement Badge */}
          <AchievementBadge onClick={() => setShowAchievements(true)} />

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="hover:bg-white/10 p-1 rounded transition-colors"
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
              style={{
                accentColor: CYBER_COLORS.primary,
              }}
            />
            <span className="text-xs text-gray-500 w-6 font-mono">{Math.round(volume * 100)}</span>
          </div>
          <span className="text-gray-400">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Desktop Icons */}
      <div className="absolute top-12 left-4 flex flex-col gap-4 z-[5]">
        {['about', 'projects', 'contact', 'terminal3d', 'resume'].map(key => (
          <div key={key} onDoubleClick={() => launch(key)} className="group flex flex-col items-center w-20 cursor-pointer">
            <HolographicIcon isActive={activeId === key}>
              <div className="w-14 h-14 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors backdrop-blur-sm shadow-lg" style={{ boxShadow: `0 0 20px ${CYBER_COLORS.primary}20` }}>
                {React.cloneElement(APPS[key].icon, { className: "text-white opacity-80 group-hover:opacity-100", size: 24 })}
              </div>
            </HolographicIcon>
            <span className="text-white text-[10px] mt-1 drop-shadow font-medium">{APPS[key].title}</span>
          </div>
        ))}
      </div>

      {/* Windows */}
      <AnimatePresence>
        {windows.filter(w => !w.minimized).map((win) => (
          <motion.div key={win.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0, y: 100 }}
            drag={!win.max}
            dragMomentum={false}
            onMouseDown={() => setActiveId(win.id)}
            style={{
              width: win.max ? '100%' : 850,
              height: win.max ? 'calc(100% - 32px - 90px)' : 600,
              top: win.max ? 32 : 80,
              left: win.max ? 0 : 120,
              zIndex: activeId === win.id ? 50 : 10,
              borderRadius: win.max ? 0 : '0.75rem'
            }}
            className="absolute bg-slate-900/95 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="h-9 bg-white/5 border-b border-white/10 flex justify-between items-center px-3 cursor-move shrink-0" onDoubleClick={() => toggleMax(win.id)}>
              <div className="flex items-center gap-2 text-gray-300 text-xs uppercase tracking-wider">
                {React.cloneElement(win.icon, { size: 14 })} {win.title}
              </div>
              <div className="flex gap-2">
                <button onClick={() => minimize(win.id)} className="hover:bg-white/10 p-1 rounded"><Minus size={12} className="text-gray-400" /></button>
                <button onClick={() => toggleMax(win.id)} className="hover:bg-white/10 p-1 rounded"><Maximize2 size={12} className="text-gray-400" /></button>
                <button onClick={() => close(win.id)} className="hover:bg-red-500 p-1 rounded group"><X size={12} className="text-gray-400 group-hover:text-white" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden relative bg-slate-900">
              <win.comp onLaunch={launch} data={win.data} file={win.data} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-black/60 backdrop-blur-xl border-t border-white/10 flex items-center justify-between px-4 z-[100]">
        {/* Open Windows */}
        <div className="flex gap-2 flex-1 overflow-x-auto">
          {windows.map((win) => (
            <motion.button
              key={win.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                if (win.minimized) {
                  setWindows(p => p.map(w => w.id === win.id ? { ...w, minimized: false } : w));
                }
                setActiveId(win.id);
                playSound('click');
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${activeId === win.id && !win.minimized
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
            >
              {React.cloneElement(win.icon, { size: 16 })}
              <span className="text-xs font-mono max-w-[100px] truncate">{win.title}</span>
              {win.minimized && <span className="text-[10px] opacity-50">(minimized)</span>}
            </motion.button>
          ))}
        </div>

        {/* Dock */}
        <div className="flex gap-3 bg-white/10 backdrop-blur-2xl border border-white/20 px-4 py-2.5 rounded-xl shadow-2xl">
          {['about', 'projects', 'contact', 'terminal3d', 'skills', 'snake', 'puzzle'].map(key => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.2, y: -8 }}
              onClick={() => launch(key)}
              onMouseEnter={() => playSound('click')}
              className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/10 hover:border-cyan-400 transition-colors shadow-lg"
              style={{ background: `linear-gradient(135deg, ${CYBER_COLORS.darker}, #1a1a2e)` }}
            >
              {React.cloneElement(APPS[key].icon, { size: 18, className: "text-gray-300" })}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- 🚀 MAIN APP ---
export default function App() {
  const [state, setState] = useState("OFF");
  const [memProgress, setMemProgress] = useState(0);
  const { skipBoot, setSkipBoot } = useSettingsStore();
  const playSound = useAudio();

  // Skip directly to desktop if enabled
  useEffect(() => {
    if (skipBoot) {
      setState("DESKTOP");
    }
  }, [skipBoot]);

  useEffect(() => {
    if (state === "BIOS") {
      playSound('bios');
      const interval = setInterval(() => {
        setMemProgress(m => {
          if (m >= 64000) {
            clearInterval(interval);
            setTimeout(() => setState("GRUB"), 500);
            return 64000;
          }
          return m + 2000;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [state]);

  const handlePowerOn = () => {
    playSound('power');
    setState("BIOS");
  };

  const handleSkipBoot = () => {
    setSkipBoot(true);
    setState("DESKTOP");
  };

  return (
    <div className={`bg-black h-screen w-screen ${state === "RESUME" ? "overflow-auto" : "overflow-hidden"}`}>
      {state === "OFF" && (
        <div className="h-full w-full relative">
          <PowerScene onPowerOn={handlePowerOn} />
          {/* Skip Boot Option */}
          <div className="absolute bottom-8 right-8 z-50">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleSkipBoot}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-xs font-mono hover:bg-white/20 transition-all"
            >
              Skip Boot Sequence
            </motion.button>
          </div>
        </div>
      )}
      {state === "BIOS" && (
        <div className="h-full w-full relative">
          <BiosScene memoryProgress={memProgress} />
          <div className="absolute bottom-8 right-8 z-50">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleSkipBoot}
              className="px-4 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg text-cyan-400 text-xs font-mono hover:bg-cyan-500/30 transition-all"
            >
              Skip to Desktop
            </motion.button>
          </div>
        </div>
      )}
      {state === "GRUB" && (
        <div className="h-full w-full relative">
          <GrubScene onSelect={(option) => {
            if (option === 'desktop') setState("DESKTOP");
            else if (option === 'cyberworld') setState("CYBERWORLD");
            else if (option === 'resume') setState("RESUME");
          }} />
          <div className="absolute bottom-8 right-8 z-50">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleSkipBoot}
              className="px-4 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg text-cyan-400 text-xs font-mono hover:bg-cyan-500/30 transition-all"
            >
              Skip to Desktop
            </motion.button>
          </div>
        </div>
      )}
      {state === "DESKTOP" && <Desktop />}
      {state === "CYBERWORLD" && <CyberWorld onExit={() => setState("GRUB")} />}
      {state === "RESUME" && <CreativeResume onExit={() => setState("GRUB")} />}
    </div>
  );
}