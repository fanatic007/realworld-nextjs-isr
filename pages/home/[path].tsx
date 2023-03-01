import type { NextPage } from 'next'
import Layout from '../../components/layout/Layout'
import Home from '../../components/pages/home'
import { PAGES, PAGE_SIZE, REVALIDATE_TIME_HOME } from '../../constants'
import { getTags } from '../../db/tags'
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
  const query = {tag:tag,limit:PAGE_SIZE,offset:(+page - 1)*PAGE_SIZE};
  const articlesRaw = (await getArticlesByQuery(query)) as any;
  const articles =  JSON.parse(JSON.stringify(articlesRaw));
  const tagsRaw = await getTags();
  const tags = JSON.parse(JSON.stringify(tagsRaw)).map((tag:any)=>tag.title);
  return {
    props: {
      articles,
      tags
    },
    revalidate:REVALIDATE_TIME_HOME
  }
}
export async function getStaticPaths() {

  const tags: string[] = (await getTags()).map(tag=>tag.title)

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

export default HomePage;
