import React, { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const MedicalAssistant = () => {
  const { backendURL, token } = useContext(AppContext);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I am your AI Clinical & Digital Twin Assistant powered by Gemini. You can ask me about your symptoms, understand your physiological biomarkers (BP, HbA1c, Cholesterol), or explore lifestyle interventions to optimize your Digital Twin.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const starterQuestions = [
    "What does a blood pressure of 138/88 mmHg and HbA1c of 6.2% indicate?",
    "How can 30 mins of daily walking lower my cardiovascular twin risk?",
    "What are early warning signs of pre-diabetes?",
  ];

  const sendMessage = async (queryText) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || loading) return;

    const newMessages = [...messages, { role: "user", text: textToSend }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const history = newMessages.slice(0, -1).map((m) => ({
        role: m.role,
        content: m.text,
      }));

      const { data } = await axios.post(
        `${backendURL}/api/rag/chat`,
        { query: textToSend, history },
        { headers: { token } }
      );

      if (data.success && data.answer) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.answer, sources: data.sources },
        ]);
      } else {
        toast.error(data.message || "Failed to generate clinical answer");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not reach AI assistant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto flex flex-col h-[750px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-xl font-bold text-gray-800">
                AI Clinical & Digital Twin Assistant
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Real-time physiological insights, symptom understanding & counterfactual health guidance
            </p>
          </div>
          <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
            Powered by Gemini
          </span>
        </div>

        {/* Quick Starters */}
        <div className="px-6 py-3 bg-gray-50/70 border-b border-gray-100 flex flex-wrap gap-2 text-xs">
          <span className="text-gray-400 font-medium py-1">Try asking:</span>
          {starterQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(q)}
              className="bg-white hover:bg-gray-100 text-gray-700 px-3 py-1 rounded-lg border border-gray-200 transition cursor-pointer text-left"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Message List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-100 text-gray-800 border border-gray-200/50"
                }`}
              >
                {m.text}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200/60 text-[10px] text-gray-500">
                    Verified through: {m.sources.join(", ")}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-500 rounded-2xl p-4 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                Analyzing clinical guidelines and generating response...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about symptoms, biomarkers, or your digital twin..."
              disabled={loading}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-primary text-white px-6 py-3 rounded-xl font-medium text-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition cursor-pointer"
            >
              Send
            </button>
          </form>
          <p className="text-[10px] text-gray-400 text-center mt-2">
            AI simulation assistant provides informational guidance. Consult platform doctors for formal clinical diagnosis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicalAssistant;
