import React from 'react';

import { auth } from '../../firebase';

const SignOutButton = () =>
  <button
    type="button"
    className="button"
    onClick={auth.doSignOut}
  >
    Sign Out
  </button>

export default SignOutButton;
