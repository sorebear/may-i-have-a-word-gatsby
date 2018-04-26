/* globals window */

import React from 'react';
import { hydrate } from 'emotion';
import { Router } from 'react-router-dom';

import { UserContext, UserProvider } from './src/context/UserContext';

exports.replaceRouterComponent = ({ history }) => {
  const ConnectedRouterWrapper = ({ children }) => (
    <UserProvider>
      <UserContext.Consumer>
        {({ status, uid, userStories, activeStory, activeChapter, getUserStories }) => (
          <Router
            history={history}
            status={status}
            uid={uid}
            userStories={userStories}
            activeStory={activeStory}
            activeChapter={activeChapter}
            getUserStories={getUserStories}
          >
            {children}
          </Router>
        )}
      </UserContext.Consumer>
    </UserProvider>
  );

  return ConnectedRouterWrapper;
};

exports.onClientEntry = () => {
  if (
    /* eslint-disable no-underscore-dangle */
    typeof window !== `undefined` &&
    typeof window.__EMOTION_CRITICAL_CSS_IDS__ !== `undefined`
  ) {
    hydrate(window.__EMOTION_CRITICAL_CSS_IDS__);
  }
};
