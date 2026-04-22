import React, { useState, useEffect, useRef } from 'react';
import { Lock, Edit, LogOut, Check, X, ExternalLink, Plus, Trash2, Save, FileText } from 'lucide-react';
import {
  login, getProfile, getSkills, getProjects, getExperience,
  updateProfile, addSkill, deleteSkill, addProject, updateProject,
  deleteProject, addExperience, deleteExperience
} from './api';

/* ─── input styles ──────────────────────────────────────────── */
const inp  = 'bg-white/5 border border-white/20 rounded-lg p-2.5 text-white text-sm w-full focus:border-primary outline-none transition-colors duration-200 focus:bg-white/8';
const inpL = 'bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors duration-200 focus:bg-white/8';

/* ─── Google Drive URL normalizer ───────────────────────────── */
function normalizeResumeUrl(url) {
  if (!url) return '';
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
  return url;
}

/* ─── Scroll Reveal Hook ─────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Also trigger section title underline
            const title = entry.target.querySelector('.section-title');
            if (title) title.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });
}

/* ─── Navbar scroll effect ───────────────────────────────────── */
function useNavbarScroll() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return scrolled;
}

/* ─── Typing animation ───────────────────────────────────────── */
function TypedText({ words = [], speed = 100, pause = 1800 }) {
  const [idx, setIdx]     = useState(0);
  const [text, setText]   = useState('');
  const [del, setDel]     = useState(false);
  useEffect(() => {
    const current = words[idx % words.length];
    const delay   = del ? 50 : (text === current ? pause : speed);
    const timer   = setTimeout(() => {
      if (!del) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) setDel(true);
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length === 0) { setDel(false); setIdx(i => i + 1); }
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [text, del, idx, words, speed, pause]);
  return <>{text}<span className="cursor text-primary">|</span></>;
}

/* ═══════════════════════════════════════════════════════════════
   Main App Component
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [profile,    setProfile]    = useState({});
  const [skills,     setSkills]     = useState([]);
  const [projects,   setProjects]   = useState([]);
  const [experience, setExperience] = useState([]);

  const [loading,         setLoading]         = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditMode,      setIsEditMode]      = useState(false);
  const [showLoginModal,  setShowLoginModal]  = useState(false);
  const [toast,           setToast]           = useState('');

  const [newSkill,  setNewSkill]   = useState({ name: '', category: '', proficiency: 80 });
  const [newProject,setNewProject] = useState({ title: '', description: '', link: '', imageUrl: '' });
  const [newExp,    setNewExp]     = useState({ role: '', company: '', startDate: '', endDate: '', description: '' });
  const [editProfile, setEditProfile] = useState({});
  const [editingProject, setEditingProject] = useState(null);

  useScrollReveal();
  const navScrolled = useNavbarScroll();

  useEffect(() => {
    if (localStorage.getItem('token')) setIsAuthenticated(true);
    fetchAll();
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2800); };

  const fetchAll = async () => {
    try {
      const [prof, sk, pr, ex] = await Promise.all([
        getProfile(), getSkills(), getProjects(), getExperience()
      ]);
      if (prof.data) { setProfile(prof.data); setEditProfile(prof.data); }
      setSkills(sk.data || []);
      setProjects(pr.data || []);
      setExperience(ex.data || []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  /* ─── Auth ─────────────────────────────────────────────────── */
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username: e.target.username.value, password: e.target.password.value });
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);
      setShowLoginModal(false);
      showToast('✅ Logged in successfully!');
    } catch { alert('Invalid credentials'); }
  };
  const handleLogout = () => { localStorage.removeItem('token'); setIsAuthenticated(false); setIsEditMode(false); };

  /* ─── Profile ──────────────────────────────────────────────── */
  const saveProfile = async () => {
    try {
      const res = await updateProfile(editProfile);
      setProfile(res.data);
      showToast('✅ Profile saved!');
    } catch { showToast('❌ Failed to save profile'); }
  };

  /* ─── Skills ───────────────────────────────────────────────── */
  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) return;
    try {
      const res = await addSkill(newSkill);
      setSkills([...skills, res.data]);
      setNewSkill({ name: '', category: '', proficiency: 80 });
      showToast('✅ Skill added!');
    } catch { showToast('❌ Failed to add skill'); }
  };
  const handleDeleteSkill = async (id) => {
    try { await deleteSkill(id); setSkills(skills.filter(s => s.id !== id)); showToast('🗑️ Skill removed');
    } catch { showToast('❌ Failed to delete'); }
  };

  /* ─── Projects ─────────────────────────────────────────────── */
  const handleAddProject = async () => {
    if (!newProject.title.trim()) return;
    try {
      const res = await addProject(newProject);
      setProjects([...projects, res.data]);
      setNewProject({ title: '', description: '', link: '', imageUrl: '' });
      showToast('✅ Project added!');
    } catch { showToast('❌ Failed to add project'); }
  };
  const handleUpdateProject = async (proj) => {
    try {
      const res = await updateProject(proj.id, proj);
      setProjects(projects.map(p => p.id === proj.id ? res.data : p));
      setEditingProject(null);
      showToast('✅ Project updated!');
    } catch { showToast('❌ Failed to update'); }
  };
  const handleDeleteProject = async (id) => {
    try { await deleteProject(id); setProjects(projects.filter(p => p.id !== id)); showToast('🗑️ Project removed');
    } catch { showToast('❌ Failed to delete'); }
  };

  /* ─── Experience ───────────────────────────────────────────── */
  const handleAddExp = async () => {
    if (!newExp.role.trim()) return;
    try {
      const res = await addExperience(newExp);
      setExperience([...experience, res.data]);
      setNewExp({ role: '', company: '', startDate: '', endDate: '', description: '' });
      showToast('✅ Experience added!');
    } catch { showToast('❌ Failed to add experience'); }
  };
  const handleDeleteExp = async (id) => {
    try { await deleteExperience(id); setExperience(experience.filter(e => e.id !== id)); showToast('🗑️ Experience removed');
    } catch { showToast('❌ Failed to delete'); }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-darker">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-primary/20 animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-gray-400 text-sm animate-pulse">Loading portfolio...</p>
    </div>
  );

  return (
    <div className="min-h-screen font-sans selection:bg-primary/30 bg-darker text-white">

      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Toast */}
      {toast && (
        <div className="toast-anim fixed top-6 left-1/2 z-[200] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3 text-white text-sm shadow-2xl flex items-center gap-2">
          {toast}
        </div>
      )}

      {/* ══ NAVBAR ════════════════════════════════════════════════ */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 py-4 px-6 border-b flex justify-between items-center ${navScrolled ? 'navbar-scrolled border-primary/20' : 'border-white/5 bg-transparent'}`}>
        <div className="text-xl font-extrabold animated-gradient-text">DevOps.Port</div>
        <div className="flex gap-6 items-center">
          {['about','skills','projects','experience'].map(sec => (
            <a key={sec} href={`#${sec}`}
               className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group capitalize">
              {sec}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          {profile.resumeUrl && (
            <a href={normalizeResumeUrl(profile.resumeUrl)} target="_blank" rel="noreferrer"
               className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/60 rounded-xl text-sm font-semibold text-primary transition-all duration-200 hover:-translate-y-0.5">
              <FileText size={14} /> Resume
            </a>
          )}
        </div>
      </nav>

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section id="about" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated background orbs */}
        <div className="absolute inset-0 -z-10">
          <div className="orb-1 absolute top-1/4 left-1/5 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
          <div className="orb-2 absolute bottom-1/4 right-1/5 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px]" />
          <div className="orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-500/3 blur-[120px]" />
          {/* Grid overlay */}
          <div className="absolute inset-0"
               style={{backgroundImage:'linear-gradient(rgba(59,130,246,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.04) 1px,transparent 1px)',backgroundSize:'60px 60px'}} />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center z-10 w-full">
          {isEditMode ? (
            <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 text-left max-w-2xl mx-auto">
              <h3 className="text-lg font-bold text-primary">✏️ Edit Profile</h3>
              {[{label:'Name',key:'name'},{label:'Title',key:'title'},{label:'Intro',key:'intro'},{label:'About',key:'about'}].map(({label,key}) => (
                <div key={key}>
                  <label className="text-xs text-gray-400 mb-1 block font-medium">{label}</label>
                  {key === 'intro' || key === 'about'
                    ? <textarea rows={3} className={inpL+' w-full resize-none'} value={editProfile[key]||''} onChange={e=>setEditProfile({...editProfile,[key]:e.target.value})} />
                    : <input className={inpL+' w-full'} value={editProfile[key]||''} onChange={e=>setEditProfile({...editProfile,[key]:e.target.value})} />
                  }
                </div>
              ))}
              <div className="border border-dashed border-primary/40 rounded-xl p-4 bg-primary/5">
                <label className="text-xs font-bold text-primary mb-1 block">📄 Google Drive Resume Link</label>
                <p className="text-xs text-gray-400 mb-2">Paste any Google Drive shareable link — auto-converted to preview format.</p>
                <input className={inpL+' w-full'} placeholder="https://drive.google.com/file/d/xxxxxx/view?usp=sharing"
                  value={editProfile.resumeUrl||''} onChange={e=>setEditProfile({...editProfile,resumeUrl:e.target.value})} />
                {editProfile.resumeUrl && (
                  <a href={normalizeResumeUrl(editProfile.resumeUrl)} target="_blank" rel="noreferrer"
                     className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                    <ExternalLink size={12}/> Preview in new tab
                  </a>
                )}
              </div>
              <button onClick={saveProfile} className="btn-primary rounded-xl px-6 py-2.5 font-bold flex items-center gap-2 w-fit">
                <span className="flex items-center gap-2"><Save size={15}/> Save Profile</span>
              </button>
            </div>
          ) : (
            <>
              {/* Badge */}
              <div className="hero-reveal-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-sm font-medium mb-8">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                Available for opportunities
              </div>

              <h1 className="hero-reveal-2 text-5xl md:text-7xl font-black tracking-tight mb-4 leading-tight">
                Hi, I'm <br className="md:hidden"/>
                <span className="animated-gradient-text">{profile.name || 'A DevOps Engineer'}</span>
              </h1>

              <div className="hero-reveal-3 text-xl md:text-2xl text-gray-400 font-mono mb-6 h-8">
                <TypedText words={[
                  profile.title || 'Senior DevOps Engineer',
                  'Cloud Infrastructure Expert',
                  'Kubernetes Enthusiast',
                  'CI/CD Pipeline Builder',
                ]} />
              </div>

              <p className="hero-reveal-4 text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                {profile.intro || 'Building robust, secure, and automated infrastructure for modern cloud-native applications.'}
              </p>

              <div className="hero-reveal-4 flex flex-wrap justify-center gap-4">
                <a href="#projects" className="btn-primary rounded-xl px-7 py-3.5 font-bold text-white shadow-lg">
                  <span>View My Work</span>
                </a>
                <a href="#contact" className="relative px-7 py-3.5 rounded-xl font-bold border border-white/15 hover:border-white/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/5">
                  Get In Touch
                </a>
                {profile.resumeUrl && (
                  <a href={normalizeResumeUrl(profile.resumeUrl)} target="_blank" rel="noreferrer"
                     className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold bg-secondary/15 border border-secondary/30 text-secondary hover:bg-secondary/25 transition-all duration-300 hover:-translate-y-0.5">
                    <FileText size={16}/> View Resume
                  </a>
                )}
              </div>

              {/* Scroll indicator */}
              <div className="hero-reveal-4 mt-20 flex justify-center">
                <div className="flex flex-col items-center gap-2 text-gray-500 text-xs animate-bounce">
                  <span>Scroll down</span>
                  <div className="w-5 h-8 rounded-full border-2 border-gray-600 flex items-start justify-center pt-1.5">
                    <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ══ SKILLS ════════════════════════════════════════════════ */}
      <section id="skills" className="py-28 relative">
        <div className="absolute inset-0 -z-10">
          <div className="orb-glow absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full bg-primary/4 blur-[80px]" />
        </div>
        <div className="max-w-6xl mx-auto px-6">
          <div className="scroll-reveal mb-14">
            <span className="text-primary text-sm font-mono font-medium tracking-widest uppercase">What I Work With</span>
            <h2 className="text-4xl font-black mt-2 section-title">Tech Stack</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {skills.map((skill, i) => (
              <div key={skill.id}
                   className="scroll-reveal skill-badge glass-panel px-5 py-3.5 flex items-center gap-3 cursor-default group relative transition-all duration-300"
                   style={{transitionDelay:`${i*40}ms`}}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-sm">
                  ⚙️
                </div>
                <div>
                  <div className="font-semibold text-sm">{skill.name}</div>
                  <div className="text-xs text-gray-400">{skill.category}</div>
                </div>
                {/* Proficiency bar */}
                {skill.proficiency && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-secondary"
                         style={{width:`${skill.proficiency}%`}} />
                  </div>
                )}
                {isEditMode && (
                  <button onClick={() => handleDeleteSkill(skill.id)}
                    className="ml-1 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={13}/>
                  </button>
                )}
              </div>
            ))}
          </div>

          {isEditMode && (
            <div className="scroll-reveal mt-8 glass-panel p-6 rounded-2xl border border-primary/20">
              <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2"><Plus size={14}/>Add New Skill</h4>
              <div className="flex flex-wrap gap-3">
                <input placeholder="Name" className={inp+' flex-1 min-w-[140px]'} value={newSkill.name} onChange={e=>setNewSkill({...newSkill,name:e.target.value})} />
                <input placeholder="Category" className={inp+' flex-1 min-w-[140px]'} value={newSkill.category} onChange={e=>setNewSkill({...newSkill,category:e.target.value})} />
                <input type="number" placeholder="Proficiency (0-100)" className={inp+' w-44'} value={newSkill.proficiency} onChange={e=>setNewSkill({...newSkill,proficiency:+e.target.value})} />
                <button onClick={handleAddSkill} className="btn-primary rounded-xl px-5 py-2 font-bold text-sm">
                  <span className="flex items-center gap-1"><Plus size={14}/> Add</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══ PROJECTS ══════════════════════════════════════════════ */}
      <section id="projects" className="py-28 bg-gradient-to-b from-transparent via-dark/50 to-transparent relative">
        <div className="absolute inset-0 -z-10">
          <div className="orb-glow absolute bottom-1/3 right-1/4 w-[350px] h-[350px] rounded-full bg-secondary/4 blur-[90px]" />
        </div>
        <div className="max-w-6xl mx-auto px-6">
          <div className="scroll-reveal mb-14">
            <span className="text-secondary text-sm font-mono font-medium tracking-widest uppercase">Portfolio</span>
            <h2 className="text-4xl font-black mt-2 section-title">Featured Projects</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {projects.map((p, i) => (
              <div key={p.id}
                   className="scroll-reveal card-3d glass-panel flex flex-col h-full"
                   style={{transitionDelay:`${i*80}ms`}}>
                {editingProject === p.id ? (
                  <ProjectEditor initial={p} onSave={handleUpdateProject} onCancel={() => setEditingProject(null)} inp={inp}/>
                ) : (
                  <>
                    {p.imageUrl && (
                      <div className="relative overflow-hidden rounded-xl mb-4 h-44">
                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    )}
                    <div className="flex flex-col flex-1 p-2">
                      {/* Tag */}
                      <span className="text-xs font-mono text-primary/70 mb-2">Project</span>
                      <h3 className="text-lg font-bold mb-2 leading-snug">{p.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed flex-grow">{p.description}</p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                        <a href={p.link} target="_blank" rel="noreferrer"
                           className="flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all duration-200">
                          View Project <ExternalLink size={13}/>
                        </a>
                        {isEditMode && (
                          <div className="flex gap-2">
                            <button onClick={() => setEditingProject(p.id)}
                              className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                              <Edit size={13}/>
                            </button>
                            <button onClick={() => handleDeleteProject(p.id)}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                              <Trash2 size={13}/>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {isEditMode && (
            <div className="scroll-reveal mt-8 glass-panel p-6 rounded-2xl border border-secondary/20">
              <h4 className="text-sm font-bold text-secondary mb-4 flex items-center gap-2"><Plus size={14}/>Add New Project</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder="Title"       className={inp} value={newProject.title}       onChange={e=>setNewProject({...newProject,title:e.target.value})} />
                <input placeholder="Link (URL)"  className={inp} value={newProject.link}        onChange={e=>setNewProject({...newProject,link:e.target.value})} />
                <input placeholder="Image URL"   className={inp} value={newProject.imageUrl}    onChange={e=>setNewProject({...newProject,imageUrl:e.target.value})} />
                <input placeholder="Description" className={inp} value={newProject.description} onChange={e=>setNewProject({...newProject,description:e.target.value})} />
              </div>
              <button onClick={handleAddProject} className="mt-3 px-5 py-2 rounded-xl font-bold text-sm bg-secondary/15 border border-secondary/30 text-secondary hover:bg-secondary/25 transition flex items-center gap-2">
                <Plus size={14}/> Add Project
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ══ EXPERIENCE ════════════════════════════════════════════ */}
      <section id="experience" className="py-28">
        <div className="max-w-4xl mx-auto px-6">
          <div className="scroll-reveal mb-14">
            <span className="text-primary text-sm font-mono font-medium tracking-widest uppercase">Career</span>
            <h2 className="text-4xl font-black mt-2 section-title">Experience</h2>
          </div>

          {/* Timeline */}
          <div className="relative pl-14">
            <div className="timeline-line" />
            {experience.map((exp, i) => (
              <div key={exp.id}
                   className="scroll-reveal relative mb-10 last:mb-0"
                   style={{transitionDelay:`${i*100}ms`}}>
                <div className="timeline-dot" style={{top:'1.5rem'}}/>
                <div className="card-3d glass-panel p-6 border border-white/5 hover:border-primary/20">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{exp.role}</h3>
                      <p className="text-primary font-semibold text-sm mt-0.5">{exp.company}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {exp.startDate} → {exp.endDate || 'Present'}
                        </span>
                      </div>
                      {exp.description && <p className="text-gray-300 text-sm mt-3 leading-relaxed">{exp.description}</p>}
                    </div>
                    {isEditMode && (
                      <button onClick={() => handleDeleteExp(exp.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex-shrink-0">
                        <Trash2 size={14}/>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isEditMode && (
            <div className="scroll-reveal mt-8 glass-panel p-6 rounded-2xl border border-primary/20">
              <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2"><Plus size={14}/>Add New Experience</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder="Role / Position" className={inp} value={newExp.role}        onChange={e=>setNewExp({...newExp,role:e.target.value})} />
                <input placeholder="Company"         className={inp} value={newExp.company}     onChange={e=>setNewExp({...newExp,company:e.target.value})} />
                <input placeholder="Start (e.g. Jan 2022)" className={inp} value={newExp.startDate} onChange={e=>setNewExp({...newExp,startDate:e.target.value})} />
                <input placeholder="End (leave blank = Present)" className={inp} value={newExp.endDate} onChange={e=>setNewExp({...newExp,endDate:e.target.value})} />
                <textarea rows={3} placeholder="Description" className={inp+' md:col-span-2 resize-none'}
                  value={newExp.description} onChange={e=>setNewExp({...newExp,description:e.target.value})} />
              </div>
              <button onClick={handleAddExp} className="btn-primary mt-3 rounded-xl px-5 py-2 font-bold text-sm">
                <span className="flex items-center gap-1"><Plus size={14}/> Add Experience</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════ */}
      <footer id="contact" className="relative border-t border-white/5 py-12 text-center">
        {/* Glow line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="animated-gradient-text text-xl font-extrabold mb-2">DevOps.Port</div>
        <p className="text-gray-500 text-sm mb-1">© 2026 {profile.name || 'DevOps Engineer'}. All rights reserved.</p>
        <p className="text-gray-600 text-xs">Built with React · Spring Boot · MySQL · Kubernetes</p>

        {/* Hidden admin trigger */}
        <button onDoubleClick={() => setShowLoginModal(true)}
          className="absolute bottom-8 right-8 opacity-20 hover:opacity-70 transition-opacity duration-300 p-2 rounded-full hover:bg-white/5">
          <Lock size={14}/>
        </button>
      </footer>

      {/* ══ LOGIN MODAL ═══════════════════════════════════════════ */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-panel p-8 max-w-sm w-full relative border border-white/10 shadow-2xl shadow-black/50">
            {/* Gradient top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary via-secondary to-violet-500 rounded-t-2xl" />

            <button onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <X size={18}/>
            </button>
            <div className="mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center mb-3">
                <Lock size={18} className="text-primary"/>
              </div>
              <h3 className="text-xl font-bold">Admin Access</h3>
              <p className="text-gray-400 text-sm mt-1">Sign in to manage your portfolio</p>
            </div>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input name="username" placeholder="Username" className={inpL+' w-full'} required />
              <input name="password" type="password" placeholder="Password" className={inpL+' w-full'} required />
              <button type="submit" className="btn-primary rounded-xl py-3 font-bold mt-1">
                <span>Sign In</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══ FLOATING ADMIN TOOLBAR ════════════════════════════════ */}
      {isAuthenticated && (
        <div className="fixed bottom-6 w-full flex justify-center z-50 pointer-events-none">
          <div className="glass-panel px-5 py-3 flex gap-3 pointer-events-auto border border-primary/30 shadow-2xl shadow-primary/10 items-center rounded-2xl">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"/>
            <span className="font-semibold text-primary text-sm">Admin Active</span>
            <div className="w-px h-4 bg-white/10"/>
            <button onClick={() => setIsEditMode(!isEditMode)}
              className={`px-4 py-1.5 rounded-xl text-sm font-bold flex gap-2 items-center transition-all duration-300 ${isEditMode ? 'bg-secondary text-darker shadow-lg shadow-secondary/30' : 'bg-primary text-white shadow-lg shadow-primary/30'}`}>
              <Edit size={13}/> {isEditMode ? 'Exit Edit' : 'Edit Mode'}
            </button>
            <button onClick={handleLogout}
              className="p-1.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all" title="Logout">
              <LogOut size={15}/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Inline Project Editor ──────────────────────────────────── */
function ProjectEditor({ initial, onSave, onCancel, inp }) {
  const [form, setForm] = useState({...initial});
  return (
    <div className="flex flex-col gap-3 p-2 w-full">
      <input placeholder="Title"       className={inp} value={form.title||''}       onChange={e=>setForm({...form,title:e.target.value})} />
      <textarea rows={2} placeholder="Description" className={inp+' resize-none'} value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})} />
      <input placeholder="Link (URL)"  className={inp} value={form.link||''}        onChange={e=>setForm({...form,link:e.target.value})} />
      <input placeholder="Image URL"   className={inp} value={form.imageUrl||''}    onChange={e=>setForm({...form,imageUrl:e.target.value})} />
      <div className="flex gap-2 mt-1">
        <button onClick={() => onSave(form)}
          className="flex-1 bg-primary text-white rounded-xl py-2 text-sm font-bold flex items-center justify-center gap-1 hover:bg-primary/80 transition">
          <Check size={13}/> Save
        </button>
        <button onClick={onCancel}
          className="flex-1 bg-white/5 text-gray-300 rounded-xl py-2 text-sm font-bold flex items-center justify-center gap-1 hover:bg-white/10 transition">
          <X size={13}/> Cancel
        </button>
      </div>
    </div>
  );
}
