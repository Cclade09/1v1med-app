import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { Room, User, Question, RoomSettings } from './types';
import { generateRoomCode, calculateScore, loadQuestions } from './utils';

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://localhost:3000',
  /https:\/\/.*\.vercel\.app$/,
  /https:\/\/.*\.netlify\.app$/
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

const rooms = new Map<string, Room>();
const userRooms = new Map<string, string>();
const questions = loadQuestions();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('createRoom', ({ user, settings }: { user: User; settings: RoomSettings }) => {
    const roomCode = generateRoomCode();
    const selectedQuestions = selectQuestions(settings);
    
    const room: Room = {
      code: roomCode,
      creator: { ...user, id: socket.id },
      settings,
      questions: selectedQuestions,
      status: 'waiting',
      players: [{ ...user, id: socket.id }],
      completedPlayers: []
    };

    rooms.set(roomCode, room);
    userRooms.set(socket.id, roomCode);
    socket.join(roomCode);
    
    socket.emit('roomCreated', room);
  });

  socket.on('joinRoom', ({ user, roomCode }: { user: User; roomCode: string }) => {
    const room = rooms.get(roomCode);
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (room.status !== 'waiting') {
      socket.emit('error', { message: 'Game already started' });
      return;
    }

    room.opponent = { ...user, id: socket.id };
    room.players.push({ ...user, id: socket.id });
    room.status = 'active';
    
    userRooms.set(socket.id, roomCode);
    socket.join(roomCode);
    
    io.to(roomCode).emit('playerJoined', room);
    setTimeout(() => {
      io.to(roomCode).emit('gameStarted', room);
    }, 2000);
  });

  socket.on('submitAnswer', ({ questionId, answer, timeSpent, userId }) => {
    const roomCode = userRooms.get(socket.id);
    if (!roomCode) return;

    const room = rooms.get(roomCode);
    if (!room) return;

    const question = room.questions.find(q => q.id === questionId);
    if (!question) return;

    const player = room.players.find(p => p.id === userId);
    if (!player) return;

    const isCorrect = answer === question.correct_answer && answer !== 'SKIPPED';
    const score = isCorrect ? calculateScore(timeSpent) : 0;

    player.score += score;
    player.answeredQuestions++;
    player.currentQuestion++;

    socket.to(roomCode).emit('opponentProgress', {
      userId: player.id,
      currentQuestion: player.currentQuestion,
      score: player.score
    });
  });

  socket.on('playerCompleted', (userId: string) => {
    const roomCode = userRooms.get(socket.id);
    if (!roomCode) return;

    const room = rooms.get(roomCode);
    if (!room) return;

    room.completedPlayers.push(userId);

    if (room.completedPlayers.length === room.players.length) {
      room.status = 'completed';
      
      const scores = room.players.map(p => ({ id: p.id, score: p.score }));
      scores.sort((a, b) => b.score - a.score);
      
      if (scores.length > 1 && scores[0].score !== scores[1].score) {
        room.winner = scores[0].id;
      }
      
      io.to(roomCode).emit('gameCompleted', room);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    const roomCode = userRooms.get(socket.id);
    if (!roomCode) return;

    const room = rooms.get(roomCode);
    if (!room) return;

    if (room.status === 'active') {
      const remainingPlayer = room.players.find(p => p.id !== socket.id);
      if (remainingPlayer) {
        room.status = 'completed';
        room.winner = remainingPlayer.id;
        io.to(roomCode).emit('playerDisconnected', remainingPlayer.id);
      }
    }

    userRooms.delete(socket.id);
    
    setTimeout(() => {
      if (room.players.every(p => !io.sockets.sockets.has(p.id))) {
        rooms.delete(roomCode);
      }
    }, 5000);
  });
});

function selectQuestions(settings: RoomSettings): Question[] {
  const filteredQuestions = questions.filter(q => 
    settings.topics.includes(q.topic) && 
    settings.difficulties.includes(q.difficulty)
  );

  const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(settings.questionCount, shuffled.length));
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});