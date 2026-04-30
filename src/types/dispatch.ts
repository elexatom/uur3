/*
Finalni revize - 100%
 */

export interface Intervention {
  id: string;
  type: 'replacement' | 'reinforcement';
  title: string;
  timestamp: string;
  details: string;
}