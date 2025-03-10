import React from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const CreateTrip = () => {
  const handlePlaceSelect = (place) => {
    console.log('Selected place:', place);
    // You can handle the selected place here, e.g., store it in state or pass it to a parent component
  };

  return (
    <div className='sm:px-10 md:px-12 lg:px-56 xl:px-10 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>Tell us your travel preferences</h2>
      <p className='mt-3 text-gray-500 text-xl'>
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>

      <div className='mt-20'>
        <div>
          <h2 className='text-xl my-3 font-medium'>What is your destination of choice?</h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              onChange: handlePlaceSelect,
              placeholder: 'Search for a place...',
              styles: {
                control: (provided) => ({
                  ...provided,
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#cbd5e0',
                  },
                }),
                option: (provided) => ({
                  ...provided,
                  color: '#4a5568',
                }),
                menu: (provided) => ({
                  ...provided,
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }),
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;