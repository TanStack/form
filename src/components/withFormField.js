import React from 'react';
import FormField from './FormField';

//

export default function withFormField(Comp, defaults) {
  return function ConnectedFormField(props) {
    return <FormField component={Comp} {...defaults} {...props} />;
  };
}
