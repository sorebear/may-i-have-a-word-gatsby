import React from 'react';
import Navigation from '../components/ui/Navigation';

export default (props) => {
  return (
    <div className={`app ${props.status}`}>
      <Navigation />      
        {props.children()}
    </div>
  );
}