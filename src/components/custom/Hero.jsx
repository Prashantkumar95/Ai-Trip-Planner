import React from 'react';
import { Button } from '../ui/button';

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/30"></div>
        <img 
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2560&q=80"
          alt="Travel background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 py-28 px-4 sm:px-10 lg:px-32 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white drop-shadow-lg">
            <span className="text-orange-300">
              Discover Your Next Adventure with AI
            </span>
            <br />
            <span className="text-white">
              Personalized Itineraries at Your Fingertips
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-100 max-w-2xl drop-shadow-md">
            Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <a href="/create-trip">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg transition-all duration-300 hover:scale-105">
                Get Started, It's Free
              </Button>
            </a>
            
            
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((item) => (
                  <img 
                    key={item}
                    src={`https://randomuser.me/api/portraits/${item % 2 === 0 ? 'women' : 'men'}/${item+20}.jpg`}
                    alt="User"
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <span className="text-white text-sm">500+ Happy Travelers</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white text-sm">4.9/5 (1200+ Reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Travel Icons */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-8 opacity-70">
        {['✈️', '🏨', '🌴', '🗺️', '🍽️'].map((icon, index) => (
          <span 
            key={index}
            className="text-3xl animate-float"
            style={{ animationDelay: `${index * 0.5}s` }}
          >
            {icon}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Hero;