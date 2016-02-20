import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { fetchArticles } from './action/articles.js';
import Brand from './component/brand.jsx!'
import Articles from './component/articles.jsx!'

class Main extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchArticles())
  }
  render() {
    const { articles, status } = this.props;
    return (
      <div>
        <Brand/>
				<Articles status={ status } articles={articles} />
      </div>
    )
  }
}

Main.propTypes = {
  dispatch: PropTypes.func.isRequired,
	articles: PropTypes.array.isRequired,
	status: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
		articles: state.articles,
		status: state.status
  }
}
export default connect(mapStateToProps)(Main)
