/* ---------- imports ---------- */

import Form from './components/ReduxForm';
import Text from './components/form-fields/Text';
import Radio from './components/form-fields/Radio';
import TextArea from './components/form-fields/TextArea';
import Select from './components/form-fields/Select';
import Checkbox from './components/form-fields/Checkbox';
import RadioGroup from './components/form-fields/RadioGroup';
import NestedForm from './components/form-fields/NestedForm';
import FormField from './components/FormField';

import utils from './components/styled-form-fields/utils';
import Message from './components/styled-form-fields/Message';
import StyledText from './components/styled-form-fields/Text';
import StyledRadio from './components/styled-form-fields/Radio';
import StyledTextArea from './components/styled-form-fields/TextArea';
import StyledSelect from './components/styled-form-fields/Select';
import StyledCheckbox from './components/styled-form-fields/Checkbox';
import StyledRadioGroup from './components/styled-form-fields/RadioGroup';

//TODO remove these when IE is no longer a thing ( ie never :( )
require('./polyfills/find.js');
require('./polyfills/includes.js');

/* ---------- exports ---------- */

export {
  Form,
  Text,
  NestedForm,
  FormField,
  RadioGroup,
  Radio,
  Select,
  Checkbox,
  TextArea,
  utils,
  Message,
  StyledText,
  StyledRadio,
  StyledTextArea,
  StyledSelect,
  StyledCheckbox,
  StyledRadioGroup
};
