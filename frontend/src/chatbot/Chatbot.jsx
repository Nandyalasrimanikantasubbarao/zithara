import React, { useState, useRef } from "react";
import "./chatbot.css";

const chatbotUrl = import.meta.env.VITE_REACT_APP_CHATBOT_URL;

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);

  const sendMessage = async (messageText) => {
    const userMessage = messageText || input;
    if (!userMessage.trim()) return;

    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);

    try {
      const response = await fetch(`${chatbotUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.reply, sender: "bot" }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { text: `Failed to get response: ${error.message}`, sender: "bot" },
      ]);
    }

    setInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const patternSuggestions = [
    "help",
    "how are you",
    "Bye",
    "Return Policy",
    "Find jewelry by image",
  ];

  const handlePatternClick = (pattern) => {
    if (pattern === "Find jewelry by image") {
      fileInputRef.current.click();
    } else {
      sendMessage(pattern);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setMessages((prev) => [
      ...prev,
      { text: "🖼️ Image uploaded. Searching...", sender: "user" },
    ]);

    try {
      const response = await fetch(`${chatbotUrl}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { text: data.reply, sender: "bot", route: data.route },
      ]);
      // if (data.route) {
      //   window.location.href = data.route;
      // }
    } catch (error) {
      console.error("Upload error:", error);
      setMessages((prev) => [
        ...prev,
        { text: `Image upload failed: ${error.message}`, sender: "bot" },
      ]);
    }
  };

  return (
    <div className="chatbot-wrapper">
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Close Chat" : "Chat with Us"}
      </button>

      {isOpen && (
        <div className="chatbot-container">
          <div className="pattern-buttons">
            {patternSuggestions.map((pattern, idx) => (
              <button
                key={idx}
                onClick={() => handlePatternClick(pattern)}
                className="pattern-button"
              >
                {pattern}
              </button>
            ))}
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.sender === "user" ? "user-message" : "bot-message"
                }`}
              >
                <div>{msg.text}</div>
                {msg.route && (
                  <div>
                    <a
                      href={msg.route}
                      rel="noopener noreferrer"
                      style={{ color: "#007bff", textDecoration: "underline" }}
                    >
                      View Product
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
