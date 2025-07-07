import React, { useState, useEffect } from 'react';
import { Room, User } from '../types';

interface DuelPageProps {
  room: Room;
  currentUser: User;
  onSubmitAnswer: (questionId: string, answer: string, timeSpent: number) => void;
  onComplete: () => void;
}

const DuelPage: React.FC<DuelPageProps> = ({ room, currentUser, onSubmitAnswer, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  const currentQuestion = room.questions[currentQuestionIndex];
  const opponent = room.creator.id === currentUser.id ? room.opponent : room.creator;
  const userProgress = (currentQuestionIndex / room.questions.length) * 100;
  const opponentProgress = opponent ? (opponent.currentQuestion / room.questions.length) * 100 : 0;

  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const timeSpent = Date.now() - questionStartTime;
    onSubmitAnswer(currentQuestion.id, selectedAnswer, timeSpent);

    if (currentQuestionIndex + 1 < room.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
    } else {
      onComplete();
    }
  };

  const handleSkipQuestion = () => {
    onSubmitAnswer(currentQuestion.id, 'SKIPPED', Date.now() - questionStartTime);

    if (currentQuestionIndex + 1 < room.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
    } else {
      onComplete();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fce7f3, #fbb6ce, #f687b3)',
    padding: '20px',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    maxWidth: '1200px',
    margin: '0 auto 1.5rem auto',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#7c2d12',
  };

  const timerStyle: React.CSSProperties = {
    backgroundColor: '#7c2d12',
    color: 'white',
    padding: '0.5rem 1.5rem',
    borderRadius: '25px',
    fontSize: '1.25rem',
    fontWeight: '600',
  };

  const playersStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    maxWidth: '1200px',
    margin: '0 auto 1.5rem auto',
  };

  const playerCardStyle = (isCurrentUser: boolean): React.CSSProperties => ({
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '1.5rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  });

  const avatarStyle = (color: string): React.CSSProperties => ({
    width: '48px',
    height: '48px',
    backgroundColor: color,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.125rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  });

  const progressBarStyle: React.CSSProperties = {
    width: '100%',
    height: '12px',
    backgroundColor: '#fce7f3',
    borderRadius: '6px',
    overflow: 'hidden',
    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  };

  const progressFillStyle = (progress: number, color: string): React.CSSProperties => ({
    height: '100%',
    width: `${progress}%`,
    background: `linear-gradient(to right, ${color}, ${color}dd)`,
    transition: 'width 0.3s ease',
    borderRadius: '6px',
  });

  const questionCardStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  };

  const questionHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  };

  const questionBadgeStyle: React.CSSProperties = {
    background: 'linear-gradient(to right, #db2777, #be185d)',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    fontWeight: '600',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  };

  const topicBadgeStyle: React.CSSProperties = {
    color: '#db2777',
    fontWeight: '600',
    backgroundColor: '#fce7f3',
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    textTransform: 'capitalize',
  };

  const questionTextStyle: React.CSSProperties = {
    fontSize: '1.125rem',
    color: '#2d3748',
    marginBottom: '2rem',
    lineHeight: '1.6',
  };

  const optionButtonStyle = (isSelected: boolean): React.CSSProperties => ({
    width: '100%',
    textAlign: 'left',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '2px solid',
    borderColor: isSelected ? '#db2777' : '#f9a8d4',
    backgroundColor: isSelected ? 'linear-gradient(to right, #fce7f3, #fbcfe8)' : 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '0.75rem',
    boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
  });

  const optionLetterStyle: React.CSSProperties = {
    fontWeight: 'bold',
    color: '#db2777',
    marginRight: '1rem',
    fontSize: '1.125rem',
  };

  const actionButtonsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '2rem',
  };

  const skipButtonStyle: React.CSSProperties = {
    padding: '0.75rem 2rem',
    border: '2px solid #db2777',
    color: '#db2777',
    backgroundColor: 'transparent',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const submitButtonStyle = (disabled: boolean): React.CSSProperties => ({
    padding: '0.75rem 2rem',
    background: disabled ? '#d1d5db' : 'linear-gradient(to right, #db2777, #be185d)',
    color: disabled ? '#6b7280' : 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    boxShadow: disabled ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  });

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>MedQuiz Battle</h1>
        <div style={timerStyle}>
          {formatTime(elapsedTime)}
        </div>
      </div>

      <div style={playersStyle}>
        <div style={playerCardStyle(true)}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={avatarStyle('#db2777')}>
              You
            </div>
            <div style={{ marginLeft: '0.75rem' }}>
              <p style={{ fontWeight: '600', color: '#2d3748' }}>{currentUser.username}</p>
              <p style={{ fontSize: '0.875rem', color: '#db2777', fontWeight: '500' }}>Score: {currentUser.score}</p>
            </div>
          </div>
          <div style={progressBarStyle}>
            <div style={progressFillStyle(userProgress, '#db2777')}></div>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#4a5568', fontWeight: '500', marginTop: '0.5rem' }}>
            Question {currentQuestionIndex + 1} of {room.questions.length}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#db2777', marginTop: '0.5rem', fontWeight: '500' }}>
            ✏️ Currently answering
          </p>
        </div>

        <div style={playerCardStyle(false)}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={avatarStyle('#7c3aed')}>
              OP
            </div>
            <div style={{ marginLeft: '0.75rem' }}>
              <p style={{ fontWeight: '600', color: '#2d3748' }}>{opponent?.username || 'Waiting...'}</p>
              <p style={{ fontSize: '0.875rem', color: '#7c3aed', fontWeight: '500' }}>Score: {opponent?.score || 0}</p>
            </div>
          </div>
          <div style={progressBarStyle}>
            <div style={progressFillStyle(opponentProgress, '#7c3aed')}></div>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#4a5568', fontWeight: '500', marginTop: '0.5rem' }}>
            Question {opponent ? opponent.currentQuestion + 1 : 0} of {room.questions.length}
          </p>
          {opponent && opponent.currentQuestion > currentQuestionIndex && (
            <p style={{ fontSize: '0.875rem', color: '#f59e0b', marginTop: '0.5rem', fontWeight: '500' }}>
              🏃‍♂️ Answering question {opponent.currentQuestion + 1}...
            </p>
          )}
        </div>
      </div>

      <div style={questionCardStyle}>
        <div style={questionHeaderStyle}>
          <h2 style={questionBadgeStyle}>
            Question {currentQuestionIndex + 1}
          </h2>
          <span style={topicBadgeStyle}>
            {currentQuestion.topic.replace(/_/g, ' ')}
          </span>
        </div>

        <p style={questionTextStyle}>{currentQuestion.question}</p>

        <div>
          {Object.entries(currentQuestion.options).map(([letter, text]) => (
            <button
              key={letter}
              onClick={() => setSelectedAnswer(letter)}
              style={optionButtonStyle(selectedAnswer === letter)}
            >
              <span style={optionLetterStyle}>{letter}</span>
              <span style={{ color: '#2d3748' }}>{text}</span>
            </button>
          ))}
        </div>

        <div style={actionButtonsStyle}>
          <button
            onClick={handleSkipQuestion}
            style={skipButtonStyle}
          >
            ⏭️ Skip Question
          </button>
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
            style={submitButtonStyle(!selectedAnswer)}
          >
            ✅ Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DuelPage;