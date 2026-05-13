import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PollingMap from '../components/PollingMap';

// Mock the Google Maps API
vi.mock('@react-google-maps/api', () => ({
  GoogleMap: ({ children }: { children: React.ReactNode }) => <div data-testid="google-map">{children}</div>,
  useJsApiLoader: () => ({ isLoaded: true, loadError: null }),
  Marker: ({ title, onClick }: { title: string, onClick: () => void }) => (
    <div data-testid={`marker-${title}`} onClick={onClick} aria-label={`Marker ${title}`}></div>
  ),
  InfoWindow: ({ children, onCloseClick }: { children: React.ReactNode, onCloseClick: () => void }) => (
    <div data-testid="info-window">
      <button onClick={onCloseClick} aria-label="Close InfoWindow">Close</button>
      {children}
    </div>
  ),
}));

// Mock Firebase Firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  onSnapshot: vi.fn((q, callback) => {
    callback({
      docs: [
        {
          id: 'b1',
          data: () => ({
            name: 'Voter Center Alpha',
            address: '123 Democracy St',
            lat: 28.6139,
            lng: 77.2090,
            phase: 3,
            wait: '10 min'
          })
        }
      ]
    });
    return () => {};
  }),
  getFirestore: vi.fn(),
}));

// Global Google Mock
const googleMock = {
  maps: {
    Size: vi.fn().mockImplementation((w, h) => ({ width: w, height: h })),
    LatLng: vi.fn().mockImplementation((lat, lng) => ({ lat, lng })),
  }
};

describe('PollingMap Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (window as any).google = googleMock;
  });

  it('renders the map container correctly when loaded', async () => {
    render(<PollingMap />);
    const map = await screen.findByTestId('google-map');
    expect(map).toBeInTheDocument();
  });

  it('renders markers based on Firestore data', async () => {
    render(<PollingMap />);
    const marker = await screen.findByTestId('marker-Voter Center Alpha');
    expect(marker).toBeInTheDocument();
  });

  it('opens InfoWindow when a marker is clicked', async () => {
    render(<PollingMap />);
    const marker = await screen.findByTestId('marker-Voter Center Alpha');
    fireEvent.click(marker);
    
    const infoWindow = await screen.findByTestId('info-window');
    expect(infoWindow).toBeInTheDocument();
    // Now it should only find one instance of the text in the InfoWindow
    expect(screen.getByText(/Voter Center Alpha/i)).toBeInTheDocument();
  });

  it('closes InfoWindow when close button is clicked', async () => {
    render(<PollingMap />);
    const marker = await screen.findByTestId('marker-Voter Center Alpha');
    fireEvent.click(marker);
    
    const closeBtn = await screen.findByLabelText(/Close InfoWindow/i);
    fireEvent.click(closeBtn);
    
    expect(screen.queryByTestId('info-window')).not.toBeInTheDocument();
  });
});
