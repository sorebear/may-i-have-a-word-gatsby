import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import App from './app';
import withAuthentication from '../components/session/withAuthentication';
import { UserProvider, UserContext } from '../context/UserContext';

import './main.css';
// import '../scss/main.scss';

const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet
      title="May I Have A Word"
      meta={[
        { name: 'description', content: 'A Story Writing App Built with Gatsby and Firebase' },
        { name: 'keywords', content: 'Gatsby Firebase Writing Authentication Story' },
      ]}
    />
    <UserProvider>
      <UserContext.Consumer>
        {({ status, uid, userStories, activeStory, activeChapter, getUserStories }) => (
          <App
            children={children}
            status={status}
            uid={uid}
            userStories={userStories}
            activeStory={activeStory}
            activeChapter={activeChapter}
            getUserStories={getUserStories}
          />
        )}
      </UserContext.Consumer>
    </UserProvider>
  </div>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default withAuthentication(TemplateWrapper)
