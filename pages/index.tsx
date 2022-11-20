import { useRouter } from 'next/router'
import { PATH_HOME } from '../constants';

function RedirectPage(props:any) {
  const router = useRouter()
  // Make sure we're in the browser
  if (typeof window !== 'undefined') {
    router.push(PATH_HOME)
  }
}

RedirectPage.getInitialProps = (ctx:any) => {
  // We check for ctx.res to make sure we're on the server.
  if (ctx.res) {
    ctx.res.writeHead(302, { Location: PATH_HOME });
    ctx.res.end();
  }
  return { };
}


export default RedirectPage