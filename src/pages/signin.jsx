import React from 'react';

import SignInForm from '../components/SignIn';
import { SignUpLink } from '../components/SignUp';
import { PasswordForgetLink } from '../components/PasswordForget';

const SignInPage = () =>
  <section className="section">
    <h2 className="title">Sign In</h2>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </section>

export default SignInPage;