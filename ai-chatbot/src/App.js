import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file
import logo from './assets/logo.png';

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); // For storing all chat messages

  const sendMessage = async () => {
    if (message.trim() === '') return; // Prevent empty messages from being sent
    try {
      const res = await axios.post('http://localhost:3001/chat', { message });
      setMessages([...messages, { type: 'user', text: message }, { type: 'bot', text: res.data.reply }]);
      setMessage(''); // Clear the input after sending
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage(); // Call sendMessage when Enter is pressed
    }
  };

  return (
    <div className="chat-container">
      <div className="navbar">
        <img src={logo} alt="Logo" className="logo" />
        <span className="navbar-title">U'r Virtual Friend</span>
        <span className="navbar-subtitle">Always there for you ;)</span>
      </div>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.type}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          onKeyPress={handleKeyPress} // Attach key press handler
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
