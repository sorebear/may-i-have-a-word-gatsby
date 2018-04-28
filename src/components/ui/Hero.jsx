import React from 'react';

import { heroImgArr } from '../../constants/images';

const randomNum = Math.floor(Math.random() * heroImgArr.length);

export default ({ children }) => (
  <div
    className="hero-image"
    style={{ 
      backgroundImage: 
        `linear-gradient(rgba(51, 51, 51, .5), rgba(51, 51, 51, .3)),
        url(${heroImgArr[randomNum]})`
    }}
  >
    <h3 className="title">
      { children }
    </h3>
  </div>
)