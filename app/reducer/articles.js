import {
  REQUEST_ARTICLES,
  RECEIVE_ARTICLES,
  ERROR_FETCH_ARTICLES
} from "../action/articles.js";

function articles (state = [], action) {
  switch (action.type) {
    case REQUEST_ARTICLES:
      return state;
    case RECEIVE_ARTICLES:
      return action.articles.slice();
    case ERROR_FETCH_ARTICLES:
      return state;
    default:
      return state;
  }
}

const initialStatus = {
	isFetching: false,
	error: false
}
function status (state=initialStatus, action) {
	switch (action.type) {
		case REQUEST_ARTICLES:
			return Object.assign({}, state, {
				isFetching: true
			});
		case RECEIVE_ARTICLES:
			return Object.assign({}, state, {
				isFetching: false,
				error: false
			});
		case ERROR_FETCH_ARTICLES:
			return Object.assign({}, state, {
				isFetching: false,
				error: true
			});
		default:
			return state;
	}
}

function articlesApp(state = {}, action) {
  return {
    articles: articles(state.articles, action),
    status: status(state.status, action)
  }
}

export default articlesApp;
