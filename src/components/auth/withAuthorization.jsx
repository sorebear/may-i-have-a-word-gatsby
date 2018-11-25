import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { firebase, db } from '../../firebase';
import * as routes from '../../constants/routes';

const withAuthorization = (condition) => (Component) => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      firebase.auth.onAuthStateChanged(authUser => {
        if (!condition(authUser)) {
          this.props.history.push(routes.SIGN_IN);
        }
      }); 
    }

    render() {
      return this.context.authUser ? <Component { ...this.props } /> : null;
    }
  }

  WithAuthorization.contextTypes = {
    authUser: PropTypes.object,
  };

  return withRouter(WithAuthorization);
}

export default withAuthorization;