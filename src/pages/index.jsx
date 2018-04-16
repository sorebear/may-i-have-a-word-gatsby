import React from 'react';
import Link from 'gatsby-link';

const LandingPage = () =>
  <section className="section is-medium">
    <h1 className="title">May I Have A Word</h1>
    <p>The Landing Page is open to everyone, even though the user isn't signed in.</p>
    <Link to="/home">
      <button className="button">
        Start Writing
      </button>
    </Link>
  </section>

export default LandingPage;
