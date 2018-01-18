import React from 'react';
import FormField from './FormField';

//

export default function withFormField(Comp) {
  return function ConnectedFormField(props) {
    return <FormField component={Comp} {...props} strict />;
  };
}
