import React, { Component } from 'react';
import Link from 'gatsby-link';

import withAuthorization from '../components/Session/withAuthorization';
import firebase from 'firebase';
import { db } from '../firebase';

const fromObjectToList = (object) =>
  object
    ? Object.keys(object).map(key => ({ ...object[key], index: key }))
    : [];

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.createNewStory = this.createNewStory.bind(this);
    this.updateNewStoryTitle = this.updateNewStoryTitle.bind(this);
    this.deleteStory = this.deleteStory.bind(this);
    this.uid = firebase.auth().currentUser.uid;
    this.state = {
      users: [],
      userStories: [],
      newStoryTitle: '',
    };
  }

  componentDidMount() {
    this.getCurrentUserStories();
  }

  updateNewStoryTitle(e) {
    this.setState({ newStoryTitle: e.target.value });
  }

  deleteStory(storyId) {
    db.deleteStory(this.uid, storyId).then(() => {
      this.getCurrentUserStories();
    });
  }

  getCurrentUserStories() {
    db.getUserStories(this.uid).then(snapshot =>
      this.setState(() => ({ userStories: fromObjectToList(snapshot.val()) }))
    );
  }

  renderUserStories() {
    return this.state.userStories.map(story => {
      return (
        <li key={story.index}>
          {story.title}
          &nbsp;&nbsp;
          <button
            onClick={() => this.deleteStory(story.index)}
          >
            Delete Story
          </button>
        </li>
      );
    });
  }

  createNewStory(e) {
    const { newStoryTitle } = this.state;
    e.preventDefault();
    db.createNewStory( this.uid, newStoryTitle).then((res) => {
      this.getCurrentUserStories()
    });
  }

  render() {
    const { users } = this.state;
    return (
      <div>
        <form>
          <input 
            onChange={this.updateNewStoryTitle.bind(this)}
            value={this.state.newStoryTitle}
          />
          <button
            onClick={this.createNewStory}
          >
            Create New Story
          </button>
        </form>
        <h3>Your Stories</h3>
        <ul>
          {this.renderUserStories()}
        </ul>

      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);