import React from 'react';

const hideSavedNotification = (e, hideToast) => {
  if (e.target.style.animation.includes('makeAToast')) {
    e.target.style.animation = "fadedToast 1s forwards";
  } else {
    hideToast();
  }
}

const Toast = ({ showToast, hideToast, children }) => (
  <div 
    className='message is-primary toast'
    style={{ animation: showToast ? 'makeAToast 1s forwards' : '' }}
    onAnimationEnd={(e) => hideSavedNotification(e, hideToast)}
  >
    <div className="message-header">
      <p>{children}</p>
    </div>
  </div>
);

export default Toast;