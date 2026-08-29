import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Picker from 'emoji-picker-react';
import { FaMicrophone, FaRegSmile } from 'react-icons/fa';

const socket = io('http://localhost:8000');

const ChatBox = ({ currentUser, otherUser }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const roomId = [currentUser._id, otherUser._id].sort().join('_');

  useEffect(() => {
    socket.emit('join_room', roomId);

    axios.get(`http://localhost:8000/api/v1/messages/${currentUser._id}/${otherUser._id}`)
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));

    socket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socket.off('receive_message');
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      senderId: currentUser._id,
      receiverId: otherUser._id,
      message,
      roomId
    };

    socket.emit('send_message', msgData);
    setMessages(prev => [...prev, { ...msgData, timestamp: new Date() }]);
    setMessage('');
  };

  const handleEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const audioMessage = {
          senderId: currentUser._id,
          receiverId: otherUser._id,
          message: `<audio controls src="${url}"></audio>`,
          roomId
        };
        socket.emit('send_message', audioMessage);
        setMessages(prev => [...prev, { ...audioMessage, timestamp: new Date() }]);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing mic:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Chat with {otherUser.name}</h2>
      
      <div className="space-y-2 h-[300px] overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`p-2 rounded-md max-w-[70%] ${msg.senderId === currentUser._id ? 'bg-blue-200 ml-auto text-right' : 'bg-gray-100'}`}>
            {msg.message.includes('<audio') ? (
              <div dangerouslySetInnerHTML={{ __html: msg.message }} />
            ) : (
              msg.message
            )}
          </div>
        ))}
      </div>

      <div className="relative flex items-center gap-2">
        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-xl">
          <FaRegSmile />
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-12 left-0 z-10">
            <Picker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        <input
          type="text"
          className="border rounded-md px-4 py-2 flex-1"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />

        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-md">Send</button>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`ml-2 text-white px-3 py-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-green-500'}`}
        >
          <FaMicrophone />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
