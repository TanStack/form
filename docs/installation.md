# Installation

Installing and using React Form is simple. Start by installing the `react-form` dependency:

```bash
$ yarn add react-form
# or
$ npm i react-form --save
```

Once it is installed, you can import and use `react-form`'s hooks and utilities:

```js
import { useForm, useField, splitFormProps } from 'react-form'
```

**NOTE:** React Form does not transpile asynchronous functions or polyfill promises. If you need to target any browsers that don't support async functions or promises, you will need to transpile them with babel and/or a promise polyfill.

To learn how to use React Form, you should:

- [See a basic example](https://codesandbox.io/s/react-form-demo-950ww)
- [Study a more complex example](https://codesandbox.io/s/react-form-demo-q9mgm)
- [Get to know the API](https://github.com/tannerlinsley/react-form/blob/master/docs/api.md)
