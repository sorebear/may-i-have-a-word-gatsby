import React, { Component } from 'react';
import Link, { navigateTo } from 'gatsby-link';

import withAuthorization from '../components/auth/withAuthorization';
import firebase from 'firebase';
import { db } from '../firebase';

import BasicModal from '../components/ui/BasicModal';
import Hero from '../components/ui/Hero';
import { heroImgArr } from '../constants/images';

const fromObjectToList = (object) =>
  object
    ? Object.keys(object).map(key => ({ ...object[key], index: key }))
    : [];

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.deleteStory = this.deleteStory.bind(this);
    this.createNewStory = this.createNewStory.bind(this);
    this.updateNewStoryTitle = this.updateNewStoryTitle.bind(this);
    this.closeModalAndResetInput = this.closeModalAndResetInput.bind(this);
    this.uid = firebase.auth().currentUser.uid;
    this.tabs = ['all', 'novels', 'short-stories']
    this.state = {
      users: [],
      userStories: {},
      newStoryTitle: '',
      showCreateNewStoryModal: false,
      showDeleteConfirmationModal: false,
      deleteConfirmationIndex: null,
    };
  }

  componentDidMount() {
    this.getUserStories();
  }

  getUserStories() {
    db.getUserStories(this.uid).then(snapshot =>
      this.setState(() => ({ 
        userStories: snapshot.val()
      }))
    );
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
      this.getUserStories(this.state.uid);
      this.setState({ 
        showDeleteConfirmationModal: false, 
        deleteConfirmationIndex: null 
      });
    });
  }

  renderUserStories() {
    return fromObjectToList(this.state.userStories).map(story => {
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

  renderTabs() {
    return this.tabs.map((tab, index) => {
      return (
        <a key={tab} className="story-tab capitalize">{tab}</a>
      )
    })
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
        <div
          className="has-text-centered hero-image"
          style={{ backgroundImage: `url(${heroImgArr[Math.floor(Math.random() * heroImgArr.length)]})`}}
        >
          <h3 className="title">Your Stories</h3>
        </div>
        <section className="section container">
          <nav className="panel">
            <div className="panel-block">
              <p className="control has-icons-left">
                <span className="icon is-left">
                  <i className="fa fa-search" aria-hidden="true"/>
                </span>
                <input type="text" className="input" placeholder="search"/>
              </p>
            </div>
            <p className="panel-tabs">
              {this.renderTabs()}
            </p>
          </nav>
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
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);