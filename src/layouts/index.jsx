import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import withAuthentication from '../components/session/withAuthentication';
import Navigation from '../components/ui/Navigation';

// import './main.css';
import '../scss/main.scss';

const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet
      title="May I Have A Word"
      meta={[
        { name: 'description', content: 'A Story Writing App Built with Gatsby and Firebase' },
        { name: 'keywords', content: 'Gatsby Firebase Writing Authentication Story' },
      ]}
    />
    <div className="app">
      <Navigation />
      <div className="container">
        {children()}
      </div>
    </div>
  </div>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default withAuthentication(TemplateWrapper)
