"use client";

/**
 * @file PollingMap.tsx
 * @description Interactive Google Map component for locating polling booths.
 * Integrates real-time Firestore sync and localized state centering.
 * Optimized for performance using React.memo and useCallback.
 */

import React, { useCallback, useState, useEffect, useMemo, memo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { collection, onSnapshot, query, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Standard CSS style for the map container.
 */
const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px'
};

/**
 * Default geographic center of India (New Delhi).
 */
const DEFAULT_CENTER = {
  lat: 28.6139,
  lng: 77.2090
};

/**
 * Predefined geographic centers for major states to improve initial UX.
 */
const STATE_CENTERS: Record<string, google.maps.LatLngLiteral> = {
  "West Bengal": { lat: 22.5726, lng: 88.3639 },
  "Tamil Nadu": { lat: 13.0827, lng: 80.2707 },
  "Uttar Pradesh": { lat: 26.8467, lng: 80.9462 },
  "Gujarat": { lat: 23.0225, lng: 72.5714 },
  "Karnataka": { lat: 12.9716, lng: 77.5946 },
};

/**
 * Custom Map Styles for a premium, high-contrast civic interface.
 */
const MAP_OPTIONS: google.maps.MapOptions = {
  styles: [
    {
      "featureType": "poi",
      "elementType": "labels",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "transit",
      "elementType": "labels",
      "stylers": [{ "visibility": "off" }]
    }
  ],
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
};

/**
 * Interface representing a Polling Booth (Station).
 */
interface Booth {
  /** Unique identifier for the booth */
  id: string;
  /** Official name of the polling station */
  name: string;
  /** Physical address */
  address: string;
  /** Latitude coordinate */
  lat: number;
  /** Longitude coordinate */
  lng: number;
  /** Election phase number */
  phase: number;
  /** Optional current estimated wait time */
  wait?: string;
}

/**
 * PollingMap Component
 * 
 * Renders an interactive map with real-time polling booth markers.
 * 
 * @param {Object} props - Component props.
 * @param {string} [props.userState] - The state to center the map on initially.
 * @returns {React.ReactElement} The rendered PollingMap.
 */
function PollingMap({ userState }: { userState?: string }) {
  // --- State & Memoization ---
  
  /**
   * Calculates the initial center point based on the user's state.
   */
  const mapCenter = useMemo(() => 
    userState && STATE_CENTERS[userState] ? STATE_CENTERS[userState] : DEFAULT_CENTER,
  [userState]);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const [booths, setBooths] = useState<Booth[]>([]);
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  // --- Data Syncing ---

  /**
   * Establishes a real-time Firestore listener for polling station data.
   */
  useEffect(() => {
    const q = query(collection(db, 'pollingStations'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const boothData = snapshot.docs.map(doc => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          name: data.name,
          address: data.address,
          lat: data.lat,
          lng: data.lng,
          phase: data.phase,
          wait: data.wait
        };
      }) as Booth[];
      setBooths(boothData);
    }, (error) => {
      console.error("Firestore sync error:", error);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Triggers a fallback UI if the map fails to load within a reasonable timeframe.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) setShowFallback(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  // --- Callbacks ---

  /**
   * Handles selection of a polling station marker.
   */
  const onMarkerClick = useCallback((booth: Booth) => {
    setSelectedBooth(booth);
  }, []);

  /**
   * Clears the currently selected booth.
   */
  const onCloseInfoWindow = useCallback(() => {
    setSelectedBooth(null);
  }, []);

  // --- Rendering States ---

  if (loadError || showFallback) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 p-12 text-center" role="alert">
        <div className="max-w-sm space-y-4">
          <span className="material-symbols-outlined text-3xl text-red-600">map_error</span>
          <h3 className="text-xl font-bold">Map Connection Issue</h3>
          <p className="text-sm text-slate-500">
            We're having trouble loading the interactive map. Please check your connection or browser settings.
          </p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:opacity-90">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 animate-pulse" aria-label="Loading map">
        <div className="flex flex-col items-center gap-2">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Initializing Map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full" role="application" aria-label="Interactive Polling Station Map">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={userState ? 12 : 5}
        options={MAP_OPTIONS}
      >
        {booths.map(booth => {
          // Logic to determine if booth is currently active (Simulation Only)
          const isActive = booth.phase === 3; 
          
          return (
            <Marker 
              key={booth.id}
              position={{ lat: booth.lat, lng: booth.lng }}
              onClick={() => onMarkerClick(booth)}
              title={booth.name}
              icon={{
                url: isActive 
                  ? 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' 
                  : 'https://maps.google.com/mapfiles/ms/icons/grn-dot.png',
                scaledSize: new window.google.maps.Size(isActive ? 45 : 35, isActive ? 45 : 35)
              }}
              opacity={isActive ? 1 : 0.6}
            />
          );
        })}

        {selectedBooth && (
          <InfoWindow
            position={{ lat: selectedBooth.lat, lng: selectedBooth.lng }}
            onCloseClick={onCloseInfoWindow}
          >
            <div className="p-2 min-w-[180px]">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-black text-slate-900 leading-tight">{selectedBooth.name}</h3>
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                  selectedBooth.phase === 3 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  PHASE {selectedBooth.phase}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mb-3">{selectedBooth.address}</p>
              
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                {selectedBooth.phase === 3 ? (
                   <>
                    <span className="text-[10px] font-black text-red-600 uppercase">{selectedBooth.wait || '5 min'} wait</span>
                    <button className="text-[10px] font-black text-primary uppercase hover:underline">Directions</button>
                   </>
                ) : (
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Inactive in this phase</span>
                )}
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

/**
 * Memoized PollingMap to prevent redundant re-renders.
 */
export default memo(PollingMap);
