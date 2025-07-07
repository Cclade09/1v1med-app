import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import HomePage from './pages/HomePage';
import LobbyPage from './pages/LobbyPage';
import DuelPage from './pages/DuelPage';
import ResultsPage from './pages/ResultsPage';
import { GameState, Room, User } from './types';

const App: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    room: null,
    currentUser: null,
    isCreator: false,
  });
  const [currentPage, setCurrentPage] = useState<'home' | 'lobby' | 'duel' | 'results'>('home');

  useEffect(() => {
    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';
    console.log('Connecting to server:', serverUrl);
    const newSocket = io(serverUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
    setSocket(newSocket);

    newSocket.on('roomCreated', (room: Room) => {
      setGameState(prev => ({ ...prev, room }));
      setCurrentPage('lobby');
    });

    newSocket.on('playerJoined', (room: Room) => {
      setGameState(prev => ({ ...prev, room }));
      if (room.status === 'active') {
        setCurrentPage('duel');
      }
    });

    newSocket.on('gameStarted', (room: Room) => {
      setGameState(prev => ({ ...prev, room }));
      setCurrentPage('duel');
    });

    newSocket.on('opponentProgress', (data: { userId: string; currentQuestion: number; score: number }) => {
      setGameState(prev => {
        if (!prev.room) return prev;
        const updatedRoom = { ...prev.room };
        if (updatedRoom.creator.id === data.userId) {
          updatedRoom.creator = { ...updatedRoom.creator, currentQuestion: data.currentQuestion, score: data.score };
        } else if (updatedRoom.opponent && updatedRoom.opponent.id === data.userId) {
          updatedRoom.opponent = { ...updatedRoom.opponent, currentQuestion: data.currentQuestion, score: data.score };
        }
        return { ...prev, room: updatedRoom };
      });
    });

    newSocket.on('playerDisconnected', (winnerId: string) => {
      setGameState(prev => {
        if (!prev.room) return prev;
        return {
          ...prev,
          room: {
            ...prev.room,
            status: 'completed',
            winner: winnerId,
          },
        };
      });
      setCurrentPage('results');
    });

    newSocket.on('gameCompleted', (room: Room) => {
      setGameState(prev => ({ ...prev, room }));
      setCurrentPage('results');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const createRoom = (username: string, settings: any) => {
    if (!socket) return;
    
    const user: User = {
      id: socket.id || '',
      username,
      currentQuestion: 0,
      score: 0,
      answeredQuestions: 0,
    };
    
    setGameState(prev => ({ ...prev, currentUser: user, isCreator: true }));
    socket.emit('createRoom', { user, settings });
  };

  const joinRoom = (username: string, roomCode: string) => {
    if (!socket) return;
    
    const user: User = {
      id: socket.id || '',
      username,
      currentQuestion: 0,
      score: 0,
      answeredQuestions: 0,
    };
    
    setGameState(prev => ({ ...prev, currentUser: user, isCreator: false }));
    socket.emit('joinRoom', { user, roomCode });
  };

  const submitAnswer = (questionId: string, answer: string, timeSpent: number) => {
    if (!socket || !gameState.currentUser) return;
    
    socket.emit('submitAnswer', {
      questionId,
      answer,
      timeSpent,
      userId: gameState.currentUser.id,
    });
  };

  const completeGame = () => {
    if (!socket || !gameState.currentUser) return;
    socket.emit('playerCompleted', gameState.currentUser.id);
  };

  const appStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fce7f3, #fbb6ce, #f687b3)',
  };

  return (
    <div style={appStyle}>
      {currentPage === 'home' && (
        <HomePage onCreateRoom={createRoom} onJoinRoom={joinRoom} />
      )}
      {currentPage === 'lobby' && gameState.room && (
        <LobbyPage room={gameState.room} isCreator={gameState.isCreator} />
      )}
      {currentPage === 'duel' && gameState.room && gameState.currentUser && (
        <DuelPage
          room={gameState.room}
          currentUser={gameState.currentUser}
          onSubmitAnswer={submitAnswer}
          onComplete={completeGame}
        />
      )}
      {currentPage === 'results' && gameState.room && gameState.currentUser && (
        <ResultsPage
          room={gameState.room}
          currentUser={gameState.currentUser}
          onBackToHome={() => {
            setCurrentPage('home');
            setGameState({
              room: null,
              currentUser: null,
              isCreator: false,
            });
          }}
        />
      )}
    </div>
  );
};

export default App;