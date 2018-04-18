import React, { Component } from 'react';
import firebase from 'firebase';
import Link from 'gatsby-link';

import withAuthorization from '../../components/Session/withAuthorization';
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
    this.hideToast = this.hideToast.bind(this);
    this.saveChapter = this.saveChapter.bind(this);
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
    };
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

    db.getStory(this.uid, this.storyId ).then(snapshot =>
      this.setState({ story: snapshot.val().chapters })
    );

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
      chapter: { ...chapter }
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
        '  ' + 
        chapter.text.substring(e.target.selectionEnd);
      this.setState({
        chapter: { ...chapter },
        selectionEnd: e.target.selectionStart + 2,
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
    this.setState({ showToast: true });
  }

  hideToast() {
    this.setState({ showToast: false });
  }

  renderChapters() {
    return Object.keys(this.state.story).map(item => {
      return (
        <Link key={item} to="#">
          <li className="is-active">{this.state.story[item]['title']}</li>
        </Link>
      )
    });
  }

  render() {
    if (!this.storyTitle) {
      return (
        <h3>Loading...</h3>
      );
    }
    console.log(this.state.story);
    const { chapter, editable, showToast } = this.state;
    return (
      <section className="section chapter">
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
        <Toast showToast={showToast} hideToast={this.hideToast}>
          Chapter Saved
        </Toast>
        <aside className="menu side-menu">
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
          </ul>
        </aside>
      </section>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Chapter);