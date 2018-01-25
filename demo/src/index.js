import React from 'react'
import ReactDOM from 'react-dom'

import './assets/prism.css';
import './assets/bootstrap.min.css';
import './styles.scss';

import './assets/prism.js';

import Examples from './Examples'

// ReactDOM.render(<Examples />, document.querySelector('#demo'))

ReactDOM.render(
  <div className="container-fluid">
    <Examples />
  </div>,
  document.getElementById('demo'),
)
