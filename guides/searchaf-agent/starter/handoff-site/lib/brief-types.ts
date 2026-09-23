import type { Source } from './answer';
export type HandoffInput = {project:string;recipient:string;focus:string};
export type EvidencePoint = {text:string;source_ids:string[]};
export type Dossier = {title:string;background:EvidencePoint[];decisions:{text:string;status:'documented'|'proposed'|'unclear';source_ids:string[]}[];work:{text:string;owner:string;status:'documented'|'needs_confirmation';source_ids:string[]}[];timeline:{date:string;text:string;source_ids:string[]}[];gaps:string[];suggestions:string[];reading: {source_id:string;reason:string}[]};
export type HandoffResult = {dossier:Dossier;sources:Source[];createdAt:string;status:'ready'|'insufficient_evidence'};
