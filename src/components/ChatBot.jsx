import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const SYSTEM_PROMPT = `You are a helpful AI assistant for SecOps, an Algerian cybersecurity company. You can answer ANY question on any topic freely.

Company details when asked:
- Name: SecOps, founded by Djabri
- Email: gabiselt777@gmail.com | Phone: +213 665 869 346
- Location: Algeria, available remotely

Services and pricing:
- Starter Plan: 45,000 DZD — basic security scan, automated report, email support
- Growth Plan: 120,000 DZD — full web application audit, manual expert review, quarterly re-testing, security roadmap (most popular)
- Enterprise Plan: 400,000 DZD — full infrastructure audit, advanced simulation, incident response planning, team training

Process: Scope → Scanning → Testing → Reporting → Follow-up

Rules:
- Reply in the same language the user uses (Arabic, French, English)
- Answer any question on any topic, not just cybersecurity
- Be friendly, clear, and concise`;

const SUGGESTIONS = [
  'What services do you offer?',
  'How much does a pentest cost?',
  'How do I get started?',
  'What is the Growth plan?',
];

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the SecOps AI assistant 🛡️\nAsk me anything about our services, pricing, or any other topic.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendMessage = async (text) => {
    const userMsg = (text || input).trim();
    if (!userMsg || loading) return;

    setInput('');
    setShowSuggestions(false);
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      const history = messages.slice(1).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [...history, { role: 'user', parts: [{ text: userMsg }] }],
            generationConfig: { temperature: 0.9, maxOutputTokens: 1024 },
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error?.message || `Error ${res.status}`);

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!reply) throw new Error(`Blocked: ${data.candidates?.[0]?.finishReason ?? data.promptFeedback?.blockReason ?? 'unknown'}`);

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('ChatBot:', err.message);
      setMessages((prev) => [...prev, { role: 'assistant', content: `⚠️ ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const bg      = isDark ? 'bg-[#0b1120]'   : 'bg-white';
  const border  = isDark ? 'border-white/10' : 'border-slate-200';
  const msgBg   = isDark ? 'bg-white/5'      : 'bg-slate-100';
  const msgText = isDark ? 'text-zinc-200'   : 'text-slate-800';
  const inputBg = isDark
    ? 'bg-white/5 border-white/10 text-zinc-100 placeholder-zinc-500 focus:border-blue-400'
    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500';

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle chat"
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
          open ? 'bg-slate-600 hover:bg-slate-500' : 'bg-blue-500 hover:bg-blue-400 hover:shadow-blue-500/40 hover:shadow-2xl'
        } text-white`}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className={`fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden border ${bg} ${border}`}
          style={{ height: '520px' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm">SecOps Assistant</p>
              <p className="text-xs text-blue-100">Powered by AI · Replies instantly</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-green-200">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  msg.role === 'assistant' ? 'bg-blue-500/20' : isDark ? 'bg-white/10' : 'bg-slate-200'
                }`}>
                  {msg.role === 'assistant'
                    ? <Bot className="w-4 h-4 text-blue-400" />
                    : <User className="w-4 h-4 text-slate-400" />}
                </div>
                <div className={`max-w-[78%] px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white rounded-2xl rounded-tr-sm'
                    : `${msgBg} ${msgText} rounded-2xl rounded-tl-sm`
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>
                <div className={`px-4 py-3 rounded-2xl rounded-tl-sm ${msgBg}`}>
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {showSuggestions && (
            <div className={`px-4 pb-2 flex flex-wrap gap-2 flex-shrink-0 border-t ${border} pt-2`}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    isDark
                      ? 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10'
                      : 'border-blue-300 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className={`p-3 border-t ${border} flex-shrink-0`}>
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Ask me anything..."
                className={`flex-1 px-3 py-2 rounded-xl text-sm outline-none border transition-colors ${inputBg}`}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
