import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageSquare, Send, CheckCircle2, ChevronRight, Loader2, ArrowRight } from 'lucide-react';
import { Product, ChatMessage } from '../types';
import { products } from '../catalog';
import { triggerToast } from '../utils';

interface AIFeaturesProps {
  cart: any[];
  wishlist: string[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
}

export default function AIFeatures({
  cart,
  wishlist,
  onSelectProduct,
  onAddToCart
}: AIFeaturesProps) {
  const [styTab, setStyTab] = useState<'bot' | 'recommend'>('bot');
  
  // AI recommendations state
  const [weatherPref, setWeatherPref] = useState('An elegant evening event under the stars');
  const [recReason, setRecReason] = useState('Based on seasonal night aesthetics, we pairing our signature liquid gold gown with heavy gold link collars to establish a prestigious visual line.');
  const [recProducts, setRecProducts] = useState<Product[]>([products[5], products[6]]);
  const [isRecLoading, setIsRecLoading] = useState(false);

  // Chat message state
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "wel-1",
      sender: "assistant",
      text: "Salutations! I am your private elite stylist at DRIPLY. Tell me of your upcoming affairs, fashion preferences, or coordinate look priorities, and I shall craft custom high-fashion directives. How can I dress you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isBotLoading, setIsBotLoading] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isBotLoading]);

  // Request suggestions from server
  const fetchAIRecommendations = async () => {
    setIsRecLoading(true);
    try {
      const response = await fetch('/api/gemini/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cart,
          wishlistIds: wishlist,
          weatherPreference: weatherPref
        })
      });
      const data = await response.json();
      if (data.success) {
        setRecReason(data.reasoning);
        setRecProducts(data.suggestions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRecLoading(false);
    }
  };

  // Submit message to server Chatbot
  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || chatInput;
    if (!promptToSend.trim()) return;

    setChatInput('');
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setIsBotLoading(true);

    try {
      const response = await fetch('/api/gemini/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatHistory, userMsg].map(m => ({ sender: m.sender, text: m.text })),
          userProfile: { wishlist }
        })
      });

      const data = await response.json();
      if (data.success) {
        const botMsg: ChatMessage = {
          id: `bot_${Date.now()}`,
          sender: 'assistant',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendedProducts: data.recommendedProducts || []
        };
        setChatHistory(prev => [...prev, botMsg]);
      }
    } catch (e) {
      console.error(e);
      const errMsg: ChatMessage = {
        id: `bot_err_${Date.now()}`,
        sender: 'assistant',
        text: "I do apologize, my backend connection was momentarily interrupted. I highly advise coordinating our signature *AURA Velvet Bomber* with streetwear coordinates in the interim.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, errMsg]);
    } finally {
      setIsBotLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
      
      {/* Top Selector Headings */}
      <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-900">
        <div>
          <p className="text-[10px] tracking-[0.3em] font-mono text-gold-500 font-bold uppercase">ARTIFICIAL COUTURE DIRECTIVES</p>
          <h2 className="text-3xl md:text-5xl font-serif font-extrabold tracking-widest text-white mt-1 uppercase">DRIPLY STYLING LABS</h2>
        </div>

        {/* Tab Controls */}
        <div className="flex border border-zinc-850 p-1 bg-zinc-950">
          <button
            id="tab-bot"
            onClick={() => setStyTab('bot')}
            className={`px-5 py-2 text-[10px] tracking-widest font-mono font-bold uppercase transition-all ${
              styTab === 'bot' ? 'bg-gold-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            AI STYLIST BOT
          </button>
          <button
            id="tab-recommend"
            onClick={() => setStyTab('recommend')}
            className={`px-5 py-2 text-[10px] tracking-widest font-mono font-bold uppercase transition-all ${
              styTab === 'recommend' ? 'bg-gold-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            WARDROBE ARCHITECT
          </button>
        </div>
      </div>

      {/* RENDER TAB 1: AI STYLIST BOT */}
      {styTab === 'bot' && (
        <div id="stylist-bot-view" className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Quick Prompts Panel */}
          <div className="space-y-6">
            <div className="border border-zinc-900 bg-zinc-950/20 p-6 space-y-6">
              <h3 className="text-xs tracking-[0.15em] font-bold text-white uppercase border-b border-zinc-900 pb-3">
                PRE-ASSEMBLED INQUIRIES
              </h3>
              <p className="text-xs text-zinc-500 tracking-wider">Select a custom inquiry prompt below to dispatch styling directives immediately:</p>
              
              <div className="space-y-3">
                {[
                  "Draft me a gold coordinate look for a beach party",
                  "Suggest cargo utility combinations with high top boots",
                  "Help me accessorize the LIQUID GOLD evening dress",
                  "What heavy items protect from rain while maintaining a high luxury aesthetic"
                ].map((prompt, prIdx) => (
                  <button
                    id={`quick-prompt-${prIdx}`}
                    key={prIdx}
                    onClick={() => handleSendMessage(prompt)}
                    className="w-full text-left p-3.5 border border-zinc-900 hover:border-gold-500 bg-zinc-950 text-xs tracking-wide text-zinc-300 hover:text-white font-light transition-colors flex justify-between items-center"
                  >
                    <span className="truncate mr-2">{prompt}</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 text-gold-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Core Chat Stream Box */}
          <div className="lg:col-span-2 border border-zinc-900 bg-zinc-950/40 relative h-[650px] flex flex-col justify-between">
            <div className="p-4 bg-zinc-950 border-b border-zinc-900 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-gold-400 animate-ping" />
                <h4 className="text-xs tracking-widest font-bold text-white uppercase font-serif">DRIPLY EXQUISITE CHATTER</h4>
              </div>
              <span className="text-[9px] font-mono text-gold-500">PARIS DIRECTORY</span>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {chatHistory.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <div className={`p-4 text-xs tracking-wider leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-zinc-900 border border-zinc-800 text-white rounded-none' 
                      : 'bg-zinc-950 border border-gold-500/15 text-zinc-100 rounded-none'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Render products returned by bot */}
                  {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-4 w-full">
                      {products.filter(p => msg.recommendedProducts?.includes(p.id)).map((p) => (
                        <div 
                          key={p.id}
                          onClick={() => onSelectProduct(p)}
                          className="bg-black border border-zinc-900 p-2.5 flex space-x-2.5 items-center cursor-pointer hover:border-gold-500/35 transition-colors"
                        >
                          <img src={p.image} alt={p.name} className="w-10 h-10 object-cover shrink-0" />
                          <div className="min-w-0">
                            <h5 className="text-[10px] font-bold text-white uppercase truncate">{p.name}</h5>
                            <span className="text-[10px] text-gold-500 font-mono font-bold">${p.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className="text-[8px] text-zinc-550 mt-1 font-mono">{msg.timestamp}</span>
                </div>
              ))}

              {isBotLoading && (
                <div className="mr-auto flex items-center space-x-2 text-zinc-500 text-xs font-mono tracking-widest">
                  <Loader2 className="w-4 h-4 animate-spin text-gold-500" />
                  <span>STYLIST IS BRAID-MAPPING STYLES...</span>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Chat Input form */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-900 flex space-x-3 items-center">
              <input 
                id="chat-input"
                type="text" 
                placeholder="CONSEQUENCE: REQUEST FOR STYLE INSPIRATIONS..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="w-full bg-zinc-950 border border-zinc-900 text-xs tracking-widest text-white px-4 py-3.5 focus:outline-none focus:border-gold-500 uppercase font-mono"
              />
              <button
                id="send-chat-btn"
                onClick={() => handleSendMessage()}
                disabled={isBotLoading || !chatInput.trim()}
                className="p-3.5 bg-gold-400 hover:bg-white text-black font-semibold transition-colors disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENDER TAB 2: AI WARDROBE ARCHITECT */}
      {styTab === 'recommend' && (
        <div id="wardrobe-architect-view" className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in duration-300">
          
          {/* Style Configuration Options */}
          <div className="space-y-6">
            <div className="border border-zinc-900 bg-zinc-950/20 p-6 md:p-8 space-y-6">
              <div className="flex items-center space-x-3 text-gold-500 border-b border-zinc-900 pb-4">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-sm font-serif font-bold tracking-widest text-white uppercase">WARDROBE STYLIST INPUT</h3>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] tracking-widest text-zinc-400 font-mono font-bold uppercase">OUTDOOR AMBIENCE / AFFAIR EVENT</label>
                <textarea 
                  id="weather-pref-input"
                  rows={4}
                  placeholder="E.G., AN EXPENSIVE RED CARPET NIGHT IN NEW YORK, DAMP WINTER SIGHT-SEEING..."
                  value={weatherPref}
                  onChange={(e) => setWeatherPref(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 text-xs tracking-widest text-white p-4 focus:outline-none focus:border-gold-500 uppercase font-mono"
                />
              </div>

              <button
                id="generate-rec-btn"
                onClick={fetchAIRecommendations}
                disabled={isRecLoading}
                className="w-full py-4 bg-gold-500 hover:bg-white text-black font-semibold text-xs tracking-[0.25em] font-mono transition-all flex items-center justify-center space-x-2"
              >
                {isRecLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>CALCULATING COUTURE MATCHES...</span>
                  </>
                ) : (
                  <>
                    <span>FORMULATE COMBINATION DIRECTIVE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Calculated suggestions layout Output */}
          <div className="space-y-6">
            <div className="border border-zinc-900 bg-zinc-950/20 p-6 md:p-8 space-y-6">
              <h3 className="text-xs tracking-[0.15em] font-bold text-white uppercase border-b border-zinc-900 pb-3">
                STYLIST CALCULATION REPORT
              </h3>

              {isRecLoading ? (
                <div id="rec-loading-indicator" className="text-center py-20 divide-y divide-zinc-900/50">
                  <Loader2 className="w-8 h-8 text-gold-500 animate-spin mx-auto mb-4" />
                  <p className="text-xs font-mono tracking-widest text-zinc-500">MAPPING SYNERGISTIC GARMENTS IN GOLD TIERS...</p>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                  
                  {/* Style rationale */}
                  <div>
                    <h4 className="text-[10px] tracking-widest text-zinc-500 font-mono uppercase">COUTURE ALIGNMENT DIRECTIVE RATIONALE</h4>
                    <p className="text-xs text-zinc-300 tracking-wider leading-relaxed mt-2.5">
                      "{recReason}"
                    </p>
                  </div>

                  {/* Calculated synergistic products */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] tracking-widest text-zinc-500 font-mono uppercase">CALCULATED COORDINATES</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recProducts.map((p) => (
                        <div 
                          key={p.id}
                          onClick={() => onSelectProduct(p)}
                          className="bg-zinc-950 border border-zinc-900 p-3.5 cursor-pointer flex flex-col justify-between hover:border-gold-500/25 transition-all"
                        >
                          <div className="flex space-x-3">
                            <img src={p.image} alt={p.name} className="w-12 h-12 object-cover border border-zinc-900 shrink-0" />
                            <div className="min-w-0">
                              <h5 className="text-[11px] font-bold text-white uppercase truncate">{p.name}</h5>
                              <p className="text-[9px] text-zinc-500 font-mono uppercase mt-0.5">{p.brand}</p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-4">
                            <span className="text-[11px] font-mono font-semibold text-white">${p.price}</span>
                            <button
                              id={`add-rec-to-cart-${p.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(p, p.sizes[0] || "M", p.colors[0] || "Black");
                                triggerToast(`${p.name} successfully packed in your designer bag!`, "success");
                              }}
                              className="px-2 py-1 border border-zinc-850 hover:border-gold-500 text-[8px] tracking-widest font-mono text-zinc-400 hover:text-white transition-colors"
                            >
                              BUY OUTLET
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
