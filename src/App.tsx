import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles,
  Home,
  MessageCircleHeart,
  BookOpen,
  Wind,
  Heart,
  Sun,
  Moon,
  CloudRain,
  Coffee,
  Feather,
  Compass,
  CheckCircle2,
  Circle,
  Plus,
  Send,
  RefreshCw,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  ShieldAlert,
  X,
  ArrowRight,
  Calendar,
  TrendingUp,
  Eye,
  Ear,
  Hand,
  Flower2,
  Smile,
  Check,
  User,
  Edit3,
  LogOut,
  Sliders,
  Award,
  Sparkle
} from 'lucide-react';

// --- Design Tokens & Constants ---
const AURA_THEMES = [
  { id: 'lavender', name: 'Lavender Mist', gradient: 'from-[#8E7CC3] to-[#C3B5E8]', bg: '#F2EEFB', accent: '#6B5B95', border: '#D7CCF0' },
  { id: 'blush', name: 'Soft Blush', gradient: 'from-[#D48A98] to-[#F2C6CF]', bg: '#FDF0F3', accent: '#A65D6C', border: '#F0D0D7' },
  { id: 'sage', name: 'Sage Calm', gradient: 'from-[#7EA896] to-[#B7D6C8]', bg: '#EFF7F3', accent: '#4C7A67', border: '#CBE3D8' },
  { id: 'dusk', name: 'Warm Dusk', gradient: 'from-[#C4967E] to-[#EBC8B5]', bg: '#FBF3EE', accent: '#8F624B', border: '#EBD5C8' },
  { id: 'sky', name: 'Sky Serenity', gradient: 'from-[#7D8CC4] to-[#B8C4EB]', bg: '#EEF1FB', accent: '#506099', border: '#CCD4F0' },
];

const LIFE_STAGES = [
  '16–20 · High School / Early College',
  '21–25 · University / Early Career',
  '26–30 · Young Professional',
  '30+ · Lifelong Learner',
];

const WELLNESS_INTENTIONS = [
  'Manage academic/work stress',
  'Understand my emotions',
  'Build daily self-care habits',
  'Overcome overthinking',
  'Private emotional journaling',
];

const COMPANION_TONES = [
  { id: 'warm', label: 'Warm & Gentle', desc: 'Soft, comforting validation with zero pressure.' },
  { id: 'reflective', label: 'Thoughtful & Reflective', desc: 'Deep, curious questions to untangle thoughts.' },
  { id: 'practical', label: 'Encouraging & Practical', desc: 'Grounded perspective with small actionable steps.' },
];

const MOOD_OPTIONS = [
  { id: 'calm', label: 'Calm', score: 5, color: '#8E7CC3', bg: '#F2EEFB', icon: Feather, desc: 'Grounded & steady' },
  { id: 'hopeful', label: 'Hopeful', score: 5, color: '#D48A98', bg: '#FDF0F3', icon: Sun, desc: 'Optimistic & light' },
  { id: 'reflective', label: 'Reflective', score: 4, color: '#7D8CC4', bg: '#EEF1FB', icon: Compass, desc: 'Thoughtful & inward' },
  { id: 'tired', label: 'Tired', score: 3, color: '#9B8EA8', bg: '#F4F1F7', icon: Coffee, desc: 'Low battery & drained' },
  { id: 'anxious', label: 'Anxious', score: 2, color: '#C98A9E', bg: '#FBF0F4', icon: Wind, desc: 'Restless & on edge' },
  { id: 'overwhelmed', label: 'Overwhelmed', score: 1, color: '#9E6B84', bg: '#F7ECF1', icon: CloudRain, desc: 'Carrying too much' },
];

const DAILY_AFFIRMATIONS = [
  "You don't have to figure everything out today. Taking one gentle step is enough.",
  "Your worth is not measured by your productivity or your to-do list.",
  "Feelings are visitors—acknowledge them with kindness, without letting them move in permanently.",
  "Slowing down is not falling behind; it is how you gather clarity.",
  "You are allowed to take up space, rest without guilt, and grow at your own pace."
];

const JOURNAL_PROMPTS = [
  "What is taking up the most mental space for you right now, and what would it feel like to set it down for an hour?",
  "What is one small moment from today or yesterday that brought you a sense of quiet comfort?",
  "If a close friend were feeling exactly how you feel right now, what would you gently say to them?",
  "What is one expectation you're putting on yourself this week that you could soften?",
  "Describe your current energy level like the weather—what does your inner sky look like today?",
  "What is one boundary or habit that has protected your peace recently?"
];

const INITIAL_MOOD_HISTORY = [
  { id: 'm1', day: 'Mon', date: 'Nov 16', moodId: 'tired', note: 'Late study session, need more rest.' },
  { id: 'm2', day: 'Tue', date: 'Nov 17', moodId: 'anxious', note: 'Presentation nerves before seminar.' },
  { id: 'm3', day: 'Wed', date: 'Nov 18', moodId: 'reflective', note: 'Talked things through, feeling clearer.' },
  { id: 'm4', day: 'Thu', date: 'Nov 19', moodId: 'hopeful', note: 'Finished my draft ahead of schedule!' },
  { id: 'm5', day: 'Fri', date: 'Today', moodId: 'calm', note: 'Morning tea and quiet music.' },
];

const INITIAL_HABITS = [
  { id: 'h1', label: 'Drink a full glass of water', category: 'Body', completed: true },
  { id: 'h2', label: 'Take a 5-minute screen-free pause', category: 'Mind', completed: true },
  { id: 'h3', label: 'Write 3 honest sentences in my journal', category: 'Clarity', completed: false },
  { id: 'h4', label: 'Step outside for fresh air & daylight', category: 'Reset', completed: false },
  { id: 'h5', label: 'Unclench jaw & drop shoulders', category: 'Calm', completed: true },
];

const INITIAL_JOURNAL_ENTRIES = [
  {
    id: 'j1',
    title: 'Learning to pace myself this semester',
    moodId: 'reflective',
    date: 'Nov 18, 2026',
    prompt: 'What is one expectation you’re putting on yourself this week that you could soften?',
    content: "I noticed today that I've been treating every small task like an emergency. When I paused for ten minutes without my phone, I realized most of the urgency was self-imposed. Tomorrow I want to focus on doing two important things well instead of rushing through ten."
  },
  {
    id: 'j2',
    title: 'Small pockets of quiet',
    moodId: 'calm',
    date: 'Nov 15, 2026',
    prompt: 'What is one small moment from today that brought you a sense of quiet comfort?',
    content: "Walking back from the library just before sunset when the air turned crisp. No headphones, just listening to the wind in the trees. Reminded me that my mind always feels lighter when I give it room to breathe."
  }
];

const BREATHING_MODES = {
  box: {
    id: 'box',
    name: 'Box Breathing',
    subtitle: '4 · 4 · 4 · 4 — Focus & Emotional Balance',
    description: 'Used to steady racing thoughts and bring your nervous system back to center.',
    phases: [
      { label: 'Inhale gently', duration: 4, scale: 1.38 },
      { label: 'Hold softly', duration: 4, scale: 1.38 },
      { label: 'Exhale slowly', duration: 4, scale: 0.85 },
      { label: 'Rest empty', duration: 4, scale: 0.85 },
    ]
  },
  relax: {
    id: 'relax',
    name: '4-7-8 Relaxing Breath',
    subtitle: '4 · 7 · 8 — Deep Anxiety & Sleep Relief',
    description: 'Extended exhalations signal safety to your body and quiet evening overthinking.',
    phases: [
      { label: 'Inhale through nose', duration: 4, scale: 1.4 },
      { label: 'Hold with ease', duration: 7, scale: 1.4 },
      { label: 'Exhale completely', duration: 8, scale: 0.82 },
    ]
  },
  reset: {
    id: 'reset',
    name: 'Calm Reset',
    subtitle: '4 · 2 · 6 — Quick Study or Work Break',
    description: 'A gentle 60-second reset between classes, meetings, or overwhelming tasks.',
    phases: [
      { label: 'Breathe in', duration: 4, scale: 1.35 },
      { label: 'Pause', duration: 2, scale: 1.35 },
      { label: 'Let it go', duration: 6, scale: 0.85 },
    ]
  }
};

const GROUNDING_STEPS = [
  { count: 5, sense: 'See', icon: Eye, prompt: 'Name 5 things you can see around you right now—notice light, texture, or color.' },
  { count: 4, sense: 'Feel', icon: Hand, prompt: 'Notice 4 physical sensations—your feet on the floor, fabric on your skin, or air temperature.' },
  { count: 3, sense: 'Hear', icon: Ear, prompt: 'Listen for 3 distinct sounds, near or far, without judging them.' },
  { count: 2, sense: 'Smell', icon: Flower2, prompt: 'Identify 2 scents in your space, or recall two comforting aromas you love.' },
  { count: 1, sense: 'Appreciate', icon: Heart, prompt: 'Name 1 kind truth or small thing you appreciate about yourself in this moment.' },
];

const COMPANION_STARTERS = [
  "I'm feeling overwhelmed with deadlines right now",
  "Help me untangle some overthinking",
  "I need a gentle, grounded pep talk",
  "Celebrate a small win with me today"
];

// --- Helper: Gemini API Call with Exponential Backoff ---
async function fetchGeminiCompanionReply(messages, latestUserText, userProfile) {
  const apiKey = "";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  const profileContext = userProfile
    ? `\nUser Profile Context:
- Preferred Name: ${userProfile.name}
- Life Stage: ${userProfile.lifeStage}
- Primary Wellness Intentions: ${userProfile.intentions?.join(', ') || 'General emotional well-being'}
- Preferred Tone: ${userProfile.toneLabel || 'Warm & Gentle'}
Address ${userProfile.name} naturally when appropriate (without overusing their name) and tailor your reflections to their life stage and preferred tone.`
    : '';

  const systemInstructionText = `You are Mindspace's AI Emotional Companion — a warm, mature, emotionally intelligent, non-judgmental wellness partner designed for students and young adults (ages 16–30).${profileContext}
Core guidelines:
- Tone: Gentle, calm, grounded, empathetic, and conversational (never clinical, robotic, or overly saccharine).
- Approach: Actively validate the user's feelings first, reflect back what you hear with clarity, and offer one gentle reflective question or a small, practical grounding idea when helpful.
- Boundaries: You are a supportive self-growth and emotional wellness companion, NOT a therapist or medical professional. Never diagnose conditions or prescribe treatments. If a user expresses severe distress or self-harm, respond with deep compassion and gently encourage reaching out to a trusted person or professional crisis helpline.
- Length: Keep responses concise and easy to read (2–3 short paragraphs max).`;

  const conversationContents = messages.slice(-8).map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  conversationContents.push({
    role: 'user',
    parts: [{ text: latestUserText }]
  });

  const payload = {
    contents: conversationContents,
    systemInstruction: {
      parts: [{ text: systemInstructionText }]
    },
    generationConfig: {
      temperature: 0.75,
      maxOutputTokens: 350,
    }
  };

  const delays = [1000, 2000, 4000];
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (replyText) {
        return replyText.trim();
      }
      throw new Error("Empty candidate response");
    } catch (err) {
      if (attempt < delays.length) {
        await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
      } else {
        // Graceful fallback if offline or API unavailable
        const greeting = userProfile?.name ? `${userProfile.name}, I` : 'I';
        return `${greeting} hear how much you're carrying right now, and I'm really glad you took a moment to put it into words here. Take one slow breath with me—what feels like the single heaviest piece on your mind at this exact moment?`;
      }
    }
  }
}

export default function App() {
  // User Profile State (Mandatory Gate if null)
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('mindspace_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Onboarding / Profile Form State
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [formName, setFormName] = useState('');
  const [formLifeStage, setFormLifeStage] = useState(LIFE_STAGES[1]);
  const [formAuraId, setFormAuraId] = useState('lavender');
  const [formIntentions, setFormIntentions] = useState(['Manage academic/work stress', 'Understand my emotions']);
  const [formToneId, setFormToneId] = useState('warm');
  const [formInitialMoodId, setFormInitialMoodId] = useState('calm');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Navigation & Modal State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Affirmation State
  const [affirmationIdx, setAffirmationIdx] = useState(0);

  // Mood Tracker State (persisted in localStorage)
  const [moodHistory, setMoodHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('mindspace_moods');
      return saved ? JSON.parse(saved) : INITIAL_MOOD_HISTORY;
    } catch {
      return INITIAL_MOOD_HISTORY;
    }
  });
  const [selectedMoodId, setSelectedMoodId] = useState('calm');
  const [moodNote, setMoodNote] = useState('');

  // Self-Care Habits State
  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem('mindspace_habits');
      return saved ? JSON.parse(saved) : INITIAL_HABITS;
    } catch {
      return INITIAL_HABITS;
    }
  });
  const [newHabitText, setNewHabitText] = useState('');

  // Journal State
  const [journalEntries, setJournalEntries] = useState(() => {
    try {
      const saved = localStorage.getItem('mindspace_journal');
      return saved ? JSON.parse(saved) : INITIAL_JOURNAL_ENTRIES;
    } catch {
      return INITIAL_JOURNAL_ENTRIES;
    }
  });
  const [promptIdx, setPromptIdx] = useState(0);
  const [journalTitle, setJournalTitle] = useState('');
  const [journalBody, setJournalBody] = useState('');
  const [journalMoodId, setJournalMoodId] = useState('reflective');
  const [activeEntryId, setActiveEntryId] = useState(null);

  // AI Companion Chat State
  const [chatMessages, setChatMessages] = useState(() => {
    try {
      const savedProfile = JSON.parse(localStorage.getItem('mindspace_profile') || 'null');
      const namePart = savedProfile?.name ? `, ${savedProfile.name}` : '';
      return [
        {
          id: 'welcome-1',
          sender: 'ai',
          text: `Welcome to your safe space${namePart}. Whether your mind feels busy, heavy, or simply reflective today, there's no pressure to have everything figured out here. How are you genuinely arriving in this moment?`,
          time: 'Just now'
        }
      ];
    } catch {
      return [
        {
          id: 'welcome-1',
          sender: 'ai',
          text: "Welcome to your safe space. Whether your mind feels busy, heavy, or simply reflective today, there's no pressure to have everything figured out here. How are you genuinely arriving in this moment?",
          time: 'Just now'
        }
      ];
    }
  });
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Breathing & Mindfulness State
  const [breathingModeKey, setBreathingModeKey] = useState('box');
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(BREATHING_MODES.box.phases[0].duration);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [groundingStep, setGroundingStep] = useState(0);

  // Persist key user data
  useEffect(() => {
    try {
      if (userProfile) {
        localStorage.setItem('mindspace_profile', JSON.stringify(userProfile));
      } else {
        localStorage.removeItem('mindspace_profile');
      }
    } catch {}
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('mindspace_moods', JSON.stringify(moodHistory));
    } catch {}
  }, [moodHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('mindspace_habits', JSON.stringify(habits));
    } catch {}
  }, [habits]);

  useEffect(() => {
    try {
      localStorage.setItem('mindspace_journal', JSON.stringify(journalEntries));
    } catch {}
  }, [journalEntries]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiTyping]);

  // Breathing timer loop
  useEffect(() => {
    if (!isBreathingActive) return;
    const mode = BREATHING_MODES[breathingModeKey];
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;
        // Advance phase
        setPhaseIndex((prevPhase) => {
          const nextPhase = (prevPhase + 1) % mode.phases.length;
          if (nextPhase === 0) {
            setCompletedCycles((c) => c + 1);
          }
          setSecondsLeft(mode.phases[nextPhase].duration);
          return nextPhase;
        });
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreathingActive, breathingModeKey]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // --- Onboarding & Profile Handlers ---
  const toggleFormIntention = (item) => {
    setFormIntentions((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleCompleteOnboarding = (e) => {
    e.preventDefault();
    const cleanName = formName.trim();
    if (!cleanName) return;

    const selectedToneObj = COMPANION_TONES.find((t) => t.id === formToneId) || COMPANION_TONES[0];
    const newProfile = {
      name: cleanName,
      lifeStage: formLifeStage,
      auraId: formAuraId,
      intentions: formIntentions.length > 0 ? formIntentions : ['Understand my emotions'],
      toneId: selectedToneObj.id,
      toneLabel: selectedToneObj.label,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    };

    setUserProfile(newProfile);

    // Log initial check-in mood as today's entry
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const firstMoodEntry = {
      id: `m-${Date.now()}`,
      day: days[now.getDay()],
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      moodId: formInitialMoodId,
      note: 'First check-in upon creating my Sanctuary profile.'
    };
    setMoodHistory((prev) => [...prev.slice(-6), firstMoodEntry]);
    setSelectedMoodId(formInitialMoodId);

    // Personalize AI welcome message
    setChatMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: `Welcome to your safe space, ${cleanName}. I'm honored to walk alongside you as you focus on ${newProfile.intentions[0].toLowerCase()}. There's no rush or judgment here—how are you genuinely arriving in this moment?`,
        time: 'Just now'
      }
    ]);

    setActiveTab('dashboard');
    triggerToast(`Welcome to Mindspace, ${cleanName} ✨`);
  };

  const startEditingProfile = () => {
    if (!userProfile) return;
    setFormName(userProfile.name);
    setFormLifeStage(userProfile.lifeStage);
    setFormAuraId(userProfile.auraId);
    setFormIntentions(userProfile.intentions || []);
    setFormToneId(userProfile.toneId || 'warm');
    setIsEditingProfile(true);
  };

  const handleSaveEditedProfile = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;
    const selectedToneObj = COMPANION_TONES.find((t) => t.id === formToneId) || COMPANION_TONES[0];
    setUserProfile((prev) => ({
      ...prev,
      name: formName.trim(),
      lifeStage: formLifeStage,
      auraId: formAuraId,
      intentions: formIntentions.length > 0 ? formIntentions : ['Understand my emotions'],
      toneId: selectedToneObj.id,
      toneLabel: selectedToneObj.label,
    }));
    setIsEditingProfile(false);
    triggerToast('Sanctuary profile updated.');
  };

  const handleResetSanctuary = () => {
    try {
      localStorage.removeItem('mindspace_profile');
      localStorage.removeItem('mindspace_moods');
      localStorage.removeItem('mindspace_habits');
      localStorage.removeItem('mindspace_journal');
    } catch {}
    setUserProfile(null);
    setMoodHistory(INITIAL_MOOD_HISTORY);
    setHabits(INITIAL_HABITS);
    setJournalEntries(INITIAL_JOURNAL_ENTRIES);
    setFormName('');
    setOnboardingStep(1);
    setIsEditingProfile(false);
    setShowResetConfirmModal(false);
    setActiveTab('dashboard');
  };

  // --- Handlers ---
  const handleLogMood = (e) => {
    e.preventDefault();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const todayLabel = days[now.getDay()];
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const newEntry = {
      id: `m-${Date.now()}`,
      day: todayLabel,
      date: dateStr,
      moodId: selectedMoodId,
      note: moodNote.trim() || 'Checked in with myself.'
    };

    setMoodHistory((prev) => [...prev.slice(-6), newEntry]);
    setMoodNote('');
    const moodObj = MOOD_OPTIONS.find((m) => m.id === selectedMoodId);
    triggerToast(`Logged "${moodObj?.label}" to your emotional rhythm.`);
  };

  const toggleHabit = (id) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabitText.trim()) return;
    setHabits((prev) => [
      ...prev,
      { id: `h-${Date.now()}`, label: newHabitText.trim(), category: 'Personal', completed: false }
    ]);
    setNewHabitText('');
    triggerToast('Added gentle self-care intention.');
  };

  const handleSaveJournal = (e) => {
    e.preventDefault();
    if (!journalBody.trim()) return;

    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const newEntry = {
      id: `j-${Date.now()}`,
      title: journalTitle.trim() || 'Untitled Reflection',
      moodId: journalMoodId,
      date: dateStr,
      prompt: JOURNAL_PROMPTS[promptIdx],
      content: journalBody.trim()
    };

    setJournalEntries((prev) => [newEntry, ...prev]);
    setJournalTitle('');
    setJournalBody('');
    setActiveEntryId(newEntry.id);
    triggerToast('Reflection saved privately to your journal.');
  };

  const handleDeleteJournal = (id) => {
    setJournalEntries((prev) => prev.filter((item) => item.id !== id));
    if (activeEntryId === id) setActiveEntryId(null);
    triggerToast('Journal entry removed.');
  };

  const handleSendChat = async (customText?: string) => {
    const textToSend = (typeof customText === 'string' ? customText : chatInput).trim();
    if (!textToSend || isAiTyping) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: timeStr
    };

    const updatedHistory = [...chatMessages, userMsg];
    setChatMessages(updatedHistory);
    setChatInput('');
    setIsAiTyping(true);

    const replyText = await fetchGeminiCompanionReply(chatMessages, textToSend, userProfile);
    const aiMsg = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, aiMsg]);
    setIsAiTyping(false);
  };

  const selectBreathingMode = (key) => {
    setIsBreathingActive(false);
    setBreathingModeKey(key);
    setPhaseIndex(0);
    setSecondsLeft(BREATHING_MODES[key].phases[0].duration);
    setCompletedCycles(0);
  };

  // --- Computed Insights ---
  const completedHabitsCount = habits.filter((h) => h.completed).length;
  const habitProgress = habits.length ? Math.round((completedHabitsCount / habits.length) * 100) : 0;

  const personalizedInsight = useMemo(() => {
    const latest = moodHistory[moodHistory.length - 1];
    const latestMood = MOOD_OPTIONS.find((m) => m.id === latest?.moodId) || MOOD_OPTIONS[0];
    if (latestMood.id === 'anxious' || latestMood.id === 'overwhelmed') {
      return {
        badge: 'Gentle Nervous System Care',
        headline: `You recently checked in feeling ${latestMood.label.toLowerCase()}.`,
        body: 'When your mind is carrying a lot at once, short somatic resets help more than forcing productivity. Try 3 cycles of 4-7-8 breathing or vent freely with your AI Companion.',
        ctaText: 'Try Guided Breathing',
        ctaTab: 'mindfulness'
      };
    }
    if (latestMood.id === 'tired') {
      return {
        badge: 'Rest & Restoration',
        headline: 'Your energy battery looks a little low lately.',
        body: 'Low energy is information, not failure. Consider picking just one small self-care habit today and giving yourself permission to log off early tonight.',
        ctaText: 'Talk It Through',
        ctaTab: 'companion'
      };
    }
    return {
      badge: 'Steady Emotional Momentum',
      headline: `You're leaning into a ${latestMood.label.toLowerCase()} rhythm this week.`,
      body: 'Noticing what supports your calm moments makes it easier to return to them on stressful days. Capture what is working in a quick 3-sentence reflection.',
      ctaText: 'Open Digital Journal',
      ctaTab: 'journal'
    };
  }, [moodHistory]);

  const activeJournalEntry = journalEntries.find((e) => e.id === activeEntryId) || null;
  const currentBreathingMode = BREATHING_MODES[breathingModeKey];
  const currentPhase = currentBreathingMode.phases[phaseIndex];
  const activeAura = AURA_THEMES.find((a) => a.id === (userProfile?.auraId || formAuraId)) || AURA_THEMES[0];

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const navItems = [
    { id: 'dashboard', label: 'Sanctuary', icon: Home },
    { id: 'companion', label: 'AI Companion', icon: MessageCircleHeart },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'mindfulness', label: 'Breathe & Reset', icon: Wind },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // ============================================================================
  // MANDATORY ONBOARDING / PROFILE CREATION GATE (Shown before main app)
  // ============================================================================
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-[#F8F7FA] text-[#2D2A32] flex flex-col justify-between selection:bg-[#E6E0F8] selection:text-[#2D2A32]">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: #F8F7FA;
          }
          .font-editorial {
            font-family: 'Instrument Serif', Georgia, serif;
          }
          .onboarding-card {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(14px);
            border: 1px solid #ECE8F2;
            box-shadow: 0 20px 50px -15px rgba(107, 91, 149, 0.12);
          }
        `}</style>

        {/* Top Minimal Header */}
        <header className="w-full max-w-4xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8E7CC3] to-[#E8B4BC] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-editorial text-3xl text-[#2D2A32] leading-none">Mindspace</h1>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#686273] mt-1">
                Lavender · Calm · Clarity
              </p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 rounded-full transition-all duration-300 ${
                  onboardingStep === step
                    ? 'w-8 bg-[#6B5B95]'
                    : onboardingStep > step
                    ? 'w-3 bg-[#B4A7D6]'
                    : 'w-3 bg-[#E6E0F8]'
                }`}
              />
            ))}
          </div>
        </header>

        {/* Center Onboarding Card */}
        <main className="flex-1 flex items-center justify-center px-4 py-6">
          <div className="onboarding-card w-full max-w-2xl rounded-3xl p-6 sm:p-10 relative overflow-hidden">
            {/* Soft Ambient Corner Glow */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#E6E0F8]/50 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-[#F9E8EC]/60 blur-3xl" />

            <form onSubmit={handleCompleteOnboarding} className="relative z-10">
              {/* STEP 1: Identity & Sanctuary Aura */}
              {onboardingStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2EEFB] text-[#6B5B95] text-xs font-semibold mb-3">
                      <Sparkle className="w-3.5 h-3.5" />
                      <span>Step 1 of 3 · Create Your Sanctuary Profile</span>
                    </span>
                    <h2 className="font-editorial text-3xl sm:text-4xl text-[#2D2A32] leading-tight">
                      First, let’s make this space feel like yours.
                    </h2>
                    <p className="text-sm text-[#686273] mt-1.5">
                      Your profile stays private on your device and tailors your AI companion, reflections, and daily insights.
                    </p>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#544E5E] mb-2">
                      What should we call you? <span className="text-[#B56576]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Enter your preferred name or nickname (e.g., Maya, Aarav)..."
                      className="w-full px-4 py-3.5 rounded-2xl bg-[#FAF9FC] border border-[#E2DCEB] text-base text-[#2D2A32] placeholder:text-[#9A94A6] focus:outline-none focus:border-[#8E7CC3] focus:ring-2 focus:ring-[#8E7CC3]/15"
                    />
                  </div>

                  {/* Age Group / Life Stage */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#544E5E] mb-2">
                      Current Life Stage
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {LIFE_STAGES.map((stage) => (
                        <button
                          type="button"
                          key={stage}
                          onClick={() => setFormLifeStage(stage)}
                          className={`px-4 py-3 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all ${
                            formLifeStage === stage
                              ? 'bg-[#F3EFFB] border-[#8E7CC3] text-[#4A3B75] font-semibold'
                              : 'bg-white/80 border-[#ECE8F2] text-[#544E5E] hover:bg-white'
                          }`}
                        >
                          {stage}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sanctuary Aura Selection */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#544E5E] mb-2">
                      Choose Your Sanctuary Aura
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {AURA_THEMES.map((aura) => {
                        const isSelected = formAuraId === aura.id;
                        return (
                          <button
                            type="button"
                            key={aura.id}
                            onClick={() => setFormAuraId(aura.id)}
                            className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${
                              isSelected
                                ? 'bg-white border-[#8E7CC3] ring-2 ring-[#8E7CC3]/20 shadow-xs'
                                : 'bg-white/60 border-[#ECE8F2] hover:bg-white'
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-full bg-gradient-to-br ${aura.gradient} flex items-center justify-center text-white font-editorial text-lg shadow-2xs mb-1.5`}
                            >
                              {formName.trim() ? formName.trim()[0].toUpperCase() : '✦'}
                            </div>
                            <span className="text-[11px] font-medium text-[#2D2A32] text-center leading-tight">
                              {aura.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      disabled={!formName.trim()}
                      onClick={() => setOnboardingStep(2)}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#6B5B95] hover:bg-[#594A80] disabled:opacity-40 text-white text-sm font-medium transition-all shadow-xs"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Wellness Intentions & Companion Tone */}
              {onboardingStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F9E8EC] text-[#9E5A6B] text-xs font-semibold mb-3">
                      <Heart className="w-3.5 h-3.5" />
                      <span>Step 2 of 3 · Personalize Your Experience</span>
                    </span>
                    <h2 className="font-editorial text-3xl sm:text-4xl text-[#2D2A32] leading-tight">
                      What brings you to Mindspace, {formName.trim()}?
                    </h2>
                    <p className="text-sm text-[#686273] mt-1">
                      Select all intentions that resonate right now—you can adjust these anytime.
                    </p>
                  </div>

                  {/* Multi-Select Intentions */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#544E5E] mb-2.5">
                      Primary Wellness Intentions
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {WELLNESS_INTENTIONS.map((intention) => {
                        const selected = formIntentions.includes(intention);
                        return (
                          <button
                            type="button"
                            key={intention}
                            onClick={() => toggleFormIntention(intention)}
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all ${
                              selected
                                ? 'bg-[#E6E0F8]/80 border-[#8E7CC3] text-[#4A3B75] font-semibold'
                                : 'bg-white/80 border-[#ECE8F2] text-[#544E5E] hover:bg-white'
                            }`}
                          >
                            {selected ? (
                              <CheckCircle2 className="w-4 h-4 text-[#6B5B95]" />
                            ) : (
                              <Circle className="w-4 h-4 text-[#C5BED4]" />
                            )}
                            <span>{intention}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* AI Companion Tone */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#544E5E] mb-2.5">
                      AI Emotional Companion Tone
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {COMPANION_TONES.map((tone) => {
                        const selected = formToneId === tone.id;
                        return (
                          <button
                            type="button"
                            key={tone.id}
                            onClick={() => setFormToneId(tone.id)}
                            className={`p-3.5 rounded-2xl border text-left transition-all ${
                              selected
                                ? 'bg-[#FDF2F5] border-[#D48A98] ring-2 ring-[#D48A98]/20'
                                : 'bg-white/80 border-[#ECE8F2] hover:bg-white'
                            }`}
                          >
                            <p className="text-sm font-semibold text-[#2D2A32]">{tone.label}</p>
                            <p className="text-xs text-[#686273] mt-1 leading-relaxed">{tone.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setOnboardingStep(1)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#686273] hover:text-[#2D2A32]"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setOnboardingStep(3)}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#6B5B95] hover:bg-[#594A80] text-white text-sm font-medium transition-all shadow-xs"
                    >
                      <span>Next: First Check-in</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Initial Mood Check-in & Enter Sanctuary */}
              {onboardingStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2EEFB] text-[#6B5B95] text-xs font-semibold mb-3">
                      <Feather className="w-3.5 h-3.5" />
                      <span>Step 3 of 3 · Gentle Arrival</span>
                    </span>
                    <h2 className="font-editorial text-3xl sm:text-4xl text-[#2D2A32] leading-tight">
                      How are you arriving today, {formName.trim()}?
                    </h2>
                    <p className="text-sm text-[#686273] mt-1">
                      This logs your very first emotional check-in on your Sanctuary dashboard.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {MOOD_OPTIONS.map((mood) => {
                      const Icon = mood.icon;
                      const active = formInitialMoodId === mood.id;
                      return (
                        <button
                          type="button"
                          key={mood.id}
                          onClick={() => setFormInitialMoodId(mood.id)}
                          className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all ${
                            active
                              ? 'border-[#8E7CC3] bg-[#F4F0FC] shadow-xs ring-2 ring-[#8E7CC3]/20'
                              : 'border-[#ECE8F2] bg-white/80 hover:bg-white'
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
                            style={{ backgroundColor: mood.bg, color: mood.color }}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-semibold text-[#2D2A32]">{mood.label}</span>
                          <span className="text-[11px] text-[#686273] mt-0.5">{mood.desc}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Mini Summary Preview Card */}
                  <div className="p-4 rounded-2xl bg-[#FAF8FD] border border-[#ECE8F2] flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeAura.gradient} flex items-center justify-center text-white font-editorial text-2xl shrink-0`}
                    >
                      {formName.trim()[0]?.toUpperCase() || 'M'}
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-[#2D2A32] text-sm">
                        {formName.trim()}’s Sanctuary · {activeAura.name}
                      </p>
                      <p className="text-[#686273] mt-0.5">
                        {formLifeStage} · Companion tone: <strong>{COMPANION_TONES.find((t) => t.id === formToneId)?.label}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setOnboardingStep(2)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#686273] hover:text-[#2D2A32]"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#2D2A32] hover:bg-[#413D48] text-white text-sm font-medium transition-all shadow-md"
                    >
                      <Sparkles className="w-4 h-4 text-[#E6E0F8]" />
                      <span>Enter My Sanctuary</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </main>

        {/* Ethical Footer Note */}
        <footer className="w-full max-w-4xl mx-auto px-6 py-5 text-center text-[11px] text-[#686273]">
          Your Space. Your Pace. Mindspace is a private wellness & self-reflection tool, not a medical diagnostic service.
        </footer>
      </div>
    );
  }

  // ============================================================================
  // MAIN AUTHENTICATED / PROFILED SANCTUARY EXPERIENCE
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#FAF9FC] text-[#2A2630] flex flex-col md:flex-row selection:bg-[#E6E0F8] selection:text-[#2A2630]">
      {/* Google Fonts & Custom Soft Editorial Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #FAF9FC;
        }
        .font-editorial {
          font-family: 'Instrument Serif', Georgia, serif;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid #ECE8F2;
          box-shadow: 0 10px 30px -12px rgba(107, 91, 149, 0.08);
        }
        .soft-gradient-banner {
          background: linear-gradient(135deg, #F3EFFB 0%, #FDF2F5 55%, #FAF9FC 100%);
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.9; }
        }
        .animate-pulse-slow {
          animation: pulseSlow 4s ease-in-out infinite;
        }
      `}</style>

      {/* Subtle Floating Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 bg-[#2A2630] text-white px-4 py-3 rounded-2xl shadow-xl text-sm animate-fade-in">
          <Sparkles className="w-4 h-4 text-[#E6E0F8]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-white/90 border-r border-[#ECE8F2] px-6 py-8 justify-between z-30">
        <div>
          {/* Brand Logo */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8E7CC3] to-[#E8B4BC] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-editorial text-3xl tracking-tight text-[#2A2630] leading-none">
                Mindspace
              </h1>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#686273] mt-1">
                Lavender · Calm · Clarity
              </p>
            </div>
          </div>

          <p className="text-xs text-[#686273] italic mt-3 mb-8 pl-1">
            "A safe space for your mind."
          </p>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#E6E0F8]/75 text-[#4A3B75] shadow-xs font-semibold'
                      : 'text-[#686273] hover:bg-[#FAF9FC] hover:text-[#2A2630]'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#6B5B95]' : 'text-[#8D8699]'}`} />
                  <span>{item.label}</span>
                  {item.id === 'companion' && (
                    <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-[#F9E8EC] text-[#9E5A6B] font-semibold">
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Ethical Disclaimer & Urgent Support Card */}
        <div className="space-y-3">
          {/* Active Profile Pill */}
          <button
            onClick={() => setActiveTab('profile')}
            className="w-full p-3 rounded-2xl bg-white hover:bg-[#FAF8FD] border border-[#ECE8F2] flex items-center gap-3 text-left transition-all"
          >
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activeAura.gradient} flex items-center justify-center text-white font-editorial text-xl shrink-0`}
            >
              {userProfile.name[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#2A2630] truncate">{userProfile.name}</p>
              <p className="text-[10px] text-[#686273] truncate">{activeAura.name}</p>
            </div>
            <Sliders className="w-3.5 h-3.5 text-[#8D8699] shrink-0" />
          </button>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F7F4FC] to-[#FDF4F6] border border-[#ECE8F2]">
            <p className="text-xs font-semibold text-[#2A2630] mb-1">
              Your Space. Your Pace.
            </p>
            <p className="text-[11px] leading-relaxed text-[#686273]">
              Mindspace is a wellness & self-reflection tool, not a medical diagnostic service.
            </p>
            <button
              onClick={() => setShowSafetyModal(true)}
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B5B95] hover:text-[#4A3B75] transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Support & Helplines</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#ECE8F2] px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8E7CC3] to-[#E8B4BC] flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-editorial text-2xl text-[#2A2630]">Mindspace</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSafetyModal(true)}
            className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#F9E8EC] text-[#8E4B5C] flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Support</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-8 h-8 rounded-full bg-gradient-to-br ${activeAura.gradient} text-white font-editorial text-lg flex items-center justify-center shadow-2xs`}
            title="Your Profile"
          >
            {userProfile.name[0]?.toUpperCase()}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 md:pl-72 pb-24 md:pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-6 sm:pt-10">
          {/* ================= TAB 1: DASHBOARD (SANCTUARY) ================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Hero Welcome & Rotating Affirmation */}
              <section className="soft-gradient-banner rounded-3xl p-6 sm:p-8 border border-[#ECE8F2] relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#ECE8F2] text-xs font-medium text-[#6B5B95] mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {new Date().toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <h2 className="font-editorial text-3xl sm:text-4xl text-[#2A2630] leading-tight">
                      {getTimeGreeting()}, {userProfile.name}.
                    </h2>
                    <p className="mt-2.5 text-sm sm:text-base text-[#544E5E] leading-relaxed italic">
                      “{DAILY_AFFIRMATIONS[affirmationIdx]}”
                    </p>
                  </div>
                  <button
                    onClick={() => setAffirmationIdx((prev) => (prev + 1) % DAILY_AFFIRMATIONS.length)}
                    className="self-start sm:self-center inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/90 hover:bg-white border border-[#ECE8F2] text-xs font-medium text-[#686273] hover:text-[#2A2630] transition-all shrink-0"
                    title="New gentle affirmation"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>New Affirmation</span>
                  </button>
                </div>
              </section>

              {/* Row 1: Mood Check-in + Weekly Rhythm */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Daily Mood Check-in Card */}
                <div className="lg:col-span-7 glass-card rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-editorial text-2xl text-[#2A2630]">
                      How is your mind feeling right now?
                    </h3>
                  </div>
                  <p className="text-xs text-[#686273] mb-5">
                    No judgment—just noticing where you are today builds emotional clarity.
                  </p>

                  <form onSubmit={handleLogMood} className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {MOOD_OPTIONS.map((mood) => {
                        const Icon = mood.icon;
                        const active = selectedMoodId === mood.id;
                        return (
                          <button
                            type="button"
                            key={mood.id}
                            onClick={() => setSelectedMoodId(mood.id)}
                            className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all ${
                              active
                                ? 'border-[#8E7CC3] bg-[#F4F0FC] shadow-xs ring-2 ring-[#8E7CC3]/20'
                                : 'border-[#ECE8F2] bg-white/70 hover:bg-white'
                            }`}
                          >
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
                              style={{ backgroundColor: mood.bg, color: mood.color }}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-semibold text-[#2A2630]">{mood.label}</span>
                            <span className="text-[11px] text-[#686273] mt-0.5">{mood.desc}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                      <input
                        type="text"
                        value={moodNote}
                        onChange={(e) => setMoodNote(e.target.value)}
                        placeholder="Optional: Add a 1-line note about what's influencing your mood..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF9FC] border border-[#ECE8F2] text-sm text-[#2A2630] placeholder:text-[#9A94A6] focus:outline-none focus:border-[#8E7CC3]"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-[#6B5B95] hover:bg-[#594A80] text-white text-sm font-medium transition-colors shrink-0 shadow-xs"
                      >
                        Log Check-in
                      </button>
                    </div>
                  </form>
                </div>

                {/* Weekly Emotional Rhythm */}
                <div className="lg:col-span-5 glass-card rounded-3xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-editorial text-2xl text-[#2A2630]">
                        Weekly Emotional Rhythm
                      </h3>
                      <TrendingUp className="w-4 h-4 text-[#8E7CC3]" />
                    </div>
                    <p className="text-xs text-[#686273] mb-6">
                      Your recent check-ins at a glance.
                    </p>

                    {/* Visual Mood Bars */}
                    <div className="grid grid-cols-5 gap-2.5 items-end h-40 pt-4 px-1">
                      {moodHistory.slice(-5).map((entry) => {
                        const moodObj = MOOD_OPTIONS.find((m) => m.id === entry.moodId) || MOOD_OPTIONS[0];
                        const heightPct = `${moodObj.score * 18 + 10}%`;
                        return (
                          <div key={entry.id} className="flex flex-col items-center h-full justify-end group relative">
                            <span className="text-[10px] font-medium text-[#686273] mb-1.5 opacity-85">
                              {moodObj.label}
                            </span>
                            <div
                              className="w-full max-w-[42px] rounded-t-2xl rounded-b-lg transition-all duration-500 flex items-end justify-center pb-2"
                              style={{
                                height: heightPct,
                                backgroundColor: moodObj.bg,
                                border: `1px solid ${moodObj.color}40`
                              }}
                              title={`${entry.day}: ${moodObj.label} — ${entry.note}`}
                            >
                              <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: moodObj.color }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-[#2A2630] mt-2">
                              {entry.day}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Latest Check-in Note Preview */}
                  {moodHistory.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-[#ECE8F2] text-xs text-[#686273]">
                      <span className="font-semibold text-[#2A2630]">Latest note: </span>
                      “{moodHistory[moodHistory.length - 1].note}”
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2: Daily Self-Care Tracker + Personalized Insight */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Self-Care Micro-Habits */}
                <div className="lg:col-span-7 glass-card rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-editorial text-2xl text-[#2A2630]">
                      Gentle Self-Care Tracker
                    </h3>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F2EEFB] text-[#6B5B95]">
                      {completedHabitsCount}/{habits.length} completed ({habitProgress}%)
                    </span>
                  </div>
                  <p className="text-xs text-[#686273] mb-4">
                    Small, consistent anchors to care for your body and mind.
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-[#F1EDF7] overflow-hidden mb-5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#8E7CC3] to-[#E8B4BC] transition-all duration-500"
                      style={{ width: `${habitProgress}%` }}
                    />
                  </div>

                  <div className="space-y-2 mb-4">
                    {habits.map((habit) => (
                      <button
                        key={habit.id}
                        onClick={() => toggleHabit(habit.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                          habit.completed
                            ? 'bg-[#FAF8FD] border-[#E6E0F8] text-[#8E8799]'
                            : 'bg-white border-[#ECE8F2] text-[#2A2630] hover:border-[#D4C9EE]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {habit.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-[#8E7CC3] shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-[#C5BED4] shrink-0" />
                          )}
                          <span className={`text-sm ${habit.completed ? 'line-through' : 'font-medium'}`}>
                            {habit.label}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF9FC] border border-[#ECE8F2] text-[#686273]">
                          {habit.category}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Add Habit Input */}
                  <form onSubmit={handleAddHabit} className="flex gap-2">
                    <input
                      type="text"
                      value={newHabitText}
                      onChange={(e) => setNewHabitText(e.target.value)}
                      placeholder="Add a tiny self-care ritual (e.g., Stretch for 2 mins)..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[#FAF9FC] border border-[#ECE8F2] text-xs text-[#2A2630] focus:outline-none focus:border-[#8E7CC3]"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#F2EEFB] hover:bg-[#E6E0F8] text-[#5B4B8A] text-xs font-semibold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </form>
                </div>

                {/* Personalized AI Insight Card */}
                <div className="lg:col-span-5 rounded-3xl p-6 bg-gradient-to-b from-[#F5F0FC] to-[#FDF2F5] border border-[#E6DFEF] flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-[#6B5B95] text-xs font-semibold mb-4">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{personalizedInsight.badge}</span>
                    </div>
                    <h3 className="font-editorial text-2xl text-[#2A2630] leading-snug mb-3">
                      {personalizedInsight.headline}
                    </h3>
                    <p className="text-sm text-[#544E5E] leading-relaxed">
                      {personalizedInsight.body}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E6DFEF]/80 flex flex-wrap gap-2.5">
                    <button
                      onClick={() => setActiveTab(personalizedInsight.ctaTab)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2A2630] hover:bg-[#3E3847] text-white text-xs font-medium transition-colors"
                    >
                      <span>{personalizedInsight.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveTab('companion')}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/90 hover:bg-white text-[#2A2630] border border-[#ECE8F2] text-xs font-medium transition-colors"
                    >
                      <span>Chat with AI Companion</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: AI EMOTIONAL COMPANION ================= */}
          {activeTab === 'companion' && (
            <div className="glass-card rounded-3xl overflow-hidden flex flex-col h-[calc(100vh-11rem)] md:h-[calc(100vh-6rem)]">
              {/* Companion Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-[#F5F1FC] to-[#FDF3F6] border-b border-[#ECE8F2] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-[#E6E0F8] flex items-center justify-center text-[#6B5B95] shadow-2xs">
                    <MessageCircleHeart className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-editorial text-2xl text-[#2A2630] leading-none">
                        AI Emotional Companion
                      </h2>
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-xs text-[#686273] mt-1">
                      Judgment-free reflection · Private & supportive
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowSafetyModal(true)}
                  className="text-xs font-medium px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-[#ECE8F2] text-[#8E4B5C] flex items-center gap-1.5 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Need urgent support?</span>
                </button>
              </div>

              {/* Chat Messages Stream */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-[#FAF9FC]/60">
                {chatMessages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] px-4 py-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                          isUser
                            ? 'bg-[#6B5B95] text-white rounded-br-sm shadow-xs'
                            : 'bg-white border border-[#ECE8F2] text-[#2A2630] rounded-bl-sm shadow-2xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-[#8E8799] mt-1 px-1">
                        {isUser ? 'You' : 'Mindspace Companion'} · {msg.time}
                      </span>
                    </div>
                  );
                })}

                {isAiTyping && (
                  <div className="flex items-start">
                    <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white border border-[#ECE8F2] text-xs text-[#686273] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8E7CC3] animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8E7CC3] animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8E7CC3] animate-bounce [animation-delay:300ms]" />
                      <span className="ml-1">Listening thoughtfully...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Starter Chips */}
              <div className="px-5 py-2.5 bg-white border-t border-[#ECE8F2] flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-[11px] font-medium text-[#8E8799] shrink-0">Prompts:</span>
                {COMPANION_STARTERS.map((starter, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendChat(starter)}
                    disabled={isAiTyping}
                    className="text-xs px-3 py-1.5 rounded-full bg-[#F6F3FB] hover:bg-[#E6E0F8] text-[#5B4B8A] transition-colors shrink-0 disabled:opacity-50"
                  >
                    {starter}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat();
                }}
                className="p-4 bg-white border-t border-[#ECE8F2] flex items-center gap-3"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Share whatever is on your mind..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-[#FAF9FC] border border-[#ECE8F2] text-sm text-[#2A2630] placeholder:text-[#9A94A6] focus:outline-none focus:border-[#8E7CC3]"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isAiTyping}
                  className="p-3.5 rounded-2xl bg-[#6B5B95] hover:bg-[#594A80] disabled:opacity-40 text-white transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* ================= TAB 3: DIGITAL JOURNAL ================= */}
          {activeTab === 'journal' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Past Entries List */}
              <div className="lg:col-span-4 space-y-4">
                <div className="glass-card rounded-3xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="font-editorial text-2xl text-[#2A2630]">Your Reflections</h2>
                      <p className="text-xs text-[#686273]">{journalEntries.length} private entries</p>
                    </div>
                    <button
                      onClick={() => setActiveEntryId(null)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#6B5B95] text-white text-xs font-medium hover:bg-[#594A80] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Entry</span>
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {journalEntries.map((entry) => {
                      const moodObj = MOOD_OPTIONS.find((m) => m.id === entry.moodId) || MOOD_OPTIONS[2];
                      const isSelected = activeEntryId === entry.id;
                      return (
                        <div
                          key={entry.id}
                          onClick={() => setActiveEntryId(entry.id)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#F3EFFB] border-[#8E7CC3]'
                              : 'bg-white/80 border-[#ECE8F2] hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: moodObj.bg, color: moodObj.color }}
                            >
                              {moodObj.label}
                            </span>
                            <span className="text-[11px] text-[#8E8799]">{entry.date}</span>
                          </div>
                          <h4 className="text-sm font-semibold text-[#2A2630] line-clamp-1">
                            {entry.title}
                          </h4>
                          <p className="text-xs text-[#686273] line-clamp-2 mt-1">
                            {entry.content}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right: Distraction-Free Writing Canvas OR Entry Reader */}
              <div className="lg:col-span-8">
                {activeJournalEntry ? (
                  <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-5">
                    <div className="flex items-center justify-between border-b border-[#ECE8F2] pb-4">
                      <div>
                        <span className="text-xs text-[#686273]">{activeJournalEntry.date}</span>
                        <h3 className="font-editorial text-3xl text-[#2A2630] mt-1">
                          {activeJournalEntry.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveEntryId(null)}
                          className="px-3.5 py-2 rounded-xl bg-[#F2EEFB] text-[#5B4B8A] text-xs font-semibold hover:bg-[#E6E0F8] transition-colors"
                        >
                          Write New
                        </button>
                        <button
                          onClick={() => handleDeleteJournal(activeJournalEntry.id)}
                          className="p-2 rounded-xl text-[#8E8799] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {activeJournalEntry.prompt && (
                      <div className="p-4 rounded-2xl bg-[#FAF8FD] border border-[#ECE8F2] text-xs text-[#686273] italic">
                        Prompt: “{activeJournalEntry.prompt}”
                      </div>
                    )}

                    <p className="text-base text-[#2A2630] leading-relaxed whitespace-pre-line font-normal">
                      {activeJournalEntry.content}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSaveJournal} className="glass-card rounded-3xl p-6 sm:p-8 space-y-5">
                    {/* Guided Reflection Prompt Box */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F6F2FC] to-[#FDF4F6] border border-[#ECE8F2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#6B5B95]">
                          Guided Reflection Prompt
                        </span>
                        <p className="font-editorial text-xl text-[#2A2630] mt-0.5 leading-snug">
                          “{JOURNAL_PROMPTS[promptIdx]}”
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPromptIdx((prev) => (prev + 1) % JOURNAL_PROMPTS.length)}
                        className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#ECE8F2] text-xs font-medium text-[#686273] hover:text-[#2A2630] shrink-0"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Shuffle</span>
                      </button>
                    </div>

                    {/* Title & Mood Tag */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={journalTitle}
                        onChange={(e) => setJournalTitle(e.target.value)}
                        placeholder="Give this reflection a title..."
                        className="flex-1 px-4 py-3 rounded-2xl bg-[#FAF9FC] border border-[#ECE8F2] font-editorial text-2xl text-[#2A2630] placeholder:text-[#9A94A6] focus:outline-none focus:border-[#8E7CC3]"
                      />
                      <select
                        value={journalMoodId}
                        onChange={(e) => setJournalMoodId(e.target.value)}
                        className="px-4 py-3 rounded-2xl bg-[#FAF9FC] border border-[#ECE8F2] text-sm text-[#2A2630] focus:outline-none focus:border-[#8E7CC3]"
                      >
                        {MOOD_OPTIONS.map((m) => (
                          <option key={m.id} value={m.id}>
                            Mood: {m.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Main Writing Textarea */}
                    <textarea
                      rows={9}
                      value={journalBody}
                      onChange={(e) => setJournalBody(e.target.value)}
                      placeholder="Write freely here. No grammar rules, no audience—just an honest space to untangle your thoughts..."
                      className="w-full p-5 rounded-2xl bg-[#FAF9FC] border border-[#ECE8F2] text-sm sm:text-base text-[#2A2630] leading-relaxed placeholder:text-[#9A94A6] focus:outline-none focus:border-[#8E7CC3] resize-none"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-[#8E8799]">
                        {journalBody.trim().split(/\s+/).filter(Boolean).length} words
                      </span>
                      <button
                        type="submit"
                        disabled={!journalBody.trim()}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#6B5B95] hover:bg-[#594A80] disabled:opacity-40 text-white text-sm font-medium transition-colors shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save Reflection</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 5: PROFILE & SANCTUARY SETTINGS ================= */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Header Banner */}
              <div className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="flex items-center gap-4 sm:gap-5">
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br ${activeAura.gradient} flex items-center justify-center text-white font-editorial text-4xl shadow-md shrink-0`}
                    >
                      {userProfile.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F2EEFB] text-[#6B5B95] text-[11px] font-semibold mb-1.5">
                        <Sparkle className="w-3 h-3" />
                        <span>{activeAura.name} Aura</span>
                      </div>
                      <h2 className="font-editorial text-3xl sm:text-4xl text-[#2A2630] leading-none">
                        {userProfile.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#686273] mt-1.5">
                        {userProfile.lifeStage} · Member since {userProfile.createdAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {!isEditingProfile && (
                      <button
                        onClick={startEditingProfile}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#6B5B95] hover:bg-[#594A80] text-white text-xs font-medium transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Profile</span>
                      </button>
                    )}
                    <button
                      onClick={() => setShowResetConfirmModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-rose-50 border border-[#ECE8F2] text-xs font-medium text-[#8E4B5C] transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Switch / Reset Profile</span>
                    </button>
                  </div>
                </div>

                {/* Wellness Stats Row */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-7 pt-6 border-t border-[#ECE8F2]">
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF8FD] border border-[#ECE8F2]">
                    <p className="text-[11px] uppercase tracking-wider text-[#686273]">Mood Check-ins</p>
                    <p className="font-editorial text-2xl sm:text-3xl text-[#2A2630] mt-1">
                      {moodHistory.length}
                    </p>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FDF5F7] border border-[#ECE8F2]">
                    <p className="text-[11px] uppercase tracking-wider text-[#686273]">Journal Entries</p>
                    <p className="font-editorial text-2xl sm:text-3xl text-[#2A2630] mt-1">
                      {journalEntries.length}
                    </p>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F4F7F5] border border-[#ECE8F2]">
                    <p className="text-[11px] uppercase tracking-wider text-[#686273]">Daily Rituals</p>
                    <p className="font-editorial text-2xl sm:text-3xl text-[#2A2630] mt-1">
                      {completedHabitsCount}/{habits.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Edit Profile Form OR Active Intentions View */}
              {isEditingProfile ? (
                <form onSubmit={handleSaveEditedProfile} className="glass-card rounded-3xl p-6 sm:p-8 space-y-5">
                  <div className="flex items-center justify-between border-b border-[#ECE8F2] pb-3">
                    <h3 className="font-editorial text-2xl text-[#2A2630]">Edit Sanctuary Preferences</h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="text-xs text-[#686273] hover:text-[#2A2630]"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#544E5E] mb-1.5">
                        Preferred Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9FC] border border-[#ECE8F2] text-sm text-[#2A2630] focus:outline-none focus:border-[#8E7CC3]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#544E5E] mb-1.5">
                        Life Stage
                      </label>
                      <select
                        value={formLifeStage}
                        onChange={(e) => setFormLifeStage(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9FC] border border-[#ECE8F2] text-sm text-[#2A2630] focus:outline-none focus:border-[#8E7CC3]"
                      >
                        {LIFE_STAGES.map((stage) => (
                          <option key={stage} value={stage}>
                            {stage}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#544E5E] mb-2">
                      Sanctuary Aura Theme
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {AURA_THEMES.map((aura) => (
                        <button
                          type="button"
                          key={aura.id}
                          onClick={() => setFormAuraId(aura.id)}
                          className={`p-2.5 rounded-2xl border flex items-center gap-2.5 text-left ${
                            formAuraId === aura.id
                              ? 'border-[#8E7CC3] bg-[#F3EFFB]'
                              : 'border-[#ECE8F2] bg-white'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${aura.gradient} shrink-0`} />
                          <span className="text-xs font-medium text-[#2A2630] truncate">{aura.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#544E5E] mb-2">
                      Wellness Intentions
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {WELLNESS_INTENTIONS.map((item) => {
                        const active = formIntentions.includes(item);
                        return (
                          <button
                            type="button"
                            key={item}
                            onClick={() => toggleFormIntention(item)}
                            className={`px-3.5 py-2 rounded-xl border text-xs font-medium ${
                              active
                                ? 'bg-[#E6E0F8] border-[#8E7CC3] text-[#4A3B75]'
                                : 'bg-white border-[#ECE8F2] text-[#544E5E]'
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#544E5E] mb-2">
                      AI Companion Tone
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {COMPANION_TONES.map((tone) => (
                        <button
                          type="button"
                          key={tone.id}
                          onClick={() => setFormToneId(tone.id)}
                          className={`p-3 rounded-2xl border text-left ${
                            formToneId === tone.id
                              ? 'bg-[#FDF2F5] border-[#D48A98]'
                              : 'bg-white border-[#ECE8F2]'
                          }`}
                        >
                          <p className="text-xs font-semibold text-[#2A2630]">{tone.label}</p>
                          <p className="text-[11px] text-[#686273] mt-0.5">{tone.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-2xl bg-[#6B5B95] hover:bg-[#594A80] text-white text-xs font-semibold transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card rounded-3xl p-6">
                    <div className="flex items-center gap-2 text-[#6B5B95] text-xs font-semibold uppercase tracking-wider mb-3">
                      <Award className="w-4 h-4" />
                      <span>Active Wellness Intentions</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.intentions?.map((intent, idx) => (
                        <span
                          key={idx}
                          className="px-3.5 py-2 rounded-2xl bg-[#F4F0FC] border border-[#E6E0F8] text-xs font-medium text-[#4A3B75]"
                        >
                          {intent}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card rounded-3xl p-6">
                    <div className="flex items-center gap-2 text-[#9E5A6B] text-xs font-semibold uppercase tracking-wider mb-3">
                      <MessageCircleHeart className="w-4 h-4" />
                      <span>AI Companion Calibration</span>
                    </div>
                    <p className="text-sm font-semibold text-[#2A2630]">{userProfile.toneLabel}</p>
                    <p className="text-xs text-[#686273] mt-1 leading-relaxed">
                      Your companion adapts its reflections to your life stage ({userProfile.lifeStage}) and keeps your conversations private and non-judgmental.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#ECE8F2] px-2 py-2 flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-medium transition-colors ${
                isActive ? 'text-[#6B5B95] bg-[#F3EFFB]' : 'text-[#686273]'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Safety, Ethics & Crisis Helpline Modal */}
      {showSafetyModal && (
        <div className="fixed inset-0 z-50 bg-[#2A2630]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-[#ECE8F2] shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F9E8EC] text-[#9E5A6B] flex items-center justify-center">
                  <Heart className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-editorial text-2xl text-[#2A2630]">
                    You Don't Have to Carry It Alone
                  </h3>
                  <p className="text-xs text-[#686273]">Safety & Support Resources</p>
                </div>
              </div>
              <button
                onClick={() => setShowSafetyModal(false)}
                className="p-1.5 rounded-xl text-[#686273] hover:bg-[#FAF9FC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#544E5E] leading-relaxed">
              Mindspace is designed for everyday reflection, self-care, and emotional clarity. It is not a medical service or emergency substitute. If you are feeling overwhelmed, unsafe, or in crisis, please reach out to free, confidential human support:
            </p>