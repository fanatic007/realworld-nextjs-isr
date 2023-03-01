import Link from "next/link";
import { useRouter } from "next/router";
import { PATH_HOME } from "../../constants";
import { decodeOptions } from "../../middleware";
import { SingleArticle } from "../../types";
import ArticlePreview from "../article/ArticlePreview";
import Pagination from "../article/Pagination";
import PopularTags from "../article/PopularTags";

const Home = ({ articles, articlesCount, tags }: any) => {
  const router = useRouter();
  const { tag, page = 1 } = decodeOptions(router.query.path);
  return (
    <div className="row">
      <div className="col-md-9">
        <div className="feed-toggle">
          <ul className="nav nav-pills outline-active">
            <li className="nav-item">
              <Link href={`${PATH_HOME}?page=1`}>
                <a className={`nav-link ${tag ? "" : "active"}`}>Global Feed</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="">
                <a className={`nav-link disabled`}>Your Feed</a>
              </Link>
            </li>
            {tag && (
              <li className="nav-item">
                <a className={`nav-link active`} href="">
                  #{tag}
                </a>
              </li>
            )}
          </ul>
        </div>
        <div>
          {articles.map((article: SingleArticle) => (
            <ArticlePreview
              key={`${article.slug}${Math.random()}`}
              article={article}
            ></ArticlePreview>
          ))}
          <Pagination
            path={PATH_HOME}
            tag={tag}
            page={page}
            itemsCount={articlesCount}
          ></Pagination>
        </div>
      </div>
      <PopularTags path={PATH_HOME} tags={tags}></PopularTags>
    </div>
  );
};

export default Home;
