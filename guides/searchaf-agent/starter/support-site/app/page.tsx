import {requireChatGPTUser} from './chatgpt-auth';
import Workspace from './workspace';
export const dynamic='force-dynamic';
export default async function Home(){await requireChatGPTUser('/');return <Workspace agentUrls={{knowledge:process.env.KNOWLEDGE_AGENT_URL,fieldnotes:process.env.MEETING_AGENT_URL,handoff:process.env.HANDOFF_AGENT_URL,support:process.env.SUPPORT_AGENT_URL}}/>;}
