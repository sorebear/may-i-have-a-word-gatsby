import React, { Component } from 'react';
import Link, { navigateTo } from 'gatsby-link';
import firebase from 'firebase';

import BasicModal from '../../components/UI/BasicModal';
import withAuthorization from '../../components/auth/withAuthorization';
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
    this.tabs = ['chapters', 'characters', 'locations', 'notes'];
    this.state = {
      newChapterTitle: '',
      story : {},
      selectedList: 'chapters',
      showNewChapterModal: false,
      showDeleteConfirmationModal: false,
    }
  }

  componentDidMount() {
    const querystring = document.URL.split('?')[1];
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

  updateSelectedList(newList) {
    this.setState({ selectedList: newList });
  }

  renderChapters() {
    if (!this.state.story[this.state.selectedList]) {
      return (
        <div className="panel-block" style={{ justifyContent: 'center'}}>
          You currently have no {this.state.selectedList} in your story.
        </div>
      );
    }
    return fromObjectToList(this.state.story[this.state.selectedList]).map((chapter, index) => {
      return (
        // <li className="panel-block justify-between" key={chapter.index}>
        //   <Link to={`/story/chapter/?storyTitle=${this.storyTitle}&storyId=${this.storyId}&chapterId=${chapter.index}`}>
        //     Chapter {index + 1}: {chapter.title.replace(/\_/g, ' ')}
        //   </Link>
          // <button
          //   className="delete"
          //   onClick={() => this.setState({
          //     showDeleteConfirmationModal: chapter.title.replace(/\_/g, ' '),
          //     deleteConfirmationIndex: chapter.index
          //   })}
        //   />
        // </li>
        <Link 
          key={chapter.index}
          className="panel-block"
          to={`/story/chapter/?storyTitle=${this.storyTitle}&storyId=${this.storyId}&chapterId=${chapter.index}`}
        >          
          <span className="panel-icon">
            <i className="fa fa-book" aria-hidden="true"></i>
          </span>
          Chapter {index + 1}: {chapter.title.replace(/\_/g, ' ')}
        </Link>
      )
    })
  }

  renderTabs() {
    const { selectedList } = this.state;
    return this.tabs.map(tab => {
      return (
        <a
          key={tab} 
          className={`story-tab capitalize ${tab === selectedList ? 'is-active' : ''}`}
          onClick={() => this.setState({ selectedList: tab})}
        >
          {tab}
        </a>
      )
    });
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
    if (!this.state.story.title) {
      return (
        <h3>Loading...</h3>
      );
    }
    return (
      <section className="section container has-text-centered">
        <nav className="panel">
          <h3 className="panel-heading">
            {this.state.story.title.replace(/\_/g, ' ')}
          </h3>
          <div className="panel-block">
            <p className="control has-icons-left">
              <input type="text" className="input mb-0" placeholder="Search" />
              <span className="icon is-small is-left">
                <i className="fa fa-search" aria-hidden="true"></i>
              </span>
            </p>
          </div>
          <p className="panel-tabs">
            {this.renderTabs()}
          </p>
          {this.renderChapters()}
          <div className="panel-block" style={{ justifyContent: 'center' }}>
            <button
              className="button is-link is-outlined capitalize"
              onClick={() => this.setState({ showNewChapterModal: true }) }
            >
              Add New {this.state.selectedList.slice(0, this.state.selectedList.length - 1)}
            </button>
          </div>
        </nav>
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