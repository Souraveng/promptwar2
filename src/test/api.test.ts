import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../app/api/chat/route';

// Mock the Gen AI SDK v1.51.0 structure
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: vi.fn().mockResolvedValue({
        text: "Mocked AI Response"
      })
    }
  }))
}));

// Mock Discovery Engine (Vertex Search)
vi.mock('@google-cloud/discoveryengine', () => ({
  SearchServiceClient: vi.fn().mockImplementation(() => ({
    projectLocationCollectionDataStoreServingConfigPath: vi.fn().mockReturnValue('mock-path'),
    search: vi.fn().mockResolvedValue([[]]) 
  }))
}));

// Mock Firebase
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn().mockResolvedValue({ empty: true }),
  getFirestore: vi.fn(),
  db: {}
}));

describe('Chat API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 if message is missing', async () => {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({})
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.text).toBe('Message is required.');
  });

  it('returns AI response for valid message', async () => {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello' })
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.text).toBe('Mocked AI Response');
  });
});
