import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  FileText, 
  HelpCircle, 
  Trash2, 
  Compass, 
  ShieldCheck, 
  CornerDownLeft,
  User
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PrototypeNotice } from '../../components/common/PrototypeNotice';

export const UserMineAssist: React.FC = () => {
  const { chatMessages, sendChatMessage, clearChat, currentLang, t } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleWorkerPrompts = [
    "Show today's assignment.",
    "Which mine am I assigned to?",
    "Show recent safety information.",
    "What are the blasting clearance protocols?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText);
    setInputText('');
  };

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-12rem)] min-h-[550px]">
      {/* Header Banner */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg p-4 shadow-xs flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-[#102A43] text-white flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-[#102A43]">
                {t.navMineAssist} • Field Operations AI
              </h1>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#FAF9F6] border border-[#E2DCD0] text-[#64748B]">
                Worker Clearance
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              Grounded AI assistant for shift assignments, pit safety standards, and technical documents
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-2 rounded-md text-[#64748B] hover:bg-[#FAF9F6] hover:text-[#102A43] border border-transparent hover:border-[#E2DCD0] text-xs flex items-center gap-1.5"
          title="Reset conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      <PrototypeNotice 
        message="Grounded RAG Prototype: Responses are synthesized from verified local mock datasets and DGMS technical rules."
      />

      {/* Main Conversation Window */}
      <div className="flex-1 bg-white border border-[#E2DCD0] rounded-lg p-4 sm:p-5 overflow-y-auto space-y-4 shadow-xs">
        {chatMessages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 text-xs ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-[#102A43] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-xl rounded-lg p-3.5 space-y-2 ${
                msg.role === 'user'
                  ? 'bg-[#102A43] text-white shadow-xs'
                  : 'bg-[#FAF9F6] border border-[#E2DCD0] text-[#1E293B]'
              }`}
            >
              <div className="leading-relaxed whitespace-pre-line">
                {msg.text}
              </div>

              {/* Citations block if available */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-2 border-t border-[#EAE5DC] text-[11px] text-[#64748B] space-y-1">
                  <span className="font-semibold text-[#102A43] block">Grounded Sources:</span>
                  {msg.citations.map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-white/70 p-1 rounded border border-[#E2DCD0]">
                      <FileText className="w-3 h-3 text-[#102A43]" />
                      <span className="font-medium text-[#102A43]">{c.title}</span>
                      <span className="text-[#94A3B8]">({c.ref})</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-[10px] text-right opacity-60">
                {msg.timestamp}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-[#EAE5DC] text-[#102A43] flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0">
        <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider whitespace-nowrap pl-1">
          Suggestions:
        </span>
        {sampleWorkerPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => sendChatMessage(prompt)}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-[#FAF9F6] border border-[#E2DCD0] text-[11px] text-[#102A43] whitespace-nowrap transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-[#B45309]" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="bg-white border border-[#E2DCD0] rounded-lg p-2 flex items-center gap-2 shadow-xs shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Ask Mine Assist about today's tasks, blast safety rules, mine telemetry..."
          className="flex-1 px-3 py-2 text-xs text-[#102A43] focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-4 py-2 rounded-md bg-[#102A43] text-white hover:bg-[#1E3A8A] disabled:opacity-40 transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
