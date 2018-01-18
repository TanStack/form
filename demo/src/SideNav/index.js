import React from 'react'
// import './SideNav.scss';

const SideNav = ({ children }) => (
  <nav className="sideNav col-sm-3 flex-column nav-pills">
    <div className="sticky-sidebar">{children}</div>
  </nav>
)

export default SideNav
