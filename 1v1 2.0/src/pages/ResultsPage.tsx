import React from 'react';
import { Room, User } from '../types';

interface ResultsPageProps {
  room: Room;
  currentUser: User;
  onBackToHome: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ room, currentUser, onBackToHome }) => {
  const opponent = room.creator.id === currentUser.id ? room.opponent : room.creator;
  const isWinner = room.winner === currentUser.id;
  const isDraw = !room.winner && room.status === 'completed';

  const getAccuracy = (user: User) => {
    if (user.answeredQuestions === 0) return 0;
    return Math.round((user.score / user.answeredQuestions) * 100);
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
    maxWidth: '1000px',
    width: '100%',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '3rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '2rem',
  };

  const playersGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '2rem',
  };

  const playerCardStyle = (isWinner: boolean): React.CSSProperties => ({
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '1.5rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s',
    border: isWinner ? '4px solid #f472b6' : 'none',
    background: isWinner ? 'linear-gradient(135deg, #fce7f3, #fbcfe8)' : 'rgba(255, 255, 255, 0.9)',
  });

  const avatarStyle = (color: string): React.CSSProperties => ({
    width: '64px',
    height: '64px',
    backgroundColor: color,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  });

  const scoreStyle: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#be185d',
  };

  const statCardStyle: React.CSSProperties = {
    backgroundColor: '#fce7f3',
    borderRadius: '12px',
    padding: '0.75rem',
  };

  const summaryCardStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '1.5rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem',
  };

  const summaryGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  };

  const summaryItemStyle: React.CSSProperties = {
    backgroundColor: '#fce7f3',
    borderRadius: '12px',
    padding: '1rem',
    textAlign: 'center',
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
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>
          {isWinner && <span style={{ color: '#db2777' }}>🏆 Victory!</span>}
          {!isWinner && !isDraw && <span style={{ color: '#ec4899' }}>💔 Defeat</span>}
          {isDraw && <span style={{ color: '#db2777' }}>🤝 Draw</span>}
        </h1>

        <div style={playersGridStyle}>
          <div style={playerCardStyle(isWinner)}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={avatarStyle('#db2777')}>
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <div style={{ marginLeft: '1rem' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2d3748' }}>{currentUser.username}</p>
                <p style={{ color: '#db2777', fontWeight: '500' }}>You</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p style={scoreStyle}>{currentUser.score} points</p>
              <div style={statCardStyle}>
                <p style={{ color: '#be185d' }}>📊 Accuracy: {getAccuracy(currentUser)}%</p>
                <p style={{ color: '#be185d' }}>✅ Questions answered: {currentUser.answeredQuestions}/{room.questions.length}</p>
              </div>
            </div>
          </div>

          <div style={playerCardStyle(opponent && room.winner === opponent.id)}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={avatarStyle('#7c3aed')}>
                {opponent ? opponent.username.charAt(0).toUpperCase() : '?'}
              </div>
              <div style={{ marginLeft: '1rem' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2d3748' }}>{opponent?.username || 'Opponent'}</p>
                <p style={{ color: '#7c3aed', fontWeight: '500' }}>Opponent</p>
              </div>
            </div>
            {opponent ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ ...scoreStyle, color: '#7c3aed' }}>{opponent.score} points</p>
                <div style={{ ...statCardStyle, backgroundColor: '#ede9fe' }}>
                  <p style={{ color: '#7c3aed' }}>📊 Accuracy: {getAccuracy(opponent)}%</p>
                  <p style={{ color: '#7c3aed' }}>✅ Questions answered: {opponent.answeredQuestions}/{room.questions.length}</p>
                </div>
              </div>
            ) : (
              <div style={{ ...statCardStyle, backgroundColor: '#f3f4f6' }}>
                <p style={{ color: '#6b7280' }}>🔌 Opponent disconnected</p>
              </div>
            )}
          </div>
        </div>

        <div style={summaryCardStyle}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#be185d' }}>📋 Game Summary</h2>
          <div style={summaryGridStyle}>
            <div style={summaryItemStyle}>
              <p style={{ color: '#db2777', fontWeight: '500' }}>Total Questions</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#be185d' }}>{room.questions.length}</p>
            </div>
            <div style={summaryItemStyle}>
              <p style={{ color: '#db2777', fontWeight: '500' }}>Topics</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#be185d' }}>{room.settings.topics.length}</p>
            </div>
            <div style={summaryItemStyle}>
              <p style={{ color: '#db2777', fontWeight: '500' }}>Difficulties</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#be185d' }}>{room.settings.difficulties.join(', ')}</p>
            </div>
            <div style={summaryItemStyle}>
              <p style={{ color: '#db2777', fontWeight: '500' }}>Room Code</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#be185d' }}>{room.code}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onBackToHome}
          style={buttonStyle}
        >
          🏠 Back to Home
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;