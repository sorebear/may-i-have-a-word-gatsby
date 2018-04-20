import React, { Component } from 'react';

import { UserContext, UserProvider } from '../context/UserContext';
import AppContent from './AppContent';

const App = () => (
  <UserProvider>
    <UserContext.Consumer>
      {({ status, uid, userStories, activeStory, activeChapter, getUserStories }) => (
        <AppContent
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
);

export default withAuthentication(App);