import React from 'react';
import ReactDOM from 'react-dom';
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import '../node_modules/highlight.js/styles/monokai.css';
// import '../node_modules/prismjs/themes/prism.css';
// import './assets/prism.css';
import './assets/bootstrap.min.css';
import './styles.scss';

import Examples from './Examples';

const render = (Component) => {
  ReactDOM.render(
    <div className="container-fluid">
      <Component />
    </div>,
    document.getElementById('app'),
  );
};

render(Examples);
