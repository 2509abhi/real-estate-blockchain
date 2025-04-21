import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5500/api/gemini-chat', { // update with your endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      setMessages((prev) => [...prev, { from: 'bot', text: data.reply || 'No response' }]);
    } catch (error) {
      setMessages((prev) => [...prev, { from: 'bot', text: 'Error contacting AI service.' }]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="gemini-chatbot">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            Gemini Assistant
          </div>
          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.from}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="chat-msg bot">Typing...</div>}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
      <button className="chat-toggle" onClick={toggleChat}>
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
};

export default Chatbot;
