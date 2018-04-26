import React from 'react';

import SignInForm from '../components/auth/SignIn';
import { SignUpLink } from '../components/auth/SignUp';
import { PasswordForgetLink } from '../components/auth/PasswordForget';

const SignInPage = () =>
  <section className="section container">
    <h2 className="title">Sign In</h2>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </section>

export default SignInPage;