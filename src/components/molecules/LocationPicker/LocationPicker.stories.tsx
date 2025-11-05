import type { Meta, StoryObj } from '@storybook/react';
import { LocationPicker } from './LocationPicker.component';
import { useState } from 'react';

const meta = {
  title: 'Molecules/LocationPicker',
  component: LocationPicker,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'An interactive map component for selecting event locations. Uses Mapbox GL to display a draggable map with a fixed center pin. Users can drag the map to position their desired location under the pin.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    latitude: {
      description: 'Current latitude coordinate',
      control: { type: 'number', min: -90, max: 90, step: 0.000001 },
    },
    longitude: {
      description: 'Current longitude coordinate',
      control: { type: 'number', min: -180, max: 180, step: 0.000001 },
    },
    onLocationChange: {
      description: 'Callback when location is changed by dragging the map',
      action: 'locationChanged',
    },
    zoom: {
      description: 'Map zoom level (higher = more zoomed in)',
      control: { type: 'number', min: 1, max: 20, step: 1 },
    },
    width: {
      description: 'Width of the map container',
      control: 'text',
    },
    height: {
      description: 'Height of the map container',
      control: 'text',
    },
    mapStyle: {
      description: 'Mapbox style URL',
      control: 'select',
      options: [
        'mapbox://styles/mapbox/streets-v12',
        'mapbox://styles/mapbox/outdoors-v12',
        'mapbox://styles/mapbox/light-v11',
        'mapbox://styles/mapbox/dark-v11',
        'mapbox://styles/mapbox/satellite-v9',
        'mapbox://styles/mapbox/satellite-streets-v12',
      ],
    },
    label: {
      description: 'Optional label above the map',
      control: 'text',
    },
  },
} satisfies Meta<typeof LocationPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// London coordinates
export const London: Story = {
  args: {
    latitude: 51.5074,
    longitude: -0.1278,
    onLocationChange: (lat, lng) => console.log('Location changed:', { lat, lng }),
    zoom: 14,
    width: '100%',
    height: '400px',
    label: 'Select Event Location',
  },
};

// New York coordinates
export const NewYork: Story = {
  args: {
    latitude: 40.7128,
    longitude: -74.0060,
    onLocationChange: (lat, lng) => console.log('Location changed:', { lat, lng }),
    zoom: 14,
    width: '100%',
    height: '400px',
    label: 'Event Location',
  },
};

// Tokyo coordinates
export const Tokyo: Story = {
  args: {
    latitude: 35.6762,
    longitude: 139.6503,
    onLocationChange: (lat, lng) => console.log('Location changed:', { lat, lng }),
    zoom: 14,
    width: '100%',
    height: '400px',
  },
};

// With different zoom levels
export const ZoomedOut: Story = {
  args: {
    latitude: 51.5074,
    longitude: -0.1278,
    onLocationChange: (lat, lng) => console.log('Location changed:', { lat, lng }),
    zoom: 10,
    width: '100%',
    height: '400px',
    label: 'City View',
  },
};

export const ZoomedIn: Story = {
  args: {
    latitude: 51.5074,
    longitude: -0.1278,
    onLocationChange: (lat, lng) => console.log('Location changed:', { lat, lng }),
    zoom: 18,
    width: '100%',
    height: '400px',
    label: 'Street View',
  },
};

// Different map styles
export const DarkStyle: Story = {
  args: {
    latitude: 51.5074,
    longitude: -0.1278,
    onLocationChange: (lat, lng) => console.log('Location changed:', { lat, lng }),
    zoom: 14,
    width: '100%',
    height: '400px',
    mapStyle: 'mapbox://styles/mapbox/dark-v11',
    label: 'Dark Theme Map',
  },
};

export const SatelliteStyle: Story = {
  args: {
    latitude: 51.5074,
    longitude: -0.1278,
    onLocationChange: (lat, lng) => console.log('Location changed:', { lat, lng }),
    zoom: 14,
    width: '100%',
    height: '400px',
    mapStyle: 'mapbox://styles/mapbox/satellite-streets-v12',
    label: 'Satellite View',
  },
};

// Different sizes
export const Compact: Story = {
  args: {
    latitude: 51.5074,
    longitude: -0.1278,
    onLocationChange: (lat, lng) => console.log('Location changed:', { lat, lng }),
    zoom: 14,
    width: '100%',
    height: '250px',
    label: 'Compact Size',
  },
};

export const Tall: Story = {
  args: {
    latitude: 51.5074,
    longitude: -0.1278,
    onLocationChange: (lat, lng) => console.log('Location changed:', { lat, lng }),
    zoom: 14,
    width: '100%',
    height: '600px',
    label: 'Tall Size',
  },
};

export const FixedWidth: Story = {
  args: {
    latitude: 51.5074,
    longitude: -0.1278,
    onLocationChange: (lat, lng) => console.log('Location changed:', { lat, lng }),
    zoom: 14,
    width: '500px',
    height: '400px',
    label: 'Fixed Width',
  },
};

// Interactive demo with state
export const Interactive: Story = {
  args: {
    latitude: 51.5074,
    longitude: -0.1278,
    onLocationChange: () => {},
  },
  render: () => {
    const [location, setLocation] = useState({ lat: 51.5074, lng: -0.1278 });
    
    return (
      <div style={{ maxWidth: '800px' }}>
        <LocationPicker
          latitude={location.lat}
          longitude={location.lng}
          onLocationChange={(lat, lng) => {
            setLocation({ lat, lng });
            console.log('Location changed:', { lat, lng });
          }}
          zoom={14}
          width="100%"
          height="400px"
          label="Drag the map to select your location"
        />
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: 'var(--color-neutral-50)',
          borderRadius: 'var(--border-radius-md)',
          fontFamily: 'var(--font-family-body)',
        }}>
          <h4 style={{ marginBottom: '0.5rem' }}>Selected Location:</h4>
          <p>Latitude: {location.lat.toFixed(6)}</p>
          <p>Longitude: {location.lng.toFixed(6)}</p>
        </div>
      </div>
    );
  },
};

// Form integration example
export const InForm: Story = {
  args: {
    latitude: 51.5074,
    longitude: -0.1278,
    onLocationChange: () => {},
  },
  render: () => {
    const [formData, setFormData] = useState({
      eventName: '',
      latitude: 51.5074,
      longitude: -0.1278,
    });
    
    return (
      <div style={{ maxWidth: '600px' }}>
        <form 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            fontFamily: 'var(--font-family-body)',
          }}
          onSubmit={(e) => {
            e.preventDefault();
            console.log('Form submitted:', formData);
            alert(`Event: ${formData.eventName}\nLocation: ${formData.latitude}, ${formData.longitude}`);
          }}
        >
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Event Name
            </label>
            <input
              type="text"
              value={formData.eventName}
              onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
              placeholder="Summer BBQ"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid var(--color-neutral-300)',
                borderRadius: 'var(--border-radius-md)',
                fontFamily: 'inherit',
              }}
            />
          </div>
          
          <LocationPicker
            latitude={formData.latitude}
            longitude={formData.longitude}
            onLocationChange={(lat, lng) => {
              setFormData({ ...formData, latitude: lat, longitude: lng });
            }}
            zoom={14}
            width="100%"
            height="350px"
            label="Event Location"
          />
          
          <button
            type="submit"
            style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--color-primary-600)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--border-radius-md)',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Create Event
          </button>
        </form>
      </div>
    );
  },
};

// Multiple maps
export const MultipleMaps: Story = {
  args: {
    latitude: 51.5074,
    longitude: -0.1278,
    onLocationChange: () => {},
  },
  render: () => {
    const [locations, setLocations] = useState([
      { id: 1, name: 'London', lat: 51.5074, lng: -0.1278 },
      { id: 2, name: 'Paris', lat: 48.8566, lng: 2.3522 },
      { id: 3, name: 'Berlin', lat: 52.5200, lng: 13.4050 },
    ]);
    
    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
      }}>
        {locations.map((location) => (
          <div key={location.id}>
            <LocationPicker
              latitude={location.lat}
              longitude={location.lng}
              onLocationChange={(lat, lng) => {
                console.log(`${location.name} moved:`, { lat, lng });
              }}
              zoom={12}
              width="100%"
              height="300px"
              label={location.name}
            />
          </div>
        ))}
      </div>
    );
  },
};

// No Mapbox token warning (for documentation)
export const NoToken: Story = {
  args: {
    latitude: 51.5074,
    longitude: -0.1278,
    onLocationChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'This story demonstrates what happens when the Mapbox access token is not configured. Make sure to set `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` in your environment variables.',
      },
    },
  },
  render: () => {
    // Temporarily clear the token to show error state
    const originalToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    
    return (
      <div>
        <div style={{ 
          marginBottom: '1rem', 
          padding: '1rem', 
          background: 'var(--color-warning-light)',
          borderRadius: 'var(--border-radius-md)',
        }}>
          <strong>Note:</strong> This requires a valid Mapbox access token in your environment variables.
        </div>
        <LocationPicker
          latitude={51.5074}
          longitude={-0.1278}
          onLocationChange={() => {}}
          zoom={14}
          width="100%"
          height="400px"
          label="Map (requires token)"
        />
      </div>
    );
  },
};
