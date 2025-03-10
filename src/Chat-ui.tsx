import { useState } from 'react';

interface IMessage {
  text: string;
  time: number;
  source: 'me' | 'other';
  profileId: string;
}

interface IProfile {
  id: string;
  name: string;
  profileImage: string;
}

const dummyProfile1: IProfile = {
  id: 'test1',
  name: '상대방1',
  profileImage: '',
};
const dummyProfile2: IProfile = {
  id: 'mhkim',
  name: '김민혁',
  profileImage: '',
};
export const ChatUI = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const currentUserId = 'mhkim';
  const [profileList, setProfileList] = useState<IProfile[]>([
    dummyProfile1,
    dummyProfile2,
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = {
      text: input,
      source: 'me' as const,
      profileId: currentUserId,
      time: new Date().getTime(),
    };
    setMessages([...messages, userMessage]);
    setInput('');

    setTimeout(() => {
      const id = 'test1';
      const message: IMessage = {
        text: `${input}`,
        source: 'other',
        profileId: profileList.find((p) => p.id === id)?.id || 'empty-user',
        time: new Date().getTime(),
      };
      setMessages((prev) => [...prev, message]);
    }, 500);
  };

  return (
    <div className="chat-container">
      <div className="chat-title">채팅방 제목</div>
      <div className="chat-area">
        {messages.map((msg, index) => (
          <div key={index} className={`message-row ${msg.source}`}>
            <div className="profileIcon" />

            <div className="message-box">
              <div className="name">
                {profileList?.find((p) => p.id === msg.profileId)?.name}
              </div>
              <div className="message">{msg.text}</div>
            </div>

            <div className="message-time">
              {formatMessageTimeFormat(msg.time)}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-edit-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메세지 창"
        />
        <div className="button-area">
          <button>이모티콘</button>
          <button>파일첨부</button>
          <button className="submit" onClick={handleSend}>
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

const formatMessageTimeFormat = (timestamp: number) => {
  const date = new Date(timestamp);
  const [h, m, s] = [date.getHours(), date.getMinutes(), date.getSeconds()];
  return `${h}:${m}:${s}`;
};
