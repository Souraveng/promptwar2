import { GoogleGenAI } from "@google/genai";
import { SearchServiceClient } from "@google-cloud/discoveryengine";
import { NextResponse } from "next/server";
import { collection, getDocs, query, where, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * @file route.ts
 * @description API endpoint for the Bharat Nirvachan AI Assistant.
 * Integrates Google Gemini 3 Flash with Vertex AI Search grounding and Firestore RAG.
 */

// Initialize the Google Gen AI client correctly for v1.51.0
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

const discoveryClient = new SearchServiceClient();

// --- Configuration Constants ---
const projectId = process.env.GOOGLE_CLOUD_PROJECT || "promptwar-492818";
const location = "global";
const collectionId = "default_collection";
const dataStoreId = process.env.VERTEX_DATA_STORE_ID || "election-data-store";

/**
 * Interface for chat history messages.
 */
interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

/**
 * Interface for the request body.
 */
interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

/**
 * POST Handler for /api/chat
 * Orchestrates the multi-source RAG pipeline.
 */
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { message, history = [] }: ChatRequest = await req.json();

    if (!message) {
      return NextResponse.json({ text: "Message is required." }, { status: 400 });
    }

    // --- Phase 1: Local Knowledge Retrieval (Firestore) ---
    let candidateInfo = "";
    const nameMatch = message.match(/about ([\w\s]+)/i) || message.match(/is ([\w\s]+)/i);
    
    if (nameMatch) {
      const name = nameMatch[1].trim();
      try {
        const candidatesRef = collection(db, 'candidates');
        const q = query(candidatesRef, where('name', '>=', name), where('name', '<=', name + '\uf8ff'));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          candidateInfo = querySnapshot.docs.map(doc => {
            const d = doc.data() as DocumentData;
            return `Candidate: ${d.name}\nParty: ${d.party}\nConstituency: ${d.constituency}\nEducation: ${d.education}\nAssets: ${d.assets}\nPromises: ${d.promises?.join(", ") || "N/A"}`;
          }).join("\n\n---\n\n");
        }
      } catch (e) {
        console.error("Firestore candidate search failed:", e);
      }
    }

    // --- Phase 2: Official Document Retrieval (Vertex AI Search) ---
    let context = "";
    try {
      const servingConfig = discoveryClient.projectLocationCollectionDataStoreServingConfigPath(
        projectId,
        location,
        collectionId,
        dataStoreId,
        "default_serving_config"
      );

      const [results] = await discoveryClient.search({
        servingConfig,
        query: message,
        pageSize: 3,
      });

      if (results && results.length > 0) {
        context = results
          .map((result) => {
            const data = (result.document?.derivedStructData?.fields || result.document?.structData?.fields) as any;
            const content = data?.content?.stringValue || 
                          data?.snippet?.stringValue || 
                          data?.text?.stringValue || "";
            return content;
          })
          .filter(Boolean)
          .join("\n\n");
      }
    } catch (searchError) {
      console.warn("Vertex AI Search Grounding Error:", searchError);
    }

    // --- Phase 3: Generation with Gemini 3 Flash ---
    // systemInstruction is inside config in this SDK version
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: candidateInfo ? `REAL-TIME CANDIDATE DATA:\n${candidateInfo}\n\n` : "" },
            { text: context ? `OFFICIAL DOCUMENTATION CONTEXT:\n${context}\n\n` : "" },
            { text: `CHAT HISTORY:\n${history.map((h) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join("\n")}\n\n` },
            { text: `User Query: ${message}` }
          ]
        }
      ],
      config: {
        systemInstruction: `You are 'Bharat Nirvachan Assistant', a premium AI election guide for India. 
        Your goal is to provide accurate, neutral, and helpful information.`,
        tools: [
          {
            googleSearchRetrieval: {
              dynamicRetrievalConfig: {
                mode: "MODE_DYNAMIC",
                dynamicThreshold: 0.7,
              },
            },
          } as any,
        ],
        safetySettings: [
          { category: 'HARM_CATEGORY_HATE_SPEECH' as any, threshold: 'BLOCK_MEDIUM_AND_ABOVE' as any },
          { category: 'HARM_CATEGORY_HARASSMENT' as any, threshold: 'BLOCK_MEDIUM_AND_ABOVE' as any },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT' as any, threshold: 'BLOCK_MEDIUM_AND_ABOVE' as any },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT' as any, threshold: 'BLOCK_MEDIUM_AND_ABOVE' as any },
        ],
        temperature: 0.2,
        maxOutputTokens: 1024,
      }
    });

    const text = response.text || "I'm sorry, I'm having trouble formulating a response right now.";

    return NextResponse.json({ 
      text,
      sourcedFromECI: !!context 
    });
  } catch (error) {
    console.error("Gen AI Pipeline Critical Error:", error);
    return NextResponse.json({ 
      text: "I'm having some trouble accessing the latest data right now. Please try again in a few moments." 
    }, { status: 500 });
  }
}
