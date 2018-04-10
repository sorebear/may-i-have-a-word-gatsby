import React from 'react';
import PropTypes from 'prop-types';

const BasicModal = ({ children, className, showModal }) => (
  <div className="modal-mask" style={{ display: showModal ? 'flex' : 'none' }}>
    <div className={`modal ${className}`}>
      {children}
    </div>
  </div>
);

export default BasicModal;

BasicModal.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element.isRequired,
  showModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
};

BasicModal.defaultProps = {
  className: '',
};