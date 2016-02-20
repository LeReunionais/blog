import React, { Component, PropTypes } from 'react'
import { ProgressBar, Panel } from 'react-bootstrap'
import Article from './article.jsx!'

function toArticle(articles) {
	return articles
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
}
export default class Articles extends Component {
	render() {
    const { articles, status } = this.props;
		const articleList	= toArticle(articles);
		if (status.isFetching) {
			return (
				<div>
					<ProgressBar active now={60} />
				</div>
			)
		} else if (status.error) {
			return (
				<Panel header="Error" bsStyle="danger">
					Not able to retrieves articles.
				</Panel>
			)
		} else {
			if (articleList.length === 0) {
				return (
					<div>
						No articles published.
					</div>
				)
			} else {
				return (
					<div>
						{ articleList }
					</div>
				)
			}
		}
	}
}

Articles.propTypes = {
	articles: PropTypes.array.isRequired,
	status: PropTypes.object.isRequired
}
