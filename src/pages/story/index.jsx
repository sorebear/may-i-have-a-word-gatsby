import React, { Component } from 'react';
import Link, { navigateTo } from 'gatsby-link';
import firebase from 'firebase';

import BasicModal from '../../components/UI/BasicModal';
import withAuthorization from '../../components/Session/withAuthorization';
import { db } from '../../firebase';

const fromObjectToList = (object) =>
  object
    ? Object.keys(object).map(key => ({ ...object[key], index: key }))
    : [];

class Story extends Component {
  constructor(props) {
    super(props);
    this.addNewChapter = this.addNewChapter.bind(this);
    this.updateNewChapterTitle = this.updateNewChapterTitle.bind(this);
    this.closeModalAndResetInput = this.closeModalAndResetInput.bind(this);
    this.uid = firebase.auth().currentUser.uid;
    this.storyId = null;
    this.storyTitle = null;
    this.state = {
      newChapterTitle: '',
      story : {},
      showNewChapterModal: false,
      showDeleteConfirmationModal: false,
    }
  }

  componentDidMount() {
    const querystring = document.URL.split('?')[1];
    console.log('Mounted', querystring);
    if (querystring) {
      const querystringArr = querystring.split('&');
      querystringArr.forEach((query) => {
        const splitQuerystringArr = query.split('=');
        this[splitQuerystringArr[0]] = splitQuerystringArr[1];
      });
    }

    this.getAllChapters();
  }

  getAllChapters() {
    db.getStory(this.uid, this.storyId ).then(snapshot =>
      this.setState({ story: snapshot.val() })
    );
  }

  renderChapters() {
    if (!this.state.story.chapters) {
      return <h5>You Currently Have No Chapters In Your Story</h5>
    }
    return fromObjectToList(this.state.story.chapters).map((chapter, index) => {
      return (
        <li className="panel-block justify-between" key={chapter.index}>
          <Link to={`/story/chapter/?storyTitle=${this.storyTitle}&storyId=${this.storyId}&chapterId=${chapter.index}`}>
            Chapter {index + 1}: {chapter.title.replace(/\_/g, ' ')}
          </Link>
          <button
            className="delete"
            onClick={() => this.setState({
              showDeleteConfirmationModal: chapter.title.replace(/\_/g, ' '),
              deleteConfirmationIndex: chapter.index
            })}
          />
        </li>
      )
    })
  }

  deleteChapter(chapterId) {
    db.deleteChapter(this.uid, this.storyId, chapterId).then(() => {
      this.getAllChapters();
      this.setState({ 
        showDeleteConfirmationModal: false, 
        deleteConfirmationIndex: null 
      });
    });
  }

  closeModalAndResetInput() {
    this.setState({
      showNewChapterModal: false,
      showDeleteConfirmationModal: false,
      newChapterTitle: '',
    });
  }

  updateNewChapterTitle(e) {
    this.setState({ newChapterTitle: e.target.value });
  }

  addNewChapter(e) {
    e.preventDefault();
    db.createNewChapter(this.uid, this.storyId, this.state.newChapterTitle).then((res) => {
      const chapterId = res.path.pieces_[res.path.pieces_.length - 1];
      navigateTo(`/story/chapter?storyTitle=${this.storyTitle}&storyId=${this.storyId}&chapterId=${chapterId}`)
    });
  }

  render() {
    console.log(this.state);
    if (!this.state.story.title) {
      return (
        <h3>Loading...</h3>
      );
    }
    return (
      <section className="section has-text-centered">
        <div>
          <h3 className="title is-primary">{this.state.story.title.replace('_', ' ')}</h3>
        </div>
        <ol className="panel">
          {this.renderChapters()}
        </ol>
        <button 
          className="button"
          onClick={() => this.setState({ showNewChapterModal: true }) }
        >
          Add New Chapter
        </button>
        <BasicModal showModal={this.state.showNewChapterModal}>
          <div className="modal-card">
            <form
              onSubmit={this.addNewChapter}
            >
              <header className="modal-card-head justify-between">
                <p className="modal-card-title">Create New Chapter</p>
                <button 
                  type="button"
                  className="delete"
                  onClick={this.closeModalAndResetInput}
                />
              </header>
              <section className="modal-card-body">
                <h3 className="title">Chapter Title</h3>
                <input 
                  type="text"
                  className="input"
                  onChange={this.updateNewChapterTitle}
                  value={this.state.newChapterTitle}
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
              <p className="modal-card-tile">Delete Chapter Confirmation</p>
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
                onClick={() => this.deleteChapter(this.state.deleteConfirmationIndex)}
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

export default withAuthorization(authCondition)(Story);