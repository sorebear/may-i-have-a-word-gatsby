import React, { Component } from 'react';
import Link from 'gatsby-link';

import withAuthorization from '../components/Session/withAuthorization';
import firebase from 'firebase';
import { db } from '../firebase';

import BasicModal from '../components/UI/BasicModal';

const fromObjectToList = (object) =>
  object
    ? Object.keys(object).map(key => ({ ...object[key], index: key }))
    : [];

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.createNewStory = this.createNewStory.bind(this);
    this.updateNewStoryTitle = this.updateNewStoryTitle.bind(this);
    this.closeModalAndResetInput = this.closeModalAndResetInput.bind(this);
    this.deleteStory = this.deleteStory.bind(this);
    this.uid = firebase.auth().currentUser.uid;
    this.state = {
      users: [],
      userStories: [],
      newStoryTitle: '',
      showCreateNewStoryModal: false,
      showDeleteConfirmationModal: false,
    };
  }

  componentDidMount() {
    this.getCurrentUserStories();
  }

  getCurrentUserStories() {
    db.getUserStories(this.uid).then(snapshot =>
      this.setState(() => ({ userStories: fromObjectToList(snapshot.val()) }))
    );
  }

  updateNewStoryTitle(e) {
    this.setState({ newStoryTitle: e.target.value });
  }

  createNewStory(e) {
    e.preventDefault();
    const newStoryTitle = this.state.newStoryTitle.replace(' ', '_');
    db.createNewStory( this.uid, newStoryTitle).then((res) => {
      // this.getCurrentUserStories();
      const storyId = res.path.pieces_[res.path.pieces_.length - 1];
      this.props.history.push(`/story/?storyTitle=${this.state.newStoryTitle}&storyId=${storyId}`);
    });
  }

  deleteStory(storyId) {
    db.deleteStory(this.uid, storyId).then(() => {
      this.getCurrentUserStories();
    });
  }

  renderUserStories() {
    return this.state.userStories.map(story => {
      return (
        <li key={story.index}>
          <Link to={`/story/?storyTitle=${story.title}&storyId=${story.index}`}>
            {story.title.replace('_', ' ')}
          </Link>
          <button
            onClick={() => this.setState({ showDeleteConfirmationModal: story.title })}
          >
            Delete Story
          </button>
        </li>
      );
    });
  }

  closeModalAndResetInput() {
    this.setState({
      showCreateNewStoryModal: false,
      showDeleteConfirmationModal: '',
      newStoryTitle: ''
    });
  }

  render() {
    return (
      <div>
        <button
          onClick={() => this.setState({ showCreateNewStoryModal: true })}
        >
          Create New Story
        </button>
        <h3>Your Stories</h3>
        <ul>
          {this.renderUserStories()}
        </ul>
        <BasicModal showModal={this.state.showCreateNewStoryModal}>
          <div>
            <button 
              type="button"
              className="close-modal-button"
              onClick={this.closeModalAndResetInput}
            >
              <img 
                src="https://res.cloudinary.com/sorebear/image/upload/v1521228838/svg-icons/ess-light/essential-light-10-close-big.svg"
                alt="close" 
              />
            </button>
            <form
              onSubmit={this.createNewStory}
            >
              <h3>Create New Story</h3>
              <input 
                onChange={this.updateNewStoryTitle}
                value={this.state.newStoryTitle}
              />
              <button type="submit">
                Create
              </button>
            </form>
          </div>
        </BasicModal>
        <BasicModal showModal={this.state.showDeleteConfirmationModal}>
          <div>
            <button 
              type="button"
              className="close-modal-button"
              onClick={this.closeModalAndResetInput}
            >
              <img 
                src="https://res.cloudinary.com/sorebear/image/upload/v1521228838/svg-icons/ess-light/essential-light-10-close-big.svg"
                alt="close" 
              />
            </button>
            <h3>
              Are you sure you want to delete "{this.state.showDeleteConfirmationModal}"
            </h3>
            <button
              onClick={() => this.deleteStory(story.index)}
            >
              Yes, Delete
            </button>
            <button 
              onClick={this.closeModalAndResetInput}
            >
              No, Don't Delete
            </button>
          </div>
        </BasicModal>
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);