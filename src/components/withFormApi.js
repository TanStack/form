import React from 'react';
import FormApi from './FormApi';

//

export default function withFormApi(Comp, defaults) {
  return function ConnectedFormApi(props) {
    return <FormApi component={Comp} {...defaults} {...props} />;
  };
}
