import { SingleArticle } from '../../types'
import Image from 'next/image';

const ArticlePreview = (props:any) => {
  const article = props.article as SingleArticle;
  return (
    <div className="article-preview">
      <div className="article-meta">
          <a href="profile.html"><Image loader={ () => article.author.image} src="*.png" width={32} height={32}/></a>
          <div className="info">
              <a href="/profile" className="author">{article.author.username}</a>
              <span className="date">{(new Date(article.createdAt).toDateString())}</span>
          </div>
          <button className="btn btn-outline-primary btn-sm pull-xs-right">
              <i className="ion-heart"></i> {article.favoritesCount}
          </button>
      </div>
      <a href="" className="preview-link">
          <h1>{article.title}</h1>
          <p>{article.description}</p>
          <span>Read more...</span>
          {
            article.tagList.map(tag=>
                <ul className="tag-list">
                    <li className="tag-default tag-pill tag-outline" key={`tag_${new Date()}`}>{tag}</li>
                </ul>
            )
          }
      </a>
      
    </div>
)
}

export default ArticlePreview