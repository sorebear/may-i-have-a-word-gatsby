import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email) =>
  db.ref(`users/${id}`).set({
    username,
    email,
  });

export const createNewStory = (id, title) =>
  db.ref(`users/${id}/stories`).push({
    title,
    chapters: [],
  });

export const deleteStory = (userId, storyId) =>
  db.ref(`users/${userId}/stories/${storyId}`).remove();

export const getUserStories = id =>
  db.ref(`users/${id}/stories`).once('value');

export const onceGetUsers = () =>
  db.ref('users').once('value');

// Other db APIs ...
