/* ------------- Imports -------------- */
import React, { Component } from 'react';
import { PrismCode } from 'react-prism';

class Code extends Component {

  render() {

    const {
      children,
    } = this.props;

    return (
      <pre>
        <PrismCode className="language-jsx">
          {children}
        </PrismCode>
      </pre>
    );
  }
}

export default Code;
