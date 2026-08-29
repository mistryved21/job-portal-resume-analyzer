// ChatBox.jsx
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8000"); // Replace with your backend URL

function ChatBox({ currentUser, targetUser }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (
        (msg.sender === currentUser && msg.receiver === targetUser) ||
        (msg.sender === targetUser && msg.receiver === currentUser)
      ) {
        setChat((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [currentUser, targetUser]);

  const sendMessage = () => {
    socket.emit("sendMessage", {
      sender: currentUser,
      receiver: targetUser,
      text: message,
    });
    setMessage("");
  };

  return (
    <div className="chatbox">
      <div className="messages">
        {chat.map((msg, i) => (
          <div key={i} className={msg.sender === currentUser ? "sent" : "received"}>
            {msg.text}
          </div>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
