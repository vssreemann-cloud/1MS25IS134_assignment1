/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Bookmark, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { ChatMessage, ResearchReport } from '../types/research';

interface AskThePaperChatProps {
  sessionId: string;
  report: ResearchReport;
}

const DEFAULT_SUGGESTIONS = [
  'What was the exact sample size and demographic breakdown?',
  'What statistically significant differences (p-values) were found?',
  'Did the authors claim causality or only correlation?',
  'What primary limitations did the authors explicitly acknowledge?',
  'Were there any null or non-significant results reported?',
];

export const AskThePaperChat: React.FC<AskThePaperChatProps> = ({ sessionId, report }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your grounded research assistant for "${report.title}". You can ask any question about the methodology, statistics, sample size, or conclusions. All answers are grounded strictly in this document, with page references cited where verifiable.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    setErrorMsg(null);
    setInputQuery('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build conversation history excluding initial welcome message
      const conversationHistory = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: textToSend,
          conversationHistory,
        }),
      });

      const contentType = (response.headers.get('content-type') || '').toLowerCase();
      if (!response.ok) {
        if (contentType.includes('application/json')) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to get response (${response.status})`);
        }
        const text = await response.text();
        throw new Error(`Server returned error (${response.status}): ${text.slice(0, 100)}`);
      }

      if (!contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON from server, got ${contentType || 'non-JSON'}: ${text.slice(0, 100)}`);
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        pageReferences: data.pageReferences || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMsg(err.message || 'An error occurred while answering your question.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[650px] overflow-hidden printable-card">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-sans-ui flex items-center space-x-1.5">
              <span>Ask-The-Paper Assistant</span>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
                Document-Grounded
              </span>
            </h3>
            <p className="text-xs text-slate-500 truncate max-w-sm">
              Answers derived exclusively from: &ldquo;{report.title}&rdquo;
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'welcome-reset',
                role: 'assistant',
                content: `Chat session reset. You are exploring "${report.title}". What would you like to verify from the text?`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
            setErrorMsg(null);
          }}
          className="text-xs text-slate-400 hover:text-slate-600 flex items-center space-x-1 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          title="Reset chat history"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Suggested Questions Carousel */}
      <div className="px-4 py-2 bg-indigo-50/50 border-b border-indigo-100/60 overflow-x-auto flex items-center space-x-2 no-scrollbar">
        <span className="text-[11px] font-semibold text-indigo-700 whitespace-nowrap flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span>Suggested:</span>
        </span>
        {DEFAULT_SUGGESTIONS.map((sugg, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(sugg)}
            disabled={isLoading}
            className="text-xs bg-white text-indigo-900 border border-indigo-200/80 rounded-full px-3 py-1 hover:bg-indigo-100 hover:border-indigo-300 transition-all shrink-0 whitespace-nowrap shadow-2xs disabled:opacity-50"
          >
            {sugg}
          </button>
        ))}
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  isUser ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-indigo-600" />}
              </div>

              <div className={`max-w-[80%] space-y-1.5 ${isUser ? 'text-right' : ''}`}>
                <div
                  className={`inline-block p-4 rounded-2xl text-sm leading-relaxed text-left whitespace-pre-wrap ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-xs'
                      : 'bg-slate-50 border border-slate-200/90 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  {msg.content}

                  {/* Cited page badges */}
                  {msg.pageReferences && msg.pageReferences.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-200 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Document Citations:
                      </span>
                      {msg.pageReferences.map((page) => (
                        <span
                          key={page}
                          className="inline-flex items-center space-x-1 text-xs font-mono font-bold bg-white text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded shadow-2xs"
                        >
                          <Bookmark className="w-3 h-3 text-indigo-500" />
                          <span>Page {page}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 font-mono px-1">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-indigo-600 animate-pulse" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-sm flex items-center space-x-2">
              <div className="flex space-x-1">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs">Checking paper text &amp; page references...</span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-slate-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ask a question about this paper (e.g. sample size, p-values, conclusions)..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputQuery.trim()}
            className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-colors shadow-2xs"
            aria-label="Send question"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="text-[11px] text-slate-400 mt-1.5 px-1 flex items-center justify-between">
          <span>Grounding mode: Paper only. No hallucinations permitted.</span>
          <span>Press Enter to send</span>
        </div>
      </div>
    </div>
  );
};
