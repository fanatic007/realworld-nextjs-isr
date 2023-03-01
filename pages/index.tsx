import { useRouter } from 'next/router'
import Layout from '../components/layout/Layout';
import Home from '../components/pages/home';
import { API_SUFFIX_TAGS, PAGE_SIZE, PATH_HOME, REVALIDATE_TIME_HOME, URL_BASE } from '../constants';
import { getArticlesByQuery } from './api/articles';

// function RedirectPage({articles:multipleArticles, tags}:any) {
//   const router = useRouter()
//   // Make sure we're in the browser
//   // if (typeof window !== 'undefined') {
//   //   router.push(PATH_HOME)
//   // }
//   const {articles, articlesCount} = multipleArticles;
//   return (
//     <Layout>      
//       <div className="home-page">
//         <div className="banner">
//           <div className="container">
//               <h1 className="logo-font">conduit</h1>
//               <p>A place to share your knowledge.</p>
//           </div>
//         </div>
//         <div className="container page">
//           <Home tag={undefined} page={1} tags={tags} articles={articles} articlesCount={articlesCount}/>
//         </div>
//       </div>
//     </Layout>
//   )  
// }

function RedirectPage() {
  const router = useRouter()
  if (typeof window !== 'undefined') {
    router.push(PATH_HOME)
  }
}


RedirectPage.getInitialProps = (ctx:any) => {
  // We check for ctx.res to make sure we're on the server.
  if (ctx.res) {
    ctx.res.writeHead(302, { Location: 'home' });
    ctx.res.end();
  }
  return { };
}

// export async function getStaticProps(context:any) {
//   const {tag, page} = {page:1, tag:undefined};
//   // const articles = (await (await fetch(`${URL_BASE}${API_SUFFIX_ARTICLES}?limit=${PAGE_SIZE}&offset=${(+page - 1)*PAGE_SIZE}${tag?'&tag='+tag:''}`)).json())['articles'];
//   const query = {tag:tag,limit:PAGE_SIZE,offset:(+page - 1)*PAGE_SIZE};
//   const articlesRaw = (await getArticlesByQuery(query)) as any;
//   const articles =  JSON.parse(JSON.stringify(articlesRaw));
//   const tags = (await (await fetch(`${URL_BASE}${API_SUFFIX_TAGS}`)).json())['tags'];
//   return {
//     props: {
//       articles,
//       tags
//     },
//     revalidate:REVALIDATE_TIME_HOME
//   }
// }

export default RedirectPage