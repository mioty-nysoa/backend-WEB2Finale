import type {Choice} from './Choice.js';
export interface Question {
  id: string;
  exam_id: string;
  statement: string;
  points: number;
  choices?: Choice[];
}