import React from 'react';
import PropTypes from 'prop-types';

import { PasswordForgetForm } from '../components/auth/PasswordForget';
import PasswordChangeForm from '../components/auth/PasswordChange';
import withAuthorization from '../components/session/withAuthorization';

const AccountPage = (props, { authUser }) => {
  const creationDate = new Date(authUser.metadata.creationTime);
  return (
    <section className="section">
      <h1 className="title">Account: {authUser.email}</h1>
      <h4 className="subtitle">Member Since: {creationDate.toLocaleDateString()}</h4>
      <PasswordForgetForm />
      <PasswordChangeForm />
    </section>
  )
}

AccountPage.contextTypes = {
  authUser: PropTypes.object,
};

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(AccountPage);