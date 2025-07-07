import React from 'react';
import { Room } from '../types';

interface LobbyPageProps {
  room: Room;
  isCreator: boolean;
}

const LobbyPage: React.FC<LobbyPageProps> = ({ room, isCreator }) => {
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    color: '#2d3748',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
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

  const roomCodeStyle: React.CSSProperties = {
    fontSize: '3rem',
    fontWeight: 'bold',
    letterSpacing: '0.5rem',
    color: '#be185d',
    margin: '1rem 0',
  };

  const sectionStyle: React.CSSProperties = {
    backgroundColor: '#fce7f3',
    borderRadius: '12px',
    padding: '1rem',
    textAlign: 'left',
  };

  const labelStyle: React.CSSProperties = {
    color: '#db2777',
    fontWeight: '600',
    marginBottom: '0.5rem',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    color: '#2d3748',
  };

  const loadingStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const dotStyle: React.CSSProperties = {
    width: '12px',
    height: '12px',
    backgroundColor: '#f472b6',
    borderRadius: '50%',
    animation: 'bounce 1.5s infinite',
  };

  const messageStyle: React.CSSProperties = {
    backgroundColor: 'linear-gradient(to right, #fce7f3, #fbcfe8)',
    borderRadius: '12px',
    padding: '1rem',
    color: '#be185d',
    fontWeight: '600',
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>Waiting for Opponent</h1>
        
        <div style={cardStyle}>
          <div>
            <p style={labelStyle}>Room Code</p>
            <p style={roomCodeStyle}>{room.code}</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={sectionStyle}>
              <p style={labelStyle}>Creator</p>
              <p style={valueStyle}>{room.creator.username}</p>
            </div>
            
            <div style={sectionStyle}>
              <p style={labelStyle}>Game Settings</p>
              <div style={{ fontSize: '0.9rem', color: '#4a5568' }}>
                <p>📚 Topics: {room.settings.topics.length} selected</p>
                <p>⭐ Difficulties: {room.settings.difficulties.join(', ')}</p>
                <p>🎯 Questions: {room.settings.questionCount}</p>
              </div>
            </div>
          </div>
          
          <div style={loadingStyle}>
            <div style={{...dotStyle, animationDelay: '0s'}}></div>
            <div style={{...dotStyle, animationDelay: '0.2s'}}></div>
            <div style={{...dotStyle, animationDelay: '0.4s'}}></div>
          </div>
          
          <div style={messageStyle}>
            <p>
              {isCreator 
                ? "🔗 Share this code with your opponent" 
                : "⏳ Waiting for the host to start the game"}
            </p>
          </div>
        </div>
      </div>
      
      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default LobbyPage;