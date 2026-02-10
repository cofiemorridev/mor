import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">About Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded in Ghana, our mission is to bring the purest, most natural coconut oil 
            to homes around the world. We work directly with local farmers who have been 
            cultivating coconuts for generations.
          </p>
          <p className="text-gray-600 mb-4">
            Our process ensures that every drop of coconut oil maintains its natural 
            nutrients, flavor, and health benefits. We believe in sustainable farming 
            practices that respect both the environment and the communities we work with.
          </p>
        </div>
        <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
          <div className="text-6xl">🌴</div>
        </div>
      </div>
    </div>
  );
};

export default About;
