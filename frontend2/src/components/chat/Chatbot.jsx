import { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    const userMsg = { role: 'user', content: input };
    setMessages([...messages, userMsg]);
    setInput('');

    const res = await axios.post('/api/v1/chatbot/ask', {
      message: input,
    });

    const botMsg = { role: 'bot', content: res.data.reply };
    setMessages((prev) => [...prev, botMsg]);
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Resume Assistant Bot</h2>
      <div className="border p-4 h-[400px] overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <p key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className="inline-block px-3 py-2 bg-gray-100 rounded">
              {msg.content}
            </span>
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border flex-1 p-2"
          placeholder="Ask something..."
        />
        <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
