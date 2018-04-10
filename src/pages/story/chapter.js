import React, { Component } from 'react';
import firebase from 'firebase';
import Link from 'gatsby-link';

import withAuthorization from '../../components/Session/withAuthorization';
import { db } from '../../firebase';

const fromObjectToList = (object) =>
  object
    ? Object.keys(object).map(key => ({ ...object[key], index: key }))
    : [];

class Chapter extends Component {
  constructor(props) {
    super(props);
    this.updateChapterText = this.updateChapterText.bind(this);
    this.saveChapter = this.saveChapter.bind(this);
    this.uid = firebase.auth().currentUser.uid;
    this.storyTitle = null;
    this.storyId = null;
    this.chapterId = null;
    this.state = {
      chapter: {}
    };
  }

  updateChapterText(e) {
    const { chapter } = this.state;
    chapter.text = e.target.value;
    this.setState({
      chapter: { ...chapter }
    })
  }

  saveChapter() {
    db.saveChapter(this.uid, this.storyId, this.chapterId, this.state.chapter).then(() => {
      this.showSavedNotification();
    });
  }

  showSavedNotification() {
    console.log('Your Chapter has been saved');
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

    db.getChapter(this.uid, this.storyId, this.chapterId ).then(snapshot =>
      this.setState({ chapter: snapshot.val() })
    );
  }

  render() {
    if (!this.storyTitle) {
      return (
        <h3>Loading...</h3>
      );
    }
    return (
      <div>
        <div>
          <Link to={`../story/?storyTitle=${this.storyTitle}&storyId=${this.storyId}`}>
            <h3>{this.storyTitle.replace('_', ' ')}</h3>
          </Link>
          <h4>{this.state.chapter.title}</h4>
        </div>
        <textarea
          onBlur={this.saveChapter}
          onChange={this.updateChapterText}
          value={this.state.chapter.text}
        />
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Chapter);