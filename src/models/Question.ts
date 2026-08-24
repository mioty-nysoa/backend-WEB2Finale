import type {Choice} from './Choice.js';
export interface Question {
  id: number;
  exam_id: number;
  statement: string;
  points: number;
  choices?: Choice[];
}