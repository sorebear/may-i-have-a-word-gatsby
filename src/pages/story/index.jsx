import React, { Component } from 'react';
import Link, { navigateTo } from 'gatsby-link';
import firebase from 'firebase';

import { db } from '../../firebase';
import { heroImgArr } from '../../constants/images';
import BasicModal from '../../components/UI/BasicModal';
import NeWChapterModal from '../../components/UI/NewChapterModal';
import Hero from '../../components/UI/Hero';
import withAuthorization from '../../components/auth/withAuthorization';
import { isAbsolute } from 'path';

const fromObjectToList = (object) =>
  object
    ? Object.keys(object).map(key => ({ ...object[key], index: key }))
    : [];

class Story extends Component {
  constructor(props) {
    super(props);
    this.editChapter = this.editChapter.bind(this);
    this.createNewChapter = this.createNewChapter.bind(this);
    this.saveStoryUpdates = this.saveStoryUpdates.bind(this);
    this.updateChapterTitleInput = this.updateChapterTitleInput.bind(this);
    this.closeModalAndResetInput = this.closeModalAndResetInput.bind(this);
    this.uid = firebase.auth().currentUser.uid;
    this.storyId = null;
    this.storyTitle = null;
    this.tabs = ['chapters', 'characters', 'locations', 'notes'];
    this.state = {
      chapterTitleInput: '',
      story : {},
      selectedList: 'chapters',
      showNewChapterModal: false,
      showEditModal: '',
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

  editChapter(e, chapterIndex) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      chapterTitleInput: this.state.story.chapters[chapterIndex].title.replace(/\_/g, ' '),
      showEditModal: chapterIndex
    });
  }

  updateSelectedList(newList) {
    this.setState({ selectedList: newList });
  }

  saveStoryUpdates(e) {
    e.preventDefault();
    console.log('Saving');
    const { chapterTitleInput, showEditModal } = this.state
    db.saveStory(this.uid, this.storyId, showEditModal, chapterTitleInput.replace(/\ /g, '_')).then(() => {
      this.getAllChapters();
    });
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
        <Link
          key={chapter.index}
          className="panel-block"
          to={`/story/chapter/?storyTitle=${this.storyTitle}&storyId=${this.storyId}&chapterId=${chapter.index}`}
        >          
          <span className="panel-icon">
            <i className="fa fa-book" aria-hidden="true"></i>
          </span>
          Chapter {index + 1}: {chapter.title.replace(/\_/g, ' ')}
          <button 
            onClick={(e) => this.editChapter(e, chapter.index)}
            className="edit"
          >
          <i className="fa fa-cog fa-lg" />
          </button>
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

  deleteChapter() {
    db.deleteChapter(this.uid, this.storyId, this.state.showEditModal).then(() => {
      this.getAllChapters();
      this.setState({ 
        showEditModal: '', 
      });
    });
  }

  closeModalAndResetInput() {
    this.setState({
      showNewChapterModal: false,
      showEditModal: false,
      chapterTitleInput: '',
    });
  }

  updateChapterTitleInput(e) {
    this.setState({ chapterTitleInput: e.target.value });
  }

  createNewChapter(e) {
    e.preventDefault();
    db.createNewChapter(this.uid, this.storyId, this.state.chapterTitleInput).then((res) => {
      const chapterId = res.path.pieces_[res.path.pieces_.length - 1];
      navigateTo(`/story/chapter?storyTitle=${this.storyTitle}&storyId=${this.storyId}&chapterId=${chapterId}`)
    });
  }

  render() {
    if (!this.state.story.title) {
      return (
        <h3>Loading...</h3>
      );
    };
    const { chapterTitleInput, story, selectedList, showEditModal, showNewChapterModal } = this.state;
    const selectedChapterTitle = story.chapters[showEditModal] ? story.chapters[showEditModal].title.replace(/\_/g, ' ') : '';
    return (
      <div>
        <Hero>
            {story.title.replace(/\_/g, ' ')}
        </Hero>
        <section className="section container has-text-centered">
          <nav className="panel">
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
                Add New {selectedList.slice(0, selectedList.length - 1)}
              </button>
            </div>
          </nav>
          <BasicModal showModal={showNewChapterModal}>
            <NeWChapterModal onSubmit={this.createNewChapter} hideModal={this.closeModalAndResetInput} />
          </BasicModal>
          <BasicModal showModal={showEditModal}>
            <div className="modal-card has-text-left">
              <form onSubmit={this.saveStoryUpdates}>
                <header className="modal-card-head justify-between">
                  <p className="modal-card-tile">
                    Edit Chapter - {selectedChapterTitle}
                  </p>
                  <button 
                    type="button"
                    className="delete"
                    aria-label="close"
                    onClick={this.closeModalAndResetInput}
                  />
                </header>
                <section className="modal-card-body">                    
                  <h3 className="title">Chapter Title</h3>
                  <input 
                    type="text"
                    className="input"
                    name="edit-chapter-title"
                    onChange={this.updateChapterTitleInput}
                    value={chapterTitleInput}
                    required
                  />
                  <h3 className="title">Delete Chapter</h3>
                  <p className="subtitle">You cannot undo this action.</p>
                  <button
                    type="button"
                    className="button is-danger"
                    onClick={() => this.deleteChapter()}
                  >
                    Yes, Delete
                  </button>
                </section>
                <footer className="modal-card-foot justify-center">
                  <button 
                    type="button"
                    className="close-modal-button button"
                    onClick={this.closeModalAndResetInput}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="button is-success"
                  >
                    Save Changes
                  </button>
                </footer>
              </form>
            </div>
          </BasicModal>
        </section>
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Story);