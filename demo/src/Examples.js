/* ------------- Imports -------------- */
import React, { Component } from 'react'
import { HashRouter as Router, Route, NavLink as Link } from 'react-router-dom'

/* ------------- Form  Library Imports -------------- */
import BasicForm from './BasicForm'
import FormInputs from './FormInputs'
import HighOrderComponents from './HighOrderComponents'
import NestedFieldExample from './NestedFieldExample'
import FormWithArrays from './FormWithArrays'
import FieldSyntax from './FieldSyntax'
import BigComplexForm from './BigComplexForm'
import Intro from './Intro'
import CustomInputs from './CustomInputs'
import AsyncValidation from './AsyncValidation'
import NestedAsyncValidation from './NestedAsyncValidation'
import SideNav from './SideNav'
import MainContent from './MainContent'
import DynamicForms from './DynamicForms'
import ArrayOfNestedFields from './ArrayOfNestedFields'
import Tester from './Tester'

class Examples extends Component {
  render () {
    return (
      <Router>
        <div>
          <div className="mt-4 row">
            <SideNav>
              <Link to="/" exact className="nav-link">
                Introduction
              </Link>
              <Link to="/form-inputs" exact className="nav-link">
                Form Inputs
              </Link>
              <Link to="/basic-form" className="nav-link">
                Basic form
              </Link>
              <Link to="/array-form" className="nav-link">
                Forms with arrays
              </Link>
              <Link to="/field-syntax" className="nav-link">
                Field syntax
              </Link>
              <Link to="/nested-field" className="nav-link">
                Nested fields
              </Link>
              <Link to="/dynamic-form" className="nav-link">
                Dynamic forms
              </Link>
              <Link to="/array-nested-fields" className="nav-link">
                Array of nested fields
              </Link>
              {/* <Link to="/styled-form" className="nav-link">
                Styled form
              </Link> */}
              <Link to="/custom-input" className="nav-link">
                Custom inputs
              </Link>
              <Link to="/hoc" className="nav-link">
                Higher-Order Components
              </Link>
              <Link to="/async-validation" className="nav-link">
                Async validation
              </Link>
              <Link to="/nested-async" className="nav-link">
                Nested async validation
              </Link>
              {/* <Link to="/big-complex" className="nav-link">
                Big complex form
              </Link> */}
              <a
                href="https://github.com/react-tools/react-form"
                className="nav-link"
                title="React Form on Github"
              >
                React Form on Github
              </a>
            </SideNav>
            <MainContent>
              <h1>React Form</h1>
              <hr />
              <br />
              <Route exact path="/" component={Intro} />
              <Route exact path="/form-inputs" component={FormInputs} />
              <Route exact path="/basic-form" component={BasicForm} />
              {/* <Route exact path="/styled-form" component={StyledForm} /> */}
              <Route exact path="/array-form" component={FormWithArrays} />
              <Route exact path="/field-syntax" component={FieldSyntax} />
              <Route exact path="/nested-field" component={NestedFieldExample} />
              <Route exact path="/dynamic-form" component={DynamicForms} />
              <Route exact path="/array-nested-fields" component={ArrayOfNestedFields} />
              <Route exact path="/custom-input" component={CustomInputs} />
              <Route exact path="/async-validation" component={AsyncValidation} />
              <Route exact path="/nested-async" component={NestedAsyncValidation} />
              <Route exact path="/big-complex" component={BigComplexForm} />
              <Route exact path="/tester" component={Tester} />
              <Route exact path="/hoc" component={HighOrderComponents} />
            </MainContent>
          </div>
        </div>
      </Router>
    )
  }
}

export default Examples
