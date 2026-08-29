import ChatBox from './chat/ChatBox';

const ChatPage = () => {
  // In real use: get from logged-in user and selected recruiter
  const currentUser = { _id: 'user1', name: 'Job Seeker' };
  const otherUser = { _id: 'user2', name: 'Recruiter' };

  return (
    <div>
      <h2>Chat with {otherUser.name}</h2>
      <ChatBox currentUser={currentUser} otherUser={otherUser} />
    </div>
  );
};

export default ChatPage;
