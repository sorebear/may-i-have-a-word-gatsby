import { db } from './firebase';

// User API

// CREATE REQUESTS

export const doCreateUser = (id, username, email) =>
  db.ref(`users/${id}`).set({
    username,
    email,
  });

export const createNewStory = (id, title) =>
  db.ref(`users/${id}/stories`).push({
    title: title.replace(/\ /g, '_'),
    createdAt: new Date(),
    chapters: [],
  });

export const createNewChapter = (id, storyId, title) =>
  db.ref(`users/${id}/stories/${storyId}/chapters`).push({
    title: title.replace(/\ /g, '_'),
    createdAt: new Date(),
    text: 'Once upon a time...'
  });

// READ REQUESTS

export const getStory = (userId, storyId) =>
  db.ref(`users/${userId}/stories/${storyId}`).once('value');

export const getChapter = (userId, storyId, chapterId) =>
  db.ref(`users/${userId}/stories/${storyId}/chapters/${chapterId}`).once('value');

export const getUserStories = id =>
  db.ref(`users/${id}/stories`).once('value');

export const onceGetUsers = () =>
  db.ref('users').once('value');

// UPDATE REQUESTS

export const saveChapter = (userId, storyId, chapterId, updatedChapter) =>
  db.ref(`users/${userId}/stories/${storyId}/chapters/${chapterId}`).update({
    title: updatedChapter.title,
    text: updatedChapter.text,
  });

// DELETE REQUESTS

export const deleteStory = (userId, storyId) =>
  db.ref(`users/${userId}/stories/${storyId}`).remove();

export const deleteChapter = (userId, storyId, chapterId) =>
  db.ref(`users/${userId}/stories/${storyId}/chapters/${chapterId}`).remove();

// Other db APIs ...
