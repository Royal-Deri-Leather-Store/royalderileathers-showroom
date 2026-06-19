import React, { useState, useEffect } from 'react';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import Menu from './Menu';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#home');

  useEffect(() => {
    const handleHashChange = () => {
      // Clean up hash values to prevent scroll issues on page change
      setCurrentPath(window.location.hash || '#home');
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Simple router logic
  if (currentPath === '#about') {
    return <About />;
  }
  if (currentPath.startsWith('#contact')) {
    return <Contact />;
  }
  if (currentPath.startsWith('#menu')) {
    return <Menu />;
  }

  return <Home />;
}

export default App;
