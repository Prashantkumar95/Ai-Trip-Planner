import React from 'react'

const CreateTrip = () => {
  return (
    <div className='sm:px-10 md:px-12 lg:px-56 xl:px-10 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>Tell us your travel prefrences</h2>
      <p className='mt-3 text-gray-500 text-xl'>Just provide some basic information,and our trip planner will generate a customized itinerary based onn your prefernces.</p>
        
        <div className='mt-20'>
          <div>
            <h2 className='text-xl my-3 font-medium'>What is your destination of choice ?</h2>
            <GooglePlacesAutocomplete 
              apiKey=''
            
            />
          </div>
        </div>
    
    
    
    </div>
  )
}

export default CreateTrip
