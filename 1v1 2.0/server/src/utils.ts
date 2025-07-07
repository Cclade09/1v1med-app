import { Question } from './types';
import * as fs from 'fs';
import * as path from 'path';

export function generateRoomCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

export function calculateScore(timeSpent: number): number {
  const baseScore = 100;
  const accuracyWeight = 0.85;
  const timeWeight = 0.15;
  
  const timeInSeconds = timeSpent / 1000;
  const timePenalty = Math.min(timeInSeconds * 2, 50);
  const timeScore = Math.max(0, 100 - timePenalty);
  
  return Math.round(baseScore * accuracyWeight + timeScore * timeWeight);
}

export function loadQuestions(): Question[] {
  try {
    const questionsPath = path.join(__dirname, '../../questions/questions.json');
    if (fs.existsSync(questionsPath)) {
      const data = fs.readFileSync(questionsPath, 'utf-8');
      const parsed = JSON.parse(data);
      
      const questions: Question[] = [];
      for (const topic of Object.values(parsed.topics)) {
        if (Array.isArray((topic as any).questions)) {
          questions.push(...(topic as any).questions);
        }
      }
      return questions;
    }
    
    const templatePath = path.join(__dirname, '../../questions/question-format-template.json');
    const data = fs.readFileSync(templatePath, 'utf-8');
    const parsed = JSON.parse(data);
    
    const questions: Question[] = [];
    for (const topic of Object.values(parsed.topics)) {
      if (Array.isArray((topic as any).questions)) {
        questions.push(...(topic as any).questions);
      }
    }
    return questions;
  } catch (error) {
    console.error('Error loading questions:', error);
    return [];
  }
}