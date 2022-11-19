import React from 'react';
import Footer from './footer';
import Header from './header';
import Navbar from './navbar';

const Layout = (props:any) => {
  return (
    <React.Fragment>
      <Header></Header>      
      <Navbar isLoggedIn={false}></Navbar>      
      <main>
        {props.children}
      </main>      
      <Footer></Footer>
    </React.Fragment>
  )
}

export default Layout
