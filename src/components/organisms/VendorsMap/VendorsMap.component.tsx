'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Typography, Card } from '@/components/atoms';
import styles from './VendorsMap.module.scss';

interface Event {
  id: string;
  merchant_id: string;
  merchant_name: string;
  merchant_description: string | null;
  latitude: number;
  longitude: number;
  is_open: boolean;
  start_time: string;
  end_time: string;
  distance_km?: number;
  group_event_title?: string | null;
  can_accept_orders: boolean;
  average_wait_time_minutes?: number;
}

interface VendorsMapProps {
  className?: string;
}

export function VendorsMap({ className = '' }: VendorsMapProps) {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [mapReady, setMapReady] = useState(false);

  // Request user location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLocationPermission('granted');
        },
        (error) => {
          console.warn('Location permission denied:', error);
          setLocationPermission('denied');
          // Still fetch all events even without location
        }
      );
    } else {
      setLocationPermission('denied');
    }
  }, []);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        let url = `${apiUrl}/api/events`;
        
        // If user location is available, use nearby endpoint with 5 mile radius
        if (userLocation) {
          const radiusKm = 8.05; // ~5 miles
          url = `${apiUrl}/api/events/nearby?latitude=${userLocation.lat}&longitude=${userLocation.lng}&radius_km=${radiusKm}&is_open=true`;
        }

        console.log('Fetching events from:', url);
        const response = await fetch(url);
        if (!response.ok) {
          console.error('Fetch failed with status:', response.status, response.statusText);
          throw new Error(`Failed to fetch events: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched events:', data.length, 'events');
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Unable to load vendor events. Please try again later.');
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userLocation]);

  // Initialize map - wait until we're not loading and have the container
  useEffect(() => {
    // Don't initialize if already initialized, still loading, or no container
    if (map.current || loading || !mapContainer.current) return;

    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!accessToken) {
      console.error('Mapbox access token is missing');
      setError('Map configuration error. Please contact support.');
      return;
    }

    console.log('Initializing map...');

    // Default to UK center if no user location
    const defaultCenter: [number, number] = [-3.4359729, 54.7023545]; // UK center
    const center: [number, number] = userLocation 
      ? [userLocation.lng, userLocation.lat]
      : defaultCenter;

    try {
      mapboxgl.accessToken = accessToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center,
        zoom: userLocation ? 12 : 5, // Zoom in if we have user location
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add event listeners
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setMapReady(true);
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError('Failed to load map. Please refresh the page.');
      });

      // Add user location marker if available
      if (userLocation && map.current) {
        const el = document.createElement('div');
        el.className = 'user-location-marker';
        el.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIgZmlsbD0iIzQyODVGNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIi8+PC9zdmc+)';
        el.style.width = '24px';
        el.style.height = '24px';
        el.style.backgroundSize = 'contain';

        new mapboxgl.Marker(el)
          .setLngLat([userLocation.lng, userLocation.lat])
          .addTo(map.current);
      }
    } catch (err) {
      console.error('Map initialization error:', err);
      setError('Unable to initialize map. Please refresh the page.');
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [loading, userLocation]);

  // Add event markers
  useEffect(() => {
    if (!map.current || events.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each event
    events.forEach((event) => {
      if (!map.current) return;

      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'vendor-marker';
      el.style.backgroundColor = event.is_open ? '#10b981' : '#6b7280';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.borderRadius = '50% 50% 50% 0';
      el.style.transform = 'rotate(-45deg)';
      el.style.border = '3px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      // Create popup content
      const popupContent = document.createElement('div');
      popupContent.style.padding = '12px';
      popupContent.style.minWidth = '200px';
      
      const title = document.createElement('h3');
      title.textContent = event.merchant_name;
      title.style.margin = '0 0 8px 0';
      title.style.fontSize = '16px';
      title.style.fontWeight = '600';
      popupContent.appendChild(title);

      if (event.merchant_description) {
        const desc = document.createElement('p');
        desc.textContent = event.merchant_description;
        desc.style.margin = '0 0 8px 0';
        desc.style.fontSize = '14px';
        desc.style.color = '#666';
        popupContent.appendChild(desc);
      }

      if (event.group_event_title) {
        const groupEvent = document.createElement('p');
        groupEvent.textContent = `📍 ${event.group_event_title}`;
        groupEvent.style.margin = '0 0 8px 0';
        groupEvent.style.fontSize = '12px';
        groupEvent.style.color = '#888';
        groupEvent.style.fontStyle = 'italic';
        popupContent.appendChild(groupEvent);
      }

      const status = document.createElement('div');
      status.style.display = 'flex';
      status.style.alignItems = 'center';
      status.style.gap = '8px';
      status.style.marginBottom = '8px';

      const statusBadge = document.createElement('span');
      statusBadge.textContent = event.is_open ? 'Open Now' : 'Closed';
      statusBadge.style.backgroundColor = event.is_open ? '#10b981' : '#6b7280';
      statusBadge.style.color = 'white';
      statusBadge.style.padding = '2px 8px';
      statusBadge.style.borderRadius = '12px';
      statusBadge.style.fontSize = '12px';
      status.appendChild(statusBadge);

      if (event.average_wait_time_minutes) {
        const waitTime = document.createElement('span');
        waitTime.textContent = `⏱️ ${event.average_wait_time_minutes} min`;
        waitTime.style.fontSize = '12px';
        waitTime.style.color = '#666';
        status.appendChild(waitTime);
      }
      popupContent.appendChild(status);

      if (event.distance_km !== undefined) {
        const distance = document.createElement('p');
        distance.textContent = `📍 ${event.distance_km.toFixed(1)} km away`;
        distance.style.margin = '0 0 8px 0';
        distance.style.fontSize = '12px';
        distance.style.color = '#888';
        popupContent.appendChild(distance);
      }

      const button = document.createElement('button');
      button.textContent = 'View Menu';
      button.style.width = '100%';
      button.style.padding = '8px 16px';
      button.style.backgroundColor = '#2563eb';
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.borderRadius = '6px';
      button.style.fontSize = '14px';
      button.style.fontWeight = '500';
      button.style.cursor = 'pointer';
      button.style.marginTop = '8px';
      button.onclick = () => {
        router.push(`/vendors/${event.merchant_id}`);
      };
      popupContent.appendChild(button);

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '300px',
      }).setDOMContent(popupContent);

      // Create and add marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([event.longitude, event.latitude])
        .setPopup(popup)
        .addTo(map.current);

      markersRef.current.push(marker);
    });

    // Fit map to show all markers if we have events
    if (events.length > 0 && map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      events.forEach(event => {
        bounds.extend([event.longitude, event.latitude]);
      });
      
      // Include user location in bounds if available
      if (userLocation) {
        bounds.extend([userLocation.lng, userLocation.lat]);
      }

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      });
    }
  }, [events, router, userLocation]);

  return (
    <div className={`${styles.vendorsMap} ${className}`}>
      {locationPermission === 'denied' && (
        <Card variant="default" padding="md" className={styles.vendorsMap__notification}>
          <Typography variant="body-small">
            📍 Enable location access to see vendors near you. Showing all vendors nationwide.
          </Typography>
        </Card>
      )}

      {locationPermission === 'granted' && userLocation && (
        <Card variant="default" padding="md" className={styles.vendorsMap__notificationSuccess}>
          <Typography variant="body-small">
            ✅ Showing vendors within 5 miles of your location
          </Typography>
        </Card>
      )}

      {loading && (
        <Card variant="default" padding="lg" className={styles.vendorsMap__loading}>
          <Typography variant="body-medium">
            Loading vendors...
          </Typography>
        </Card>
      )}

      {error && !loading && (
        <Card variant="default" padding="md" className={styles.vendorsMap__error}>
          <Typography variant="body-medium">
            {error}
          </Typography>
        </Card>
      )}

      {!loading && !error && (
        <>
          <div 
            ref={mapContainer} 
            className={styles.vendorsMap__container}
            id="vendors-map-container"
          />
          
          {events.length === 0 && (
            <Card variant="default" padding="md" className={styles.vendorsMap__empty}>
              <Typography variant="body-medium">
                No vendors found in your area. Try expanding your search radius or check back later!
              </Typography>
            </Card>
          )}

          {events.length > 0 && (
            <Card variant="default" padding="md" className={styles.vendorsMap__stats}>
              <Typography variant="body-small">
                📌 Found {events.length} vendor{events.length !== 1 ? 's' : ''} • Click markers to view menu
              </Typography>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
