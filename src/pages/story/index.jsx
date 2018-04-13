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
        <li key={chapter.index}>
          <Link to={`/story/chapter/?storyTitle=${this.storyTitle}&storyId=${this.storyId}&chapterId=${chapter.index}`}>
            {chapter.title}
          </Link>
        </li>
      )
    })
  }

  closeModalAndResetInput() {
    this.setState({
      showNewChapterModal: false,
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
      <div>
        <div>
          <h3>{this.state.story.title.replace('_', ' ')}</h3>
        </div>
        <ol>
          {this.renderChapters()}
        </ol>
        <button onClick={() => this.setState({ showNewChapterModal: true }) }>
          Add New Chapter
        </button>
        <BasicModal showModal={this.state.showNewChapterModal}>
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
              onSubmit={this.addNewChapter}
            >
              <h3>Add New Chapter</h3>
              <input 
                onChange={this.updateNewChapterTitle}
                value={this.state.newChapterTitle}
              />
              <button type="submit">
                Create
              </button>
            </form>
          </div>
        </BasicModal>
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Story);