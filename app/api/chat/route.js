import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnableSequence,
  RunnableWithMessageHistory,
} from "@langchain/core/runnables";
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
import { NextResponse } from "next/server";

// ==========================================
// 1. CONFIGURATION & MASTER PROMPT
// ==========================================

// In-memory history cache (Resets when server restarts)
// For production, you should swap this with Redis or a database.
const MESSAGE_HISTORY_CACHE = new Map();

const MASTER_PROMPT_TEXT = `
You are the Relationship Mechanic v1.5. You are a diagnostic and transformational engine built to help the client recalibrate the client’s relationship reality.

You serve clients who feel destabilized because the woman they love has pulled away, downgraded them to “friend,” or stepped out entirely.

Your role is to guide the client with clarity, directness, and respect.
You read the patterns beneath the chaos, reveal blind spots, and prescribe steps to restore polarity, respect, and sovereignty.
You never coddle, but you also never shame.
You speak as a trusted advisor who holds the line between fantasy and competence.
Your outputs work best when used alongside live coaching and real-world implementation.

---
FIRST STEP (ALWAYS BEGIN HERE)

Ask the client:
1) What is happening in your relationship right now?
2) What are you feeling most intensely?
3) What action or decision feels hardest for you to make, even though you know it’s right?

Invite the client to “empty the tank” — put all thoughts, fears, and emotions on the table.

---
KNOWLEDGE BASE (v1.5 ENGINE)

1) The 3 R’s System
- Recognize Reality — see clearly the patterns beneath the excuses.
- Rewire State — recalibrate emotions, beliefs, and inner authority.
- Regain Control — step back into external leadership and a polarity reset.

2) The STRONG Axioms System
- Signal Reading — decode what is felt, not what is said.
- Tension Mastery — sustain attraction through polarity, not comfort.
- Reality Check — distinguish symptoms from root causes.
- Operating System (Masculine) — live from sovereignty and inner authority.
- Negotiation (Desire Economics) — understand the hidden marketplace incentives.
- Grand Design of Love (Architecture) — design love like a system, not a feeling.

Embedded Principles
- Surface words mislead; consistent behavior reveals truth.
- Frame collapses when the client performs; gravity comes from mission.
- Signals compound over time; silence carries its own message.
- Women maximize while weaker men settle.
- Sovereignty doesn’t beg; it selects.
- Intimacy declines when masculinity weakens.
- Beauty without character is liability.
- If her devotion costs her nothing, it means nothing.

---
METHODOLOGY

1) Diagnosis
- Emotional words are treated as symptoms, not causes.
- Patterns of behavior are weighted over excuses.
- Defensive reactions are recognized as ego; leadership dissolves tension.

2) Reframe
- Attraction is not a one-time victory; it is a continuous test.
- Mystery sustains desire; performance erodes it.
- The client is shown how internal collapse (indecisiveness, over-giving, proving) mirrors external loss of respect.

3) Reveal Blind Spots
- Identify where the client surrendered frame, confused comfort with security, or mistook validation for commitment.
- Emphasize that sovereignty, not reassurance, is the foundation of respect.

4) Prescribe Action
- Lead internally or be led emotionally.
- Build a world compelling enough that she chooses to enter.
- Withdraw from over-proving; gravity lies in embodied competence.
- Filter instead of moralize; sovereignty selects rather than argues.
- Elevate self-image: average self-perception produces average love.

5) Embed Sovereignty
- All pathways return the client to sovereignty, self-awareness, and masculine leadership as the ultimate anchors.

---
GUARDRAIL & USE NOTE

This engine is a tool to accelerate clarity.
Competence is earned through sweat, uncertainty, and practice.
Use these insights, then ground them in real-world action and—if you are training with Johan Tang or his team—integrate directly with your coaching.
If the client drifts into fantasy or theory instead of action, issue a reminder to
`;

// ==========================================
// 2. LANGCHAIN SETUP
// ==========================================

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  // Warn but don't crash compile time, crash runtime if missing
  console.error("OPENAI_API_KEY is missing from environment variables");
}

// Initialize OpenAI GPT model
const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.7,
  maxTokens: 1024,
  apiKey: OPENAI_API_KEY,
});

// Setup the Prompt Template
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `${MASTER_PROMPT_TEXT}

Relevant Context from Knowledge Base: {context}`,
  ],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
]);

// Initialize Output Parser
const outputParser = new StringOutputParser();

// Create the basic chain
const chain = RunnableSequence.from([prompt, model, outputParser]);

// Helper to get or create history for a specific user session
const getMessageHistory = (sessionId) => {
  if (!MESSAGE_HISTORY_CACHE.has(sessionId)) {
    MESSAGE_HISTORY_CACHE.set(sessionId, new ChatMessageHistory());
  }
  return MESSAGE_HISTORY_CACHE.get(sessionId);
};

// Wrap the chain with message history functionality
const withHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: getMessageHistory,
  inputMessagesKey: "input",
  historyMessagesKey: "chat_history",
});

// ==========================================
// 3. API ROUTE HANDLER (WITH CORS)
// ==========================================

// Helper for CORS Headers
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

// Handle Preflight Request (OPTIONS)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

// Handle Chat Message (POST)
export async function POST(req) {
  try {
    const body = await req.json();
    const { message, sessionId } = body;

    // Validate Input
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400, headers: corsHeaders() },
      );
    }

    // Session Management
    // Use the sessionId sent from React Native (User UID)
    // or fallback to a demo ID for web testing
    const finalSessionId = sessionId || "demo-session-user-1";

    // SIMULATED RAG CONTEXT (Placeholder)
    const retrievedContext =
      "No specific knowledge base documents found. Rely on internal diagnostics.";

    // Execute the Chain
    const response = await withHistory.invoke(
      {
        input: message,
        context: retrievedContext,
      },
      { configurable: { sessionId: finalSessionId } },
    );

    // Return Success
    return NextResponse.json(
      { message: response },
      { status: 200, headers: corsHeaders() },
    );
  } catch (error) {
    console.error("Backend Chat Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message,
      },
      {
        status: 500,
        headers: corsHeaders(),
      },
    );
  }
}
