import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';

import SignOutButton from '../SignOut';
import * as routes from '../../constants/routes';

const Navigation = (props, { authUser }) =>
  <div>
    { authUser
        ? <NavigationAuth />
        : <NavigationNonAuth />
    }
  </div>

Navigation.contextTypes = {
  authUser: PropTypes.object,
};

const NavigationAuth = () =>
  <div className="navbar" role="navigation" aria-label="main navigation">
    <ul className="navbar-brand">
      <li className="navbar-item"><Link to={routes.LANDING}>Landing</Link></li>
      <li className="navbar-item"><Link to={routes.HOME}>Home</Link></li>
    </ul>
    <ul className="navbar-end">
      <li className="navbar-item"><Link to={routes.ACCOUNT}>Account</Link></li>
      <li className="navbar-item"><SignOutButton /></li>
    </ul>
  </div>

const NavigationNonAuth = () =>
  <div className="navbar" role="navigation" aria-label="main navigation">
    <ul className="navbar-brand">
      <li className="navbar-item"><Link to={routes.LANDING}>Landing</Link></li>
      <li className="navbar-item"><Link to={routes.SIGN_IN}>Sign In</Link></li>
    </ul>
  </div>

export default Navigation;
