import React, { useState } from 'react';
import { TOPICS } from '../types';

interface HomePageProps {
  onCreateRoom: (username: string, settings: any) => void;
  onJoinRoom: (username: string, roomCode: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onCreateRoom, onJoinRoom }) => {
  const [mode, setMode] = useState<'none' | 'create' | 'join'>('none');
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<number[]>([]);
  const [questionCount, setQuestionCount] = useState(20);

  const handleCreateRoom = () => {
    if (username && selectedTopics.length > 0 && selectedDifficulties.length > 0) {
      onCreateRoom(username, {
        topics: selectedTopics,
        difficulties: selectedDifficulties,
        questionCount,
      });
    }
  };

  const handleJoinRoom = () => {
    if (username && roomCode) {
      onJoinRoom(username, roomCode);
    }
  };

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const toggleDifficulty = (difficulty: number) => {
    setSelectedDifficulties(prev =>
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    color: '#2d3748',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: '800px',
    width: '100%',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '3rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#be185d',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '1rem',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#2d3748',
    fontSize: '1.25rem',
    border: '2px solid #f9a8d4',
    outline: 'none',
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#db2777',
    color: 'white',
    fontSize: '1.25rem',
    fontWeight: '600',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const backButtonStyle: React.CSSProperties = {
    color: '#db2777',
    fontWeight: '500',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#be185d',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '12px',
  };

  const topicButtonStyle = (selected: boolean): React.CSSProperties => ({
    padding: '1rem',
    borderRadius: '12px',
    textAlign: 'left',
    cursor: 'pointer',
    backgroundColor: selected ? '#db2777' : 'white',
    color: selected ? 'white' : '#2d3748',
    border: '2px solid #f9a8d4',
    transition: 'all 0.2s',
  });

  const difficultyStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
  };

  const difficultyButtonStyle = (selected: boolean): React.CSSProperties => ({
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    backgroundColor: selected ? '#db2777' : 'white',
    color: selected ? 'white' : '#2d3748',
    border: '2px solid #f9a8d4',
    transition: 'all 0.2s',
  });

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>Medical Duel</h1>
        
        {mode === 'none' && (
          <div style={cardStyle}>
            <input
              type="text"
              placeholder="Enter your username"
              style={inputStyle}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              onClick={() => setMode('create')}
              style={buttonStyle}
              disabled={!username}
            >
              Create Room
            </button>
            <button
              onClick={() => setMode('join')}
              style={{...buttonStyle, backgroundColor: '#ec4899'}}
              disabled={!username}
            >
              Join Room
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div style={cardStyle}>
            <button onClick={() => setMode('none')} style={backButtonStyle}>
              ← Back
            </button>
            
            <div>
              <h2 style={sectionTitleStyle}>Select Topics</h2>
              <div style={gridStyle}>
                {TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    style={topicButtonStyle(selectedTopics.includes(topic.id))}
                  >
                    {topic.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 style={sectionTitleStyle}>Select Difficulty</h2>
              <div style={difficultyStyle}>
                {[1, 2, 3, 4, 5].map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => toggleDifficulty(difficulty)}
                    style={difficultyButtonStyle(selectedDifficulties.includes(difficulty))}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 style={sectionTitleStyle}>Number of Questions</h2>
              <input
                type="number"
                min="5"
                max="1000"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                style={inputStyle}
              />
            </div>

            <button
              onClick={handleCreateRoom}
              style={buttonStyle}
              disabled={selectedTopics.length === 0 || selectedDifficulties.length === 0}
            >
              Create Room
            </button>
          </div>
        )}

        {mode === 'join' && (
          <div style={cardStyle}>
            <button onClick={() => setMode('none')} style={backButtonStyle}>
              ← Back
            </button>
            
            <input
              type="text"
              placeholder="Enter room code"
              style={{...inputStyle, textTransform: 'uppercase', letterSpacing: '2px'}}
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            />
            
            <button
              onClick={handleJoinRoom}
              style={{...buttonStyle, backgroundColor: '#ec4899'}}
              disabled={!roomCode}
            >
              Join Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;