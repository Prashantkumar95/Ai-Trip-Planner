// import React from 'react'

// /* Add this style block or use a CSS file as needed */
// const footerStyle = {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     padding: '20px 0',
//     background: '#f8f8f8'
// };

// const emojiStyle = { marginRight: '8px' };

// // Update the Footer component to use the styles and emojis
// const Footer = () => {
//     return (
//         <div style={footerStyle}>
//             <h2>
//                 <span role="img" aria-label="rocket" style={emojiStyle}>🚀</span>
//                 Created By Sarthi AI Trip Planner
//                 <span role="img" aria-label="map" style={emojiStyle}>🗺️</span>
//             </h2>
//             <p>
//                 <span role="img" aria-label="copyright" style={emojiStyle}>©</span>
//                 All rights reserved 2025
//             </p>
//         </div>
//     );
// };

// export default Footer;

import React from "react";
import { MapPinned, Mail, Phone, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-black border-t border-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPinned className="text-white" size={28} />
              <h1 className="text-2xl font-bold text-white">
                Sarthi AI Trip Planner
              </h1>
            </div>

            <p className="text-sm leading-6 text-gray-400">
              Smart AI-powered travel planning platform that helps users
              generate personalized itineraries, discover hotels, and explore
              destinations effortlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h2>

            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/"
                  className="hover:text-white transition duration-300"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="/create-trip"
                  className="hover:text-white transition duration-300"
                >
                  Create Trip
                </a>
              </li>

              <li>
                <a
                  href="/about"
                  className="hover:text-white transition duration-300"
                >
                  About
                </a>
              </li>

              <li>
                <a
                  href="/contact"
                  className="hover:text-white transition duration-300"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              Contact
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span>support@sarthiai.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} />
                <span>+91 9xxxxxxx</span>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-4 pt-3">
                <a
                  href="#"
                  className="hover:text-white transition duration-300"
                >
                  <Github size={20} />
                </a>

                <a
                  href="#"
                  className="hover:text-white transition duration-300"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          © 2026 Sarthi AI Trip Planner. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;