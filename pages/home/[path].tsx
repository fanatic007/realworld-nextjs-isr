import type { NextPage } from 'next'
import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'
import ArticlePreview from '../../components/article/ArticlePreview'
import Pagination from '../../components/article/Pagination'
import PopularTags from '../../components/article/PopularTags'
import Layout from '../../components/layout/Layout'
import { API_SUFFIX_ARTICLES, API_SUFFIX_TAGS, PAGES, PAGE_SIZE, REVALIDATE_TIME_HOME, URL_BASE } from '../../constants'
import { decodeOptions, encodeOptions } from '../../middleware'
import { SingleArticle } from '../../types'

let router: NextRouter;

const Home: NextPage = (props:any) => {
  router = useRouter();
  const { tag } = decodeOptions(router.query.path);
  return (
    <Layout>      
      <div className="home-page">
        <div className="banner">
          <div className="container">
              <h1 className="logo-font">conduit</h1>
              <p>A place to share your knowledge.</p>
          </div>
        </div>
        <div className="container page">
          <div className="row">
            <div className="col-md-9">
              <div className="feed-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                      <Link href={`${getPath({page:1})}`}>
                          <a className={`nav-link ${tag?'':'active'}`}>Global Feed</a>
                      </Link>
                  </li>
                  <li className="nav-item">
                      <Link href="">
                          <a className={`nav-link disabled`}>Your Feed</a>
                      </Link>
                  </li>
                {
                  tag &&
                  <li className="nav-item">
                      <a className={`nav-link active`} href="">#{tag}</a>
                  </li>
                }
                </ul>
              </div>
              <div>
                {props.articles.map((article:SingleArticle)=> <ArticlePreview key={`${article.slug}${Math.random()}`} article={article}></ArticlePreview> )}                  
                <Pagination></Pagination>
              </div>
            </div>
            <PopularTags tags={props.tags}></PopularTags>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getPath = (params:any) => {
  const path = router.pathname.replace(/\[.*\]/g,'');
  const {tag, page} = params;
  return `${path}?${(tag?('tag='+tag)+'&':'')}page=${(page)}`;
}

export async function getStaticProps(context:any) {
  let {tag, page} = decodeOptions(context.params.path);
  const articles = (await (await fetch(`${URL_BASE}${API_SUFFIX_ARTICLES}?limit=${PAGE_SIZE}&offset=${(+page - 1)*PAGE_SIZE}${tag?'&tag='+tag:''}`)).json())['articles'];
  const tags = (await (await fetch(`${URL_BASE}${API_SUFFIX_TAGS}`)).json())['tags'];
  return {
    props: {
      articles,
      tags
    },
    revalidate:REVALIDATE_TIME_HOME
  }
}
export async function getStaticPaths() {
  const tags = (await (await fetch('http://localhost:3000/api/tags')).json())['tags'];
  // Get the paths we want to pre-render based on posts  
  const pagePaths = PAGES.map((page:number) =>
    ({
      params: {
        path : encodeOptions({
          page:''+page
        })
      }
    })
  );
  let tagPaths:any = [];
  for(let i = 0; i < tags.length; i++)
  {
    for(let j = 0; j < PAGES.length; j++)
    {
      tagPaths.push(
        {
          params: {
            path : encodeOptions({
              page:''+PAGES[j],
              tag:tags[i]
            })
          }
        }
      )
    }
  }
  return { paths:[...pagePaths, ...tagPaths], fallback: 'blocking' }
}

export default Home
