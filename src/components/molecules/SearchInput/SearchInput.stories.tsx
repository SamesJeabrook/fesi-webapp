import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
import { SearchInput } from './SearchInput.component';
import { http, HttpResponse } from 'msw';
import type { Merchant, ApiResponse } from '@/types';

// Mock data for search results
const mockSearchResults: Merchant[] = [
  {
    id: 'search-1',
    userId: 'user-1',
    businessName: 'Pizza Palace',
    businessType: 'restaurant',
    email: 'info@pizzapalace.com',
    addressLine1: '123 Main St',
    city: 'London',
    postcode: 'SW1A 1AA',
    cuisine: ['Italian', 'Pizza'],
    status: 'active',
    rating: 4.5,
    totalReviews: 120,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'search-2',
    userId: 'user-2',
    businessName: 'Burger Barn',
    businessType: 'restaurant',
    email: 'hello@burgerbarn.com',
    addressLine1: '456 High St',
    city: 'London',
    postcode: 'SW1A 2BB',
    cuisine: ['American', 'Burgers'],
    status: 'active',
    rating: 4.2,
    totalReviews: 85,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'search-3',
    userId: 'user-3',
    businessName: 'Sushi Zen',
    businessType: 'restaurant',
    email: 'orders@sushizen.com',
    addressLine1: '789 Park Ave',
    city: 'London',
    postcode: 'SW1A 3CC',
    cuisine: ['Japanese', 'Sushi'],
    status: 'active',
    rating: 4.8,
    totalReviews: 203,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const meta: Meta<typeof SearchInput> = {
  title: 'Molecules/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A search input component with debouncing, loading states, and clear functionality. Includes MSW integration examples for testing API interactions.',
      },
    },
  },
  argTypes: {
    placeholder: {
      description: 'Placeholder text',
      control: 'text',
    },
    debounceMs: {
      description: 'Debounce delay in milliseconds',
      control: 'number',
    },
    isLoading: {
      description: 'Show loading spinner',
      control: 'boolean',
    },
    showClearButton: {
      description: 'Show clear button when input has value',
      control: 'boolean',
    },
    size: {
      description: 'Size of the input',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    fullWidth: {
      description: 'Makes input full width',
      control: 'boolean',
    },
    onSearch: {
      description: 'Search handler function',
      action: 'search',
    },
    onClear: {
      description: 'Clear handler function',
      action: 'clear',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic examples
export const Default: Story = {
  args: {
    id: 'default-search',
    placeholder: 'Search restaurants...',
  },
};

export const Loading: Story = {
  args: {
    id: 'loading-search',
    placeholder: 'Search restaurants...',
    isLoading: true,
    value: 'pizza',
  },
};

export const WithoutClearButton: Story = {
  args: {
    id: 'no-clear-search',
    placeholder: 'Search restaurants...',
    showClearButton: false,
    value: 'burger',
  },
};

export const CustomDebounce: Story = {
  args: {
    id: 'custom-debounce-search',
    placeholder: 'Search with 1s debounce...',
    debounceMs: 1000,
  },
};

// Size variations
export const Small: Story = {
  args: {
    id: 'small-search',
    placeholder: 'Small search...',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    id: 'large-search',
    placeholder: 'Large search...',
    size: 'lg',
  },
};

export const FullWidth: Story = {
  args: {
    id: 'fullwidth-search',
    placeholder: 'Full width search...',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

// Interactive examples with state management
export const ControlledInput: Story = {
  render: () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState<string[]>([]);

    const handleSearch = (query: string) => {
      setSearchValue(query);
      
      // Simulate search results
      if (query.trim()) {
        const results = mockSearchResults
          .filter(restaurant => 
            restaurant.businessName.toLowerCase().includes(query.toLowerCase()) ||
            restaurant.cuisine?.some(c => c.toLowerCase().includes(query.toLowerCase()))
          )
          .map(restaurant => restaurant.businessName);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    };

    const handleClear = () => {
      setSearchValue('');
      setSearchResults([]);
    };

    return (
      <div style={{ width: '400px' }}>
        <SearchInput
          id="controlled-search"
          placeholder="Search restaurants or cuisine..."
          value={searchValue}
          onSearch={handleSearch}
          onClear={handleClear}
        />
        
        {searchResults.length > 0 && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#666' }}>
              Search Results ({searchResults.length})
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1rem' }}>
              {searchResults.map((result, index) => (
                <li key={index} style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  {result}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlled search input with immediate results display.',
      },
    },
  },
};

// MSW integration example
export const WithAPIIntegration: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/search/restaurants', ({ request }) => {
          const url = new URL(request.url);
          const query = url.searchParams.get('q') || '';
          
          // Simulate loading delay
          setTimeout(() => {}, 300);
          
          const results = mockSearchResults.filter(restaurant =>
            restaurant.businessName.toLowerCase().includes(query.toLowerCase()) ||
            restaurant.cuisine?.some(c => c.toLowerCase().includes(query.toLowerCase()))
          );

          const response: ApiResponse<Merchant[]> = {
            data: results,
            success: true,
          };

          return HttpResponse.json(response);
        }),
      ],
    },
    docs: {
      description: {
        story: 'Full API integration example using Mock Service Worker (MSW) to simulate restaurant search functionality.',
      },
    },
  },
  render: () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState<Merchant[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (query: string) => {
      setSearchValue(query);
      
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/search/restaurants?q=${encodeURIComponent(query)}`);
        const data: ApiResponse<Merchant[]> = await response.json();
        
        if (data.success) {
          setSearchResults(data.data);
        } else {
          throw new Error('Search failed');
        }
      } catch (err) {
        setError('Failed to search restaurants');
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const handleClear = () => {
      setSearchValue('');
      setSearchResults([]);
      setError(null);
    };

    return (
      <div style={{ width: '500px' }}>
        <SearchInput
          id="api-search"
          placeholder="Search restaurants (try 'pizza', 'burger', or 'sushi')..."
          value={searchValue}
          onSearch={handleSearch}
          onClear={handleClear}
          isLoading={isLoading}
        />
        
        {error && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
            color: '#c33',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}
        
        {searchResults.length > 0 && (
          <div style={{
            marginTop: '1rem',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ padding: '0.75rem', borderBottom: '1px solid #e0e0e0', background: '#f8f9fa' }}>
              <h4 style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>
                Found {searchResults.length} restaurant{searchResults.length !== 1 ? 's' : ''}
              </h4>
            </div>
            {searchResults.map((restaurant) => (
              <div key={restaurant.id} style={{
                padding: '0.75rem',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                    {restaurant.businessName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>
                    {restaurant.cuisine?.join(', ')} • {restaurant.city}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>
                  ⭐ {restaurant.rating} ({restaurant.totalReviews})
                </div>
              </div>
            ))}
          </div>
        )}
        
        {searchValue && searchResults.length === 0 && !isLoading && !error && (
          <div style={{
            marginTop: '1rem',
            padding: '2rem',
            textAlign: 'center',
            color: '#666',
            fontSize: '0.875rem'
          }}>
            No restaurants found for "{searchValue}"
          </div>
        )}
      </div>
    );
  },
};

// Food ordering context examples
export const RestaurantSearch: Story = {
  args: {
    id: 'restaurant-search',
    placeholder: 'Search for restaurants, cuisines, or dishes...',
    size: 'lg',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Restaurant search input for the main food ordering interface.',
      },
    },
  },
};

export const MenuSearch: Story = {
  args: {
    id: 'menu-search',
    placeholder: 'Search menu items...',
    size: 'md',
    debounceMs: 200,
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu item search within a restaurant page.',
      },
    },
  },
};
