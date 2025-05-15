import React from 'react'

/* Add this style block or use a CSS file as needed */
const footerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '20px 0',
    background: '#f8f8f8'
};

const emojiStyle = { marginRight: '8px' };

// Update the Footer component to use the styles and emojis
const Footer = () => {
    return (
        <div style={footerStyle}>
            <h2>
                <span role="img" aria-label="rocket" style={emojiStyle}>🚀</span>
                Created By Sarthi AI Trip Planner
                <span role="img" aria-label="map" style={emojiStyle}>🗺️</span>
            </h2>
            <p>
                <span role="img" aria-label="copyright" style={emojiStyle}>©</span>
                All rights reserved 2025
            </p>
        </div>
    );
};

export default Footer;