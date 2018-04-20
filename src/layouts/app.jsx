import React from 'react';
import Navigation from '../components/ui/Navigation';

export default ({ children }) => (
<div className="app">
    <Navigation />
    <div className="container">
      {children()}
    </div>
  </div>
);