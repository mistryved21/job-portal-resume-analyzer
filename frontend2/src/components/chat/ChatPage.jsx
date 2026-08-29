import ChatBox from './ChatBox';

const ChatPage = () => {
  // Dummy users for now — replace with actual user context
  const currentUser = {
    _id: 'user1',
    fullname: 'Candidate'
  };
  const otherUser = {
    _id: 'recruiter1',
    fullname: 'Recruiter'
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Chat with {otherUser.fullname}</h2>
      <ChatBox currentUser={currentUser} otherUser={otherUser} />
    </div>
  );
};

export default ChatPage;
