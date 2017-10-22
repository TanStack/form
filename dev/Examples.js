/* ------------- Imports -------------- */
import React, { Component } from 'react';

/* ------------- Form  Library Imports -------------- */
import BasicForm from './BasicForm';
import NestedFormExample from './NestedFormExample';
import FormWithArrays from './FormWithArrays';
import BigComplexForm from './BigComplexForm';
import Intro from './Intro';
import CustomInputs from './CustomInputs';
import AsyncValidation from './AsyncValidation';
import NestedAsyncValidation from './NestedAsyncValidation';

class Examples extends Component {
  render() {
    return (
      <div className="mt-4">
        <h1>React Form</h1>
        <hr /><br />
        <Intro />
        <hr /><br />
        <BasicForm />
        <hr /><br />
        <FormWithArrays />
        <hr /><br />
        <NestedFormExample />
        <hr /><br />
        <CustomInputs />
        <hr /><br />
        <AsyncValidation />
        <hr /><br />
        <NestedAsyncValidation />
        <hr /><br />
        <BigComplexForm />
      </div>
    );
  }
}

export default Examples;
