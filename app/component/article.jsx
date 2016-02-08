import React, { Component, PropTypes } from 'react'
import Markdown from 'react-markdown'

export default class Article extends Component {
  render() {
    const { markdown, publication } = this.props;
    const publicationDate = new Date(publication);
    console.log(publicationDate)
    return (
      <article className="panel panel-default">
        <header className="panel-header">
          <time datetime={publication}>
            {publicationDate.toDateString()}
          </time>
        </header>
        <Markdown className="panel-body" source={markdown} />
      </article>
    )
  }
}

Article.propTypes = {
  markdown: PropTypes.string.isRequired,
  publication: PropTypes.string.isRequired
}
