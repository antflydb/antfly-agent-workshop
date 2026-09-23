import type { Source } from './answer';
export type MeetingInput = { topic: string; participants: string; goal: string; duration: number };
export type EvidencePoint = { text: string; source_ids: string[] };
export type Brief = {
  title: string;
  context: EvidencePoint[];
  decisions: { text: string; status: 'documented' | 'proposed' | 'unclear'; source_ids: string[] }[];
  tensions: EvidencePoint[];
  gaps: string[];
  agenda: { topic: string; purpose: string; minutes: number; source_ids: string[] }[];
  questions: string[];
};
export type BriefResult = { brief: Brief; sources: Source[]; createdAt: string; status: 'ready' | 'insufficient_evidence' };
