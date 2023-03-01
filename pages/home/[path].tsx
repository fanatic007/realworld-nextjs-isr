import type { NextPage } from 'next'
import Layout from '../../components/layout/Layout'
import Home from '../../components/pages/home'
import { API_SUFFIX_TAGS, PAGES, PAGE_SIZE, REVALIDATE_TIME_HOME, URL_BASE } from '../../constants'
import { decodeOptions, encodeOptions } from '../../middleware'
import { getArticlesByQuery } from '../api/articles'


const HomePage: NextPage = ({articles:multipleArticles, tags}:any) => {
  const {articles, articlesCount} = multipleArticles;
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
          <Home tags={tags} articles={articles} articlesCount={articlesCount}/>
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps(context:any) {
  const {tag, page} = decodeOptions(context.params.path);
  // const articles = (await (await fetch(`${URL_BASE}${API_SUFFIX_ARTICLES}?limit=${PAGE_SIZE}&offset=${(+page - 1)*PAGE_SIZE}${tag?'&tag='+tag:''}`)).json())['articles'];
  const query = {tag:tag,limit:PAGE_SIZE,offset:(+page - 1)*PAGE_SIZE};
  const articlesRaw = (await getArticlesByQuery(query)) as any;
  const articles =  JSON.parse(JSON.stringify(articlesRaw));
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
  const {tags} = await (await fetch(`${URL_BASE}${API_SUFFIX_TAGS}`)).json();
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
  for(let i = 0; i < tags.length-2; i++)
  {
    for(let j = 0; j < PAGES.length-9; j++)
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

export default HomePage;
