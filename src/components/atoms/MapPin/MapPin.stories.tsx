import type { Meta, StoryObj } from '@storybook/react';
import { MapPin } from './MapPin.component';

const meta: Meta<typeof MapPin> = {
  title: 'Atoms/MapPin',
  component: MapPin,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A map component using Mapbox GL JS with a custom fork-shaped pin marker. Displays a location on an interactive map.',
      },
    },
  },
  argTypes: {
    lat: {
      control: { type: 'number', step: 0.000001 },
      description: 'Latitude coordinate for the map center and pin location',
    },
    lng: {
      control: { type: 'number', step: 0.000001 },
      description: 'Longitude coordinate for the map center and pin location',
    },
    zoom: {
      control: { type: 'range', min: 1, max: 20, step: 1 },
      description: 'Map zoom level (1-20)',
    },
    width: {
      control: { type: 'text' },
      description: 'Width of the map container (CSS value)',
    },
    height: {
      control: { type: 'text' },
      description: 'Height of the map container (CSS value)',
    },
    mapStyle: {
      control: { type: 'select' },
      options: [
        'mapbox://styles/mapbox/streets-v12',
        'mapbox://styles/mapbox/outdoors-v12',
        'mapbox://styles/mapbox/light-v11',
        'mapbox://styles/mapbox/dark-v11',
        'mapbox://styles/mapbox/satellite-v9',
        'mapbox://styles/mapbox/satellite-streets-v12',
      ],
      description: 'Mapbox map style',
    },
    showUserLocation: {
      control: { type: 'boolean' },
      description: 'Whether to show user\'s current location on the map',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story - London, UK
export const Default: Story = {
  args: {
    lat: 51.5074,
    lng: -0.1278,
    zoom: 14,
    width: '100%',
    height: '400px',
  },
};

// Restaurant location example
export const RestaurantLocation: Story = {
  args: {
    lat: 51.5145,
    lng: -0.1467,
    zoom: 16,
    width: '100%',
    height: '300px',
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of a restaurant location with higher zoom level for more detail.',
      },
    },
  },
};

// Compact size
export const Compact: Story = {
  args: {
    lat: 51.5074,
    lng: -0.1278,
    zoom: 12,
    width: '300px',
    height: '200px',
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact version of the map component.',
      },
    },
  },
};

// Dark style
export const DarkStyle: Story = {
  args: {
    lat: 51.5074,
    lng: -0.1278,
    zoom: 14,
    width: '100%',
    height: '400px',
    mapStyle: 'mapbox://styles/mapbox/dark-v11',
  },
  parameters: {
    docs: {
      description: {
        story: 'Map with dark theme styling.',
      },
    },
  },
};

// Satellite view
export const SatelliteView: Story = {
  args: {
    lat: 51.5074,
    lng: -0.1278,
    zoom: 16,
    width: '100%',
    height: '400px',
    mapStyle: 'mapbox://styles/mapbox/satellite-streets-v12',
  },
  parameters: {
    docs: {
      description: {
        story: 'Map with satellite imagery and street overlays.',
      },
    },
  },
};

// Multiple locations story (showing how it could be used in a grid)
export const MultipleLocations: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
      <MapPin {...args} lat={51.5074} lng={-0.1278} height="250px" />
      <MapPin {...args} lat={51.5145} lng={-0.1467} height="250px" />
      <MapPin {...args} lat={51.5033} lng={-0.1195} height="250px" />
    </div>
  ),
  args: {
    zoom: 15,
    width: '100%',
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple map instances showing different locations.',
      },
    },
  },
};

// Error state (without access token)
export const ErrorState: Story = {
  args: {
    lat: 51.5074,
    lng: -0.1278,
    zoom: 14,
    width: '100%',
    height: '300px',
    accessToken: '', // This will trigger the error state
  },
  parameters: {
    docs: {
      description: {
        story: 'Error state when Mapbox access token is missing or invalid.',
      },
    },
  },
};

// User location story
export const UserLocation: Story = {
  args: {
    lat: 51.5074, // Default pin location (London)
    lng: -0.1278,
    zoom: 14,
    width: '100%',
    height: '400px',
    showUserLocation: true, 
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the user location functionality by showing the user marker alongside the pin. Set showUserLocation to true to enable this feature.',
      },
    },
  },
};