import React, { Component } from 'react';
import firebase from 'firebase';
import Link, { navigateTo } from 'gatsby-link';

import withAuthorization from '../../components/session/withAuthorization';
import Toast from '../../components/UI/Toast';
import { db } from '../../firebase';

const fromObjectToList = (object) =>
  object
    ? Object.keys(object).map(key => ({ ...object[key], index: key }))
    : [];

class Chapter extends Component {
  constructor(props) {
    super(props);
    this.updateChapterText = this.updateChapterText.bind(this);
    this.handleReturnOrTab = this.handleReturnOrTab.bind(this);
    this.changeChapter = this.changeChapter.bind(this);
    this.saveChapter = this.saveChapter.bind(this);
    this.hideToast = this.hideToast.bind(this);
    this.uid = firebase.auth().currentUser.uid;
    this.storyTitle = null;
    this.storyId = null;
    this.chapterId = null;
    this.state = {
      chapter: {},
      story: {},
      selectionEnd: 0,
      resetSelection: false,
      editable: false,
      showToast: false,
      showSideMenu: false,
      chapterSaved: true,
    };
  }

  componentDidMount() {
    this.readQuerystring();
    this.getStory();
    this.getChapter();
  }

  readQuerystring() {
    const querystring = document.URL.split('?')[1];
    if (querystring) {
      const querystringArr = querystring.split('&');
      querystringArr.forEach((query) => {
        const splitQuerystringArr = query.split('=');
        this[splitQuerystringArr[0]] = splitQuerystringArr[1];
      });
    }
  }

  getStory() {
    db.getStory(this.uid, this.storyId ).then(snapshot =>
      this.setState({ story: snapshot.val().chapters })
    );
  }
  
  getChapter() {
    db.getChapter(this.uid, this.storyId, this.chapterId ).then(snapshot =>
      this.setState({ chapter: snapshot.val() })
    );
  }

  componentDidUpdate() {
    if (this.state.resetSelection) {
      document.getElementById('textarea').selectionEnd = this.state.selectionEnd;
      this.setState({
        resetSelection: false
      });
    }
  }

  updateChapterText(e) {
    const { chapter } = this.state;
    chapter.text = e.target.value;
    this.setState({
      chapter: { ...chapter },
      chapterSaved: false
    });
  }

  handleReturnOrTab(e) {
    if (e.keyCode === 13) {
      console.log('Return pressed');
    } else if (e.keyCode === 9) {
      e.preventDefault();
      const { chapter } = this.state;
      chapter.text = 
        chapter.text.substring(0, e.target.selectionStart) + 
        '    ' + 
        chapter.text.substring(e.target.selectionEnd);
      this.setState({
        chapter: { ...chapter },
        selectionEnd: e.target.selectionStart + 4,
        resetSelection: true
      });
    };
  }

  saveChapter() {
    this.setState({ editable: false });
    db.saveChapter(this.uid, this.storyId, this.chapterId, this.state.chapter).then(() => {
      this.showSavedNotification();
    });
  }

  showSavedNotification() {
    this.setState({ 
      showToast: true,
      chapterSaved: true
    });
  }

  changeChapter(chapterId) {
    navigateTo(`/story/chapter/?storyTitle=${this.storyTitle}&storyId=${this.storyId}&chapterId=${chapterId}`);
    this.chapterId = chapterId
    this.getChapter();
  }

  hideToast() {
    this.setState({ showToast: false });
  }

  renderChapters() {
    return Object.keys(this.state.story).map(item => {
      return (
        <div 
          key={item}  
          className="link"
          onClick={() => this.changeChapter(item)}
        >
          <li 
            className={`side-nav-chapter ${item === this.chapterId ? 'active' : ''}`}
          >
            {this.state.story[item]['title'].replace(/\_/g, ' ')}
          </li>
        </div>
      );
    });
  }

  render() {
    if (!this.storyTitle) {
      return (
        <h3>Loading...</h3>
      );
    }
    const { chapter, editable, showToast, showSideMenu } = this.state;
    return (
      <div className="chapter">
        <aside className={`menu side-menu ${showSideMenu ? 'active' : ''}`}>
          <button
            className="side-menu-toggle"
            onClick={() => this.setState({ showSideMenu: !this.state.showSideMenu })}
          >
            <i className="fa fa-arrow-right" />
          </button>
          <p className="menu-label">
            {this.storyTitle.replace(/\_/g, ' ')}
          </p>
          <ul className="menu-list">
            <li>
              <Link className="is-active" to="#">
                Chapters
              </Link>
              <ul className="menu-list">
                {this.renderChapters()}
              </ul>
            </li>
            <li>
              <Link to="#">
                Settings
              </Link>
              <ul className="menu-list">
                
              </ul>
            </li>
            <li>
              <Link to="#">
                Characters
              </Link>
              <ul className="menu-list">
                <li className="link">
                  Emma Whimsy
                </li>
                <li className="link">
                  Banjo
                </li>
              </ul>
            </li>
            <li>
              <Link to="#">
                Locations
              </Link>
              <ul className="menu-list">
                <li className="link">
                  The Sleeping Palm
                </li>
                <li className="link">
                  Emma's Home
                </li>
              </ul>
            </li>
          </ul>
        </aside>
        <section className="section container">
          <div className="has-text-centered mb-3">
            <Link to={`../../story/?storyTitle=${this.storyTitle}&storyId=${this.storyId}`}>
              <h2 className="title">{this.storyTitle.replace(/\_/g, ' ')}</h2>
            </Link>
            <h4>{chapter.title.replace(/\_/g, ' ')}</h4>
          </div>
          <textarea
            id="textarea"
            onBlur={this.saveChapter}
            onChange={this.updateChapterText}
            onKeyDown={this.handleReturnOrTab}
            className="chapter-text"
            value={chapter.text}
          />
        </section>
        <Toast showToast={showToast} hideToast={this.hideToast}>
          Chapter Saved
        </Toast>
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Chapter);