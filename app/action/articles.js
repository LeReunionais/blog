import fetch from 'isomorphic-fetch';

export const REQUEST_ARTICLES = 'REQUEST_ARTICLES';
export const RECEIVE_ARTICLES = 'RECEIVE_ARTICLES';
export const ERROR_FETCH_ARTICLES = 'ERROR_FETCH_ARTICLES';

function requestArticles() {
  return {
    type: REQUEST_ARTICLES
  }
}

function receiveArticles(json) {
  return {
    type: RECEIVE_ARTICLES,
    articles: json
  }
}

function errorFetchArticles() {
  return {
    type: ERROR_FETCH_ARTICLES
  }
}

export function fetchArticles() {
  return dispatch => {
    dispatch(requestArticles())
    return fetch('/articles')
      .then(rep => rep.json())
      .then(json => dispatch(receiveArticles(json)))
      .catch( () => dispatch(errorFetchArticles()))
      ;
  }
}
