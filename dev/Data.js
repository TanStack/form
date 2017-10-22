/* ------------- Imports -------------- */
import React, { Component } from 'react';
import { PrismCode } from 'react-prism';

class Data extends Component {

  render() {

    const {
      title,
      data,
      reference
    } = this.props;

    const code = JSON.stringify(data, null, 2);

    return (
      <div className="mb-4">
        { title ? <h5 className="d-inline-block mr-3">{`${title}:`}</h5> : null }
        { reference ? <span>(<code >{reference}</code>)</span> : null }
        <pre>
          <PrismCode className="language-json">
            {code}
          </PrismCode>
        </pre>
      </div>
    );
  }
}

export default Data;
