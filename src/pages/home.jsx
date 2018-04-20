import React, { Component } from 'react';
import Link, { navigateTo } from 'gatsby-link';

import withAuthorization from '../components/session/withAuthorization';
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
      deleteConfirmationIndex: null,
    };
  }

  componentDidMount() {
    const { status, getUserStories } = this.props;
    if (status === 'uninitialized') {
      getUserStories(firebase.auth().currentUser.uid);
    }
  }

  updateNewStoryTitle(e) {
    this.setState({ newStoryTitle: e.target.value });
  }

  createNewStory(e) {
    e.preventDefault();
    const newStoryTitle = this.state.newStoryTitle.replace(/\ /g, '_');
    db.createNewStory( this.uid, newStoryTitle).then((res) => {
      const storyId = res.path.pieces_[res.path.pieces_.length - 1];
      navigateTo(`/story/index.html?storyTitle=${this.state.newStoryTitle}&storyId=${storyId}`);
    });
  }

  deleteStory(storyId) {
    db.deleteStory(this.uid, storyId).then(() => {
      this.getCurrentUserStories();
      this.setState({ 
        showDeleteConfirmationModal: false, 
        deleteConfirmationIndex: null 
      });
    });
  }

  renderUserStories() {
    return this.state.userStories.map(story => {
      return (
        <li className="panel-block justify-between" key={story.index}>
          <Link to={`/story/index.html?storyTitle=${story.title}&storyId=${story.index}`}>
            {story.title.replace(/\_/g, ' ')}
          </Link>
          <button
            onClick={() => this.setState({
              showDeleteConfirmationModal: story.title.replace(/\_/g, ' '),
              deleteConfirmationIndex: story.index
            })}
          >
            <div className="delete is-danger" />
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
    console.log('Props:', this.props);
    return (
      <section className="section">
        <div className="has-text-centered mb-3">
          <h3 className="title">Your Stories</h3>
        </div>
        <ul className="panel">
          {this.renderUserStories()}
        </ul>
        <div className="has-text-centered">
          <button
            className="button"
            onClick={() => this.setState({ showCreateNewStoryModal: true })}
          >
            Create New Story
          </button>
        </div>
        <BasicModal showModal={this.state.showCreateNewStoryModal}>
          <div className="modal-card">
            <form
              onSubmit={this.createNewStory}
            >
              <header className="modal-card-head justify-between">
                <p className="modal-card-tile">Create New Story</p>
                <button
                  type="button"
                  className="delete"
                  aria-label="close"
                  onClick={this.closeModalAndResetInput}
                />
              </header>
              <section className="modal-card-body has-text-centered">
                <h3 className="title">Story Title</h3>
                <input 
                  className="input"
                  type="text"
                  onChange={this.updateNewStoryTitle}
                  value={this.state.newStoryTitle}
                  name="story-title"
                  required
                />
              </section>
              <footer className="modal-card-foot justify-center">
                <button 
                  className="button"
                  type="submit"
                >
                  Create
                </button>
              </footer>
            </form>
          </div>
        </BasicModal>
        <BasicModal showModal={this.state.showDeleteConfirmationModal}>
          <div className="modal-card">
            <header className="modal-card-head justify-between">
              <p className="modal-card-tile">Delete Confirmation</p>
              <button 
                className="delete"
                aria-label="close"
                onClick={this.closeModalAndResetInput}
              />
            </header>
            <section className="modal-card-body has-text-centered">
              <p>
                Are you sure you want to delete
              </p>
              <h3 className="title">
                "{this.state.showDeleteConfirmationModal}"
              </h3>
            </section>
            <footer className="modal-card-foot justify-center">
              <button 
                type="button"
                className="close-modal-button button"
                onClick={this.closeModalAndResetInput}
                >
                No, Don't Delete
              </button>
              <button
                className="button is-danger"
                onClick={() => this.deleteStory(this.state.deleteConfirmationIndex)}
              >
                Yes, Delete
              </button>
            </footer>
          </div>
        </BasicModal>
      </section>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);