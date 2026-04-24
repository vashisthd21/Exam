import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const API = import.meta.env.VITE_API_BASE_URL;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi 👋 I'm your UPSC assistant.\nAsk me anything!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

    const res = await axios.post(
    `${API}/api/chat`,
    { message: input },
    {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    }
    );

      const botMsg = {
        role: "bot",
        text: res.data.reply,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Error fetching response" },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* FLOAT BUTTON */}
      <div style={styles.fabContainer}>
        <button onClick={() => setOpen(!open)} style={styles.fab}>
          💬
        </button>
      </div>

      {/* CHAT WINDOW */}
      <div
        style={{
          ...styles.chatBox,
          transform: open ? "translateY(0)" : "translateY(120%)",
          opacity: open ? 1 : 0,
        }}
      >
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <strong>UPSC Assistant</strong>
            <p style={styles.subText}>AI-powered mentor</p>
          </div>
          <span onClick={() => setOpen(false)} style={styles.close}>
            ✕
          </span>
        </div>

        {/* MESSAGES */}
        <div style={styles.messages}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.messageWrapper,
                justifyContent:
                  msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  ...styles.message,
                  background:
                    msg.role === "user"
                      ? "linear-gradient(135deg,#2563eb,#1d4ed8)"
                      : "#f8fafc",
                  color: msg.role === "user" ? "#fff" : "#0f172a",
                }}
              >
                <ReactMarkdown components={markdownStyles}>
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div style={styles.typing}>Assistant is typing...</div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div style={styles.inputContainer}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask UPSC question..."
            style={styles.input}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} style={styles.sendBtn}>
            ➤
          </button>
        </div>
      </div>
    </>
  );
}

/* ================= MARKDOWN STYLES ================= */

const markdownStyles = {
  h3: ({ children }) => (
    <h3 style={{ fontSize: "15px", fontWeight: "700", marginTop: "8px" }}>
      {children}
    </h3>
  ),
  strong: ({ children }) => (
    <strong style={{ fontWeight: "700" }}>{children}</strong>
  ),
  li: ({ children }) => (
    <li style={{ marginLeft: "16px", marginBottom: "4px" }}>
      {children}
    </li>
  ),
  p: ({ children }) => (
    <p style={{ marginBottom: "6px", lineHeight: "1.5" }}>
      {children}
    </p>
  ),
};

/* ================= STYLES ================= */

const styles = {
  fabContainer: {
    position: "fixed",
    bottom: 20,
    right: 20,
    zIndex: 999,
  },

  fab: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
    color: "#fff",
    fontSize: 22,
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(37,99,235,0.5)",
  },

  chatBox: {
    position: "fixed",
    bottom: 90,
    right: 20,
    width: 360,
    height: 500,
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    backdropFilter: "blur(16px)",
    background: "rgba(255,255,255,0.9)",
    boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
    overflow: "hidden",
    transition: "all 0.3s ease",
    zIndex: 999,
  },

  header: {
    padding: "14px 16px",
    background: "linear-gradient(135deg,#2563eb,#1e40af)",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  subText: {
    fontSize: 11,
    opacity: 0.8,
  },

  close: {
    cursor: "pointer",
    fontSize: 18,
  },

  messages: {
    flex: 1,
    padding: 12,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    scrollBehavior: "smooth",
  },

  messageWrapper: {
    display: "flex",
  },

  message: {
    padding: "10px 14px",
    borderRadius: 14,
    maxWidth: "85%",
    fontSize: 14,
    lineHeight: 1.4,
  },

  typing: {
    fontSize: 12,
    color: "#64748b",
    paddingLeft: 10,
  },

  inputContainer: {
    display: "flex",
    borderTop: "1px solid #e2e8f0",
    background: "#fff",
  },

  input: {
    flex: 1,
    border: "none",
    padding: "12px",
    outline: "none",
    fontSize: 14,
  },

  sendBtn: {
    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
    color: "#fff",
    border: "none",
    padding: "0 16px",
    cursor: "pointer",
  },
};