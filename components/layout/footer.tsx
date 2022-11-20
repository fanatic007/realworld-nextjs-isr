import Link from "next/link"
import { PATH_HOME } from "../../constants"

const Footer = () => {
  return (
    <footer>
        <div className="container">
            <Link href={PATH_HOME}>
              <a  className="logo-font">conduit</a>
            </Link>
            <span className="attribution">
              An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
            </span>
        </div>
    </footer>    
  )
}

export default Footer