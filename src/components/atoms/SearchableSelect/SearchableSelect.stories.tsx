import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SearchableSelect } from './SearchableSelect.component';
import type { SearchableSelectOption } from './SearchableSelect.types';

// Sample options
const basicOptions: SearchableSelectOption[] = [
  { id: '1', label: 'Option 1' },
  { id: '2', label: 'Option 2' },
  { id: '3', label: 'Option 3' },
  { id: '4', label: 'Option 4' },
  { id: '5', label: 'Option 5' },
];

const foodCategoryOptions: SearchableSelectOption[] = [
  { id: 'pizza', label: 'Pizza' },
  { id: 'chinese', label: 'Chinese' },
  { id: 'indian', label: 'Indian' },
  { id: 'mexican', label: 'Mexican' },
  { id: 'italian', label: 'Italian' },
  { id: 'japanese', label: 'Japanese' },
  { id: 'thai', label: 'Thai' },
  { id: 'korean', label: 'Korean' },
  { id: 'vietnamese', label: 'Vietnamese' },
  { id: 'greek', label: 'Greek' },
  { id: 'turkish', label: 'Turkish' },
  { id: 'lebanese', label: 'Lebanese' },
  { id: 'chicken', label: 'Chicken' },
  { id: 'burger', label: 'Burger' },
  { id: 'steak', label: 'Steak' },
  { id: 'seafood', label: 'Seafood' },
  { id: 'bbq', label: 'BBQ' },
  { id: 'kebab', label: 'Kebab' },
  { id: 'fast-food', label: 'Fast Food' },
  { id: 'healthy', label: 'Healthy' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'dessert', label: 'Dessert' },
  { id: 'bakery', label: 'Bakery' },
  { id: 'coffee', label: 'Coffee' },
];

const countryOptions: SearchableSelectOption[] = [
  { id: 'gb', label: 'United Kingdom' },
  { id: 'us', label: 'United States' },
  { id: 'ca', label: 'Canada' },
  { id: 'au', label: 'Australia' },
  { id: 'fr', label: 'France' },
  { id: 'de', label: 'Germany' },
  { id: 'es', label: 'Spain' },
  { id: 'it', label: 'Italy' },
  { id: 'jp', label: 'Japan' },
  { id: 'cn', label: 'China' },
];

const meta: Meta<typeof SearchableSelect> = {
  title: 'Atoms/SearchableSelect',
  component: SearchableSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A searchable select dropdown component with keyboard navigation, filtering, and consistent styling with Input component. Perfect for long lists of options.',
      },
    },
  },
  argTypes: {
    id: {
      description: 'Unique identifier for the select',
      control: 'text',
    },
    label: {
      description: 'Label text for the select',
      control: 'text',
    },
    placeholder: {
      description: 'Placeholder text when no option is selected',
      control: 'text',
    },
    searchPlaceholder: {
      description: 'Placeholder text in the search input',
      control: 'text',
    },
    helperText: {
      description: 'Helper text below the select',
      control: 'text',
    },
    errorMessage: {
      description: 'Error message (overrides helper text)',
      control: 'text',
    },
    size: {
      description: 'Size of the select',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isRequired: {
      description: 'Shows required indicator',
      control: 'boolean',
    },
    isDisabled: {
      description: 'Disables the select',
      control: 'boolean',
    },
    isReadOnly: {
      description: 'Makes select read-only',
      control: 'boolean',
    },
    fullWidth: {
      description: 'Makes select full width',
      control: 'boolean',
    },
    noResultsText: {
      description: 'Text shown when no results match search',
      control: 'text',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic examples
export const Default: Story = {
  args: {
    id: 'default-select',
    options: basicOptions,
    placeholder: 'Select an option',
  },
};

export const WithLabel: Story = {
  args: {
    id: 'labeled-select',
    label: 'Choose an Option',
    options: basicOptions,
    placeholder: 'Select an option',
  },
};

export const WithHelperText: Story = {
  args: {
    id: 'helper-select',
    label: 'Food Category',
    options: foodCategoryOptions,
    placeholder: 'Select a category',
    helperText: 'Choose the primary food category for your restaurant.',
  },
};

export const Required: Story = {
  args: {
    id: 'required-select',
    label: 'Required Field',
    options: basicOptions,
    placeholder: 'Select an option',
    isRequired: true,
  },
};

export const WithError: Story = {
  args: {
    id: 'error-select',
    label: 'Food Category',
    options: foodCategoryOptions,
    placeholder: 'Select a category',
    errorMessage: 'Please select at least one food category.',
  },
};

// Size variations
export const Small: Story = {
  args: {
    id: 'small-select',
    label: 'Small Select',
    size: 'sm',
    options: basicOptions,
    placeholder: 'Small size',
  },
};

export const Medium: Story = {
  args: {
    id: 'medium-select',
    label: 'Medium Select',
    size: 'md',
    options: basicOptions,
    placeholder: 'Medium size (default)',
  },
};

export const Large: Story = {
  args: {
    id: 'large-select',
    label: 'Large Select',
    size: 'lg',
    options: basicOptions,
    placeholder: 'Large size',
  },
};

// State variations
export const Disabled: Story = {
  args: {
    id: 'disabled-select',
    label: 'Disabled Select',
    options: basicOptions,
    placeholder: 'This select is disabled',
    isDisabled: true,
    value: '2',
  },
};

export const ReadOnly: Story = {
  args: {
    id: 'readonly-select',
    label: 'Read-only Select',
    options: basicOptions,
    isReadOnly: true,
    value: '3',
  },
};

export const FullWidth: Story = {
  args: {
    id: 'fullwidth-select',
    label: 'Full Width Select',
    options: foodCategoryOptions,
    placeholder: 'This select takes full width',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

// Long list example
export const LongList: Story = {
  args: {
    id: 'long-list-select',
    label: 'Food Category',
    options: foodCategoryOptions,
    placeholder: 'Search and select a category',
    helperText: 'Use the search to quickly find categories in this long list.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with a long list of options. The search functionality helps users quickly find what they need.',
      },
    },
  },
};

// Custom search placeholder
export const CustomSearchPlaceholder: Story = {
  args: {
    id: 'custom-search-select',
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country',
    searchPlaceholder: 'Type to search countries...',
  },
};

// Custom no results text
export const CustomNoResultsText: Story = {
  args: {
    id: 'no-results-select',
    label: 'Food Category',
    options: foodCategoryOptions,
    placeholder: 'Select a category',
    noResultsText: 'No matching categories found. Try a different search term.',
  },
};

// Interactive controlled example
export const ControlledSelect: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    const [error, setError] = useState('');

    const handleChange = (option: SearchableSelectOption | null) => {
      if (option) {
        setValue(option.id);
        setError('');
      } else {
        setValue('');
      }
    };

    const handleValidation = () => {
      if (!value) {
        setError('Please select a food category');
      }
    };

    return (
      <div style={{ width: '300px' }}>
        <SearchableSelect
          id="controlled-select"
          label="Food Category"
          options={foodCategoryOptions}
          value={value}
          onChange={handleChange}
          onBlur={handleValidation}
          placeholder="Select a category"
          errorMessage={error}
          helperText={!error ? 'Required field with validation' : undefined}
          isRequired
        />
        {value && (
          <p style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
            Selected: <strong>{foodCategoryOptions.find(o => o.id === value)?.label}</strong>
          </p>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of a controlled select with validation on blur.',
      },
    },
  },
};

// Food ordering context examples
export const MerchantCategorySelector: Story = {
  args: {
    id: 'merchant-category',
    label: 'Primary Category',
    options: foodCategoryOptions,
    placeholder: 'Select your primary food category',
    helperText: 'This will be displayed to customers searching for restaurants.',
    isRequired: true,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Category selector for merchant onboarding in food ordering platform.',
      },
    },
  },
};

export const DeliveryCountrySelector: Story = {
  args: {
    id: 'delivery-country',
    label: 'Delivery Country',
    options: countryOptions,
    placeholder: 'Select your country',
    searchPlaceholder: 'Search countries...',
    isRequired: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Country selector for delivery address in checkout.',
      },
    },
  },
};

export const MultipleCategories: Story = {
  render: () => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const handleChange = (option: SearchableSelectOption | null) => {
      if (option && !selectedCategories.includes(option.id)) {
        setSelectedCategories([...selectedCategories, option.id]);
      }
    };

    const removeCategory = (id: string) => {
      setSelectedCategories(selectedCategories.filter(catId => catId !== id));
    };

    return (
      <div style={{ width: '400px' }}>
        <SearchableSelect
          id="multiple-categories"
          label="Food Categories"
          options={foodCategoryOptions.filter(opt => !selectedCategories.includes(opt.id))}
          placeholder="Add a category"
          helperText="You can add multiple categories"
          onChange={handleChange}
          value=""
        />
        {selectedCategories.length > 0 && (
          <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {selectedCategories.map(catId => {
              const category = foodCategoryOptions.find(opt => opt.id === catId);
              return (
                <span
                  key={catId}
                  style={{
                    padding: '4px 12px',
                    background: '#f0f0f0',
                    borderRadius: '16px',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {category?.label}
                  <button
                    onClick={() => removeCategory(catId)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0',
                      fontSize: '16px',
                      lineHeight: '1',
                    }}
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example showing how to use SearchableSelect for multiple selection use case.',
      },
    },
  },
};
