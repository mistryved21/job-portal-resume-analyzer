import { useState, useEffect } from 'react';
import axios from 'axios';
import ChatBox from '../chat/ChatBox';

const AdminChatPage = () => {
  const currentUser = { _id: 'recruiter1', name: 'Admin Recruiter' }; // Replace with logged-in recruiter

  const [selectedUser, setSelectedUser] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);

  useEffect(() => {
    // Fetch users recruiter has chatted with (dummy for now)
    setChatUsers([
      { _id: 'user1', name: 'John Doe' },
      { _id: 'user2', name: 'Jane Smith' }
    ]);
  }, []);

  return (
    <div className="flex">
      <div className="w-1/3 border-r">
        <h3 className="font-bold p-2">Users</h3>
        <ul>
          {chatUsers.map(user => (
            <li
              key={user._id}
              className="cursor-pointer p-2 hover:bg-gray-100"
              onClick={() => setSelectedUser(user)}
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-2/3 p-4">
        {selectedUser ? (
          <ChatBox currentUser={currentUser} otherUser={selectedUser} />
        ) : (
          <p>Select a user to chat with</p>
        )}
      </div>
    </div>
  );
};

export default AdminChatPage;
