'use client';

import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import type { LocationPickerProps } from './LocationPicker.types';
import styles from './LocationPicker.module.scss';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export const LocationPicker: React.FC<LocationPickerProps> = ({
  latitude,
  longitude,
  onLocationChange,
  zoom = 14,
  width = '100%',
  height = '300px',
  className,
  mapStyle = 'mapbox://styles/mapbox/streets-v12',
  label,
  'data-testid': dataTestId,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCenter, setCurrentCenter] = useState({ lat: latitude, lng: longitude });

  useEffect(() => {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!accessToken) {
      setError('Mapbox access token is required');
      setIsLoading(false);
      return;
    }
    if (!mapContainer.current) return;
    // Try to get user's current location
    const setupMap = (lat: number, lng: number) => {
      mapboxgl.accessToken = accessToken;
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current!, // non-null
          style: mapStyle,
          center: [lng, lat],
          zoom: zoom,
        });
        map.current.on('moveend', () => {
          if (map.current) {
            const center = map.current.getCenter();
            setCurrentCenter({ lat: center.lat, lng: center.lng });
            onLocationChange(center.lat, center.lng);
          }
        });
        map.current.on('load', () => {
          setIsLoading(false);
        });
        map.current.on('error', (e) => {
          console.error('Mapbox error:', e);
          setError('Failed to load map');
          setIsLoading(false);
        });
      } catch (err) {
        console.error('Failed to initialize map:', err);
        setError('Failed to initialize map');
        setIsLoading(false);
      }
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCurrentCenter({ lat, lng });
          onLocationChange(lat, lng);
          setupMap(lat, lng);
        },
        (err) => {
          // Fallback to provided props
          setupMap(latitude, longitude);
        }
      );
    } else {
      setupMap(latitude, longitude);
    }
    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Update map center when props change
  useEffect(() => {
    if (map.current) {
      map.current.setCenter([longitude, latitude]);
      setCurrentCenter({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude]);

  const containerClasses = classNames(
    styles.locationPicker,
    className
  );

  const mapContainerClasses = classNames(
    styles.locationPicker__map,
    {
      [styles['locationPicker__map--loading']]: isLoading,
      [styles['locationPicker__map--error']]: error,
    }
  );

  return (
    <div className={containerClasses} data-testid={dataTestId}>
      {label && (
        <label className={styles.locationPicker__label}>
          {label}
        </label>
      )}
      
      <div className={styles.locationPicker__container}>
        <div
          ref={mapContainer}
          className={mapContainerClasses}
          style={{ width, height }}
        />
        
        {/* Fixed center pin */}
        <div className={styles.locationPicker__pin}>
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
              fill="#0369a1"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <circle cx="12" cy="9" r="2.5" fill="#ffffff" />
          </svg>
        </div>
        
        {isLoading && (
          <div className={styles.locationPicker__loading}>
            Loading map...
          </div>
        )}
        
        {error && (
          <div className={styles.locationPicker__error}>
            {error}
          </div>
        )}
        
        <div className={styles.locationPicker__instructions}>
          Drag the map to position the pin at your event location
        </div>
      </div>
      
      <div className={styles.locationPicker__coordinates}>
        <small>
          Latitude: {currentCenter.lat.toFixed(6)}, Longitude: {currentCenter.lng.toFixed(6)}
        </small>
      </div>
    </div>
  );
};