import React, { useRef, useEffect, useState } from "react";
import {auth,db} from "../firebase"
import { onAuthStateChanged } from "firebase/auth";
import {doc,getDoc} from "firebase/firestore"
const initialHistory = [
  { id: 1, title: "Project Requirements Analysis", date: "Today" },
  { id: 2, title: "Firebase Authentication Setup", date: "Today" },
  { id: 3, title: "React Component Structure", date: "Yesterday" },
  { id: 4, title: "Database Schema Design", date: "Yesterday" },
  { id: 5, title: "API Integration Guide", date: "This Week" },
  { id: 6, title: "UI/UX Feedback Review", date: "This Week" },
  { id: 7, title: "Performance Optimization", date: "Last Week" },
  { id: 8, title: "Deployment Checklist", date: "Last Week" },
];

const groupByDate = (history) => {
  return history.reduce((groups, item) => {
    const group = groups[item.date] || [];
    group.push(item);
    groups[item.date] = group;
    return groups;
  }, {});
};



function ChatInterface() {
const [user, setUser] = useState(null);
const [userName, setUserName] = useState("");

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      setUser(currentUser);

      // fetch name from Firestore
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserName(docSnap.data().name);
      }
    }
  });
  return () => unsubscribe();
}, []);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "Hello! I'm your Enterprise Knowledge Copilot. You can upload PDFs, raise issues, or start a conversation. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [activeChat, setActiveChat] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showPromptBox, setShowPromptBox] = useState(false);
  const [issueText, setIssueText] = useState("");
  const [promptText, setPromptText] = useState("");
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), role: "user", text: input };
    const botMsg = {
      id: Date.now() + 1,
      role: "assistant",
      text: `You said: "${input}". This is a placeholder response from the Enterprise Knowledge Copilot.`,
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedFile(file.name);
    const msg = {
      id: Date.now(),
      role: "user",
      text: `📄 Uploaded PDF: ${file.name}`,
    };
    setMessages((prev) => [...prev, msg]);
  };

  const handleIssueSubmit = () => {
    if (!issueText.trim()) return;
    const msg = {
      id: Date.now(),
      role: "user",
      text: `🚩 Issue raised: ${issueText}`,
    };
    setMessages((prev) => [...prev, msg]);
    setIssueText("");
    setShowIssueModal(false);
  };

  const handlePromptSubmit = () => {
    if (!promptText.trim()) return;
    setInput(promptText);
    setPromptText("");
    setShowPromptBox(false);
  };

  const grouped = groupByDate(initialHistory);

  return (
    <div className="chat-wrapper">
      {/* ── Sidebar ── */}
      <button
        className={`sidebar-toggle-btn ${sidebarOpen ? "shifted" : ""}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? (
          // X icon when open
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          // Hamburger icon when closed
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">EKC</div>
          {sidebarOpen && (
            <span className="sidebar-title">Knowledge Copilot</span>
          )}
        </div>

        {sidebarOpen && (
          <>
            <button className="new-chat-btn" onClick={() => setMessages([])}>
              + New Chat
            </button>

            <div className="history-list">
              {Object.entries(grouped).map(([date, items]) => (
                <div key={date} className="history-group">
                  <p className="history-date-label">{date}</p>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`history-item ${activeChat === item.id ? "active" : ""}`}
                      onClick={() => setActiveChat(item.id)}
                    >
                      <span className="history-icon">💬</span>
                      <span className="history-text">{item.title}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="sidebar-footer">
              <div className="user-avatar">
                {userName ? userName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                </div>
              <div className="user-info">
                <p className="user-name">{userName || "User"}</p>
                <p className="user-email">{user?.email || ""}</p>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* ── Main ── */}
      <main className="chat-main">
        {/* Top bar */}
        <div className="chat-topbar">
          <h2 className="chat-title">Enterprise Knowledge Copilot</h2>
          <div className="topbar-actions">
            <button className="topbar-btn">Share</button>
            <button className="topbar-btn">Export</button>
          </div>
        </div>

        {/* Messages */}
        <div className="messages-area">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-row ${msg.role}`}>
              {msg.role === "assistant" && (
                <div className="avatar assistant-avatar">EKC</div>
              )}
              <div className={`message-bubble ${msg.role}`}>
                <p>{msg.text}</p>
              </div>
              {msg.role === "user" && (
                <div className="avatar user-avatar-chat">U</div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Feature Boxes ── */}
        <div className="feature-boxes">
          {/* PDF Upload */}
          <div
            className="feature-box"
            onClick={() => fileInputRef.current.click()}
          >
            <div className="feature-icon pdf-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </div>
            <div className="feature-text">
              <p className="feature-title">Add PDF</p>
              <p className="feature-sub">Upload & analyze documents</p>
            </div>
            <input
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </div>

          {/* Raise Issue */}
          <div className="feature-box" onClick={() => setShowIssueModal(true)}>
            <div className="feature-icon issue-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="feature-text">
              <p className="feature-title">Raise an Issue</p>
              <p className="feature-sub">Report a problem or bug</p>
            </div>
          </div>

          {/* Quick Prompt */}
          <div className="feature-box" onClick={() => setShowPromptBox(true)}>
            <div className="feature-icon prompt-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div className="feature-text">
              <p className="feature-title">Quick Prompt</p>
              <p className="feature-sub">Use a template to get started</p>
            </div>
          </div>
        </div>

        {/* Uploaded file tag */}
        {uploadedFile && (
          <div className="uploaded-tag">
            📄 {uploadedFile}
            <span onClick={() => setUploadedFile(null)}>✕</span>
          </div>
        )}

        {/* Input area */}
        <div className="input-area">
          <textarea
            className="chat-input"
            placeholder="Message Enterprise Knowledge Copilot..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className={`send-btn ${input.trim() ? "active" : ""}`}
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="input-hint">
          Press Enter to send · Shift+Enter for new line
        </p>
      </main>

      {/* ── Issue Modal ── */}
      {showIssueModal && (
        <div className="modal-overlay" onClick={() => setShowIssueModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Raise an Issue</h3>
              <button
                className="modal-close"
                onClick={() => setShowIssueModal(false)}
              >
                ✕
              </button>
            </div>
            <p className="modal-sub">
              Describe the problem you're experiencing
            </p>
            <textarea
              className="modal-textarea"
              placeholder="Describe the issue in detail..."
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
              rows={5}
            />
            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => setShowIssueModal(false)}
              >
                Cancel
              </button>
              <button className="modal-submit" onClick={handleIssueSubmit}>
                Submit Issue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Quick Prompt Modal ── */}
      {showPromptBox && (
        <div className="modal-overlay" onClick={() => setShowPromptBox(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Quick Prompt</h3>
              <button
                className="modal-close"
                onClick={() => setShowPromptBox(false)}
              >
                ✕
              </button>
            </div>
            <p className="modal-sub">
              Write a template prompt to get started quickly
            </p>
            <textarea
              className="modal-textarea"
              placeholder="Enter your prompt template..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={5}
            />
            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => setShowPromptBox(false)}
              >
                Cancel
              </button>
              <button className="modal-submit" onClick={handlePromptSubmit}>
                Use Prompt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatInterface;
