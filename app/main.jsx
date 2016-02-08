import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { fetchArticles } from './action/articles.js';
import Jumbotron from './jumbotron.jsx!'
import Article from './component/article.jsx!'

class Main extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchArticles())
  }
  render() {
    const { articles } = this.props;
    const articleList = articles
    .sort((a,b) => {
      const dateA = new Date(a.publication);
      const dateB = new Date(b.publication);
      if (dateA < dateB) {
        return 1;
      }
      if (dateA > dateB) {
        return -1;
      }
      return 0;
    })
    .map( (article) => {
      return (
          <Article
          markdown={article.markdown}
          publication={article.publication}
          key={article.publication}
          />
      )
    });
    return (
      <div>
        <Jumbotron/>
        { articleList }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    articles: state
  }
}
export default connect(mapStateToProps)(Main)
