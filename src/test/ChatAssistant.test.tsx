import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatAssistant from '../components/ChatAssistant';
import { LanguageProvider } from '../context/LanguageContext';
import { AuthProvider } from '../context/AuthContext';

// Wrap components in necessary providers for testing
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <LanguageProvider>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </LanguageProvider>
  );
};

describe('ChatAssistant Component', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders the floating action button when not in page mode', async () => {
    renderWithProviders(<ChatAssistant />);
    const fab = await screen.findByLabelText(/Open AI Civic Assistant/i);
    expect(fab).toBeInTheDocument();
  });

  it('opens the chat window when FAB is clicked', async () => {
    renderWithProviders(<ChatAssistant />);
    const fab = await screen.findByLabelText(/Open AI Civic Assistant/i);
    fireEvent.click(fab);
    
    // Check for the header text "Bharat Nirvachan AI"
    const header = await screen.findByText(/Bharat Nirvachan AI/i);
    expect(header).toBeInTheDocument();
  });

  it('switches to guide mode correctly', async () => {
    renderWithProviders(<ChatAssistant />);
    const fab = await screen.findByLabelText(/Open AI Civic Assistant/i);
    fireEvent.click(fab);
    
    // The tab text is "Voter Guide" (translated from key 'voter_guide')
    const guideTab = await screen.findByRole('tab', { name: /Voter Guide/i });
    fireEvent.click(guideTab);
    
    // Check for process timeline header (translated from key 'process_timeline')
    const timelineHeader = await screen.findByText(/Election Process Timeline/i);
    expect(timelineHeader).toBeInTheDocument();
  });

  it('persists chat mode to localStorage', async () => {
    renderWithProviders(<ChatAssistant />);
    const fab = await screen.findByLabelText(/Open AI Civic Assistant/i);
    fireEvent.click(fab);
    
    const guideTab = await screen.findByRole('tab', { name: /Voter Guide/i });
    fireEvent.click(guideTab);
    
    await waitFor(() => {
      const savedState = JSON.parse(window.localStorage.getItem('chat_assistant_state') || '{}');
      expect(savedState.mode).toBe('guide');
    });
  });

  it('renders in full page mode correctly', async () => {
    renderWithProviders(<ChatAssistant isPage={true} />);
    const header = await screen.findByText(/Bharat Nirvachan AI/i);
    expect(header).toBeInTheDocument();
    expect(screen.queryByLabelText(/Open AI Civic Assistant/i)).not.toBeInTheDocument();
  });
});
