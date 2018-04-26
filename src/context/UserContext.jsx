import React from 'react';
import { db, firebase } from '../firebase';

const fromObjectToList = (object) =>
  object
    ? Object.keys(object).map(key => ({ ...object[key], index: key }))
    : [];

export const UserContext = React.createContext();

export class UserProvider extends React.Component {
  state = {
    status: "uninitialized",
    uid: "",
    userStories: {},
    activeStory: {},
    activeChapter: {},
  }

  getUserStories = (uid) => {
    db.getUserStories(uid).then(snapshot =>
      this.setState(() => ({ 
        status: "loaded",
        uid: uid,
        userStories: snapshot.val()
      }))
    );
  }

  deleteStory = (storyId) => {
    db.deleteStory(this.state.uid, storyId).then(() => {
      this.getUserStories(this.state.uid);
    });
  }

  render() {
    return (
    <UserContext.Provider 
      value={{ 
        ...this.state, 
        getUserStories: this.getUserStories,
        deleteStory: this.deleteStory
      }}
    >
      {this.props.children}
    </UserContext.Provider>
    )
  }
}