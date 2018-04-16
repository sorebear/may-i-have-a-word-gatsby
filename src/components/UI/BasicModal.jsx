import React from 'react';
import PropTypes from 'prop-types';

const BasicModal = ({ children, className, showModal }) => (
  <div className="modal" style={{ display: showModal ? 'flex' : 'none' }}>
    <div className="modal-background" />
    {children}
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