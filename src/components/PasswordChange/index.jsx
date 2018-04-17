import React, { Component } from 'react';

import { auth } from '../../firebase';
import Toast from '../UI/Toast';

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
  showToast: false,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);
    this.hideToast = this.hideToast.bind(this);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { passwordOne } = this.state;

    auth.doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE, showToast: true }));
      })
      .catch(error => {
        this.setState(updateByPropertyName('error', error));
      });

    event.preventDefault();
  }

  hideToast() {
    this.setState({ showToast: false });
  }

  render() {
    const {
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '';

    return (
      <form onSubmit={this.onSubmit} className="mb-3">
        <input
          className="input"
          value={passwordOne}
          onChange={event => this.setState(updateByPropertyName('passwordOne', event.target.value))}
          type="password"
          placeholder="New Password"
        />
        <input
          className="input"
          value={passwordTwo}
          onChange={event => this.setState(updateByPropertyName('passwordTwo', event.target.value))}
          type="password"
          placeholder="Confirm New Password"
        />
        <button 
          className="button"
          disabled={isInvalid} 
          type="submit"
        >
          Reset My Password
        </button>

        { error && <p>{error.message}</p> }
        <Toast showToast={this.state.showToast} hideToast={this.hideToast}>
          Password Changed
        </Toast>
      </form>
    );
  }
}

export default PasswordChangeForm;