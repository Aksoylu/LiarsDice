import React, { useState } from 'react';
import './chatBox.css';

// todo align component height width action panel

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue !== '') {
      setMessages([...messages, inputValue]);
      setInputValue('');
    }
  };

  return (
    <div className="chatbox">
      <div className="chatbox-messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            {message}
          </div>
        ))}
      </div>
      <div className="chatbox-inputcontainer">
        <input
          type="text"
          className="chatbox-input"
          placeholder="Mesajınızı yazın"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button className='sendButton' onClick={handleSendMessage}>Gönder</button>
      </div>
    </div>
  );
};

export default ChatBox;
