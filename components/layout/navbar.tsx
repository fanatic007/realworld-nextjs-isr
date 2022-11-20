import Link from "next/link"
import React from "react"
import { PATH_HOME } from "../../constants"

const Navbar = (props:any) => {
  return (
    <nav className="navbar navbar-light">
        <div className="container">
            <Link href={PATH_HOME}>
                <a className="navbar-brand">conduit</a>
            </Link>
            <ul className="nav navbar-nav pull-xs-right">
                <li className="nav-item">
                    <a className="nav-link active" href={PATH_HOME}>Home</a>
                </li>
        {   
            props.isLoggedIn &&
            <React.Fragment>
                <li className="nav-item">
                    <a className="nav-link" href="">
                        <i className="ion-compose"></i>&nbsp;New Article
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="">
                        <i className="ion-gear-a"></i>&nbsp;Settings
                    </a>
                </li>
            </React.Fragment>
        }
                <li className="nav-item">
                    <a className="nav-link" href="">Sign in</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="">Sign up</a>
                </li>
            </ul>
        </div>
      </nav>  
    )
}

export default Navbar