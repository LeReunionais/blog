import {
  REQUEST_ARTICLES,
  RECEIVE_ARTICLES
} from "../action/articles.js";

const articles = (state = [], action) => {
  switch (action.type) {
    case REQUEST_ARTICLES:
      return state;
    case RECEIVE_ARTICLES:
      return action.articles.slice();
    default:
      return state;
  }
}

export default articles
