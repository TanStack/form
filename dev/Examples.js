/* ------------- Imports -------------- */
import React, { Component } from 'react';
import {
  HashRouter as Router,
  Route,
  NavLink as Link
} from 'react-router-dom'

/* ------------- Form  Library Imports -------------- */
import BasicForm from './BasicForm';
import NestedFormExample from './NestedFormExample';
import FormWithArrays from './FormWithArrays';
import BigComplexForm from './BigComplexForm';
import Intro from './Intro';
import CustomInputs from './CustomInputs';
import AsyncValidation from './AsyncValidation';
import NestedAsyncValidation from './NestedAsyncValidation';
import SideNav from './SideNav';
import MainContent from './MainContent';

class Examples extends Component {
  render() {
    return (
      <Router>
        <div>
          <div className="mt-4 row">
            <SideNav>
              <Link to="/" exact className="nav-link">Introduction</Link>
              <Link to="/basic-form" className="nav-link">Basic form</Link>
              <Link to="/array-form" className="nav-link">Forms with arrays</Link>
              <Link to="/nested-form" className="nav-link">Nested forms</Link>
              <Link to="/custom-input" className="nav-link">Custom inputs</Link>
              <Link to="/async-validation" className="nav-link">Async validation</Link>
              <Link to="/nested-async" className="nav-link">Nested async validation</Link>
              <Link to="/big-complex" className="nav-link">Big complex form</Link>
            </SideNav>
            <MainContent>
              <h1>React Form</h1>
              <hr /><br />
              <Route exact path="/" component={Intro} />
              <Route exact path="/basic-form" component={BasicForm} />
              <Route exact path="/array-form" component={FormWithArrays} />
              <Route exact path="/nested-form" component={NestedFormExample} />
              <Route exact path="/custom-input" component={CustomInputs} />
              <Route exact path="/async-validation" component={AsyncValidation} />
              <Route exact path="/nested-async" component={NestedAsyncValidation} />
              <Route exact path="/big-complex" component={BigComplexForm} />
            </MainContent>
          </div>
        </div>
      </Router>
    );
  }
}

export default Examples;
