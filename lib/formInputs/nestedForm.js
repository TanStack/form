'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = FormInputNestedForm;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _formInput = require('../formInput');

var _formInput2 = _interopRequireDefault(_formInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
//


function FormInputNestedForm(_ref) {
  var field = _ref.field,
      children = _ref.children,
      rest = _objectWithoutProperties(_ref, ['field', 'children']);

  return _react2.default.createElement(
    _formInput2.default,
    {
      field: field,
      errorBefore: true,
      isForm: true
    },
    function (_ref2) {
      var setValue = _ref2.setValue,
          getValue = _ref2.getValue,
          getTouched = _ref2.getTouched,
          setNestedError = _ref2.setNestedError;

      if (Array.isArray(children)) {
        console.warn('NestedForm\'s only child must be a single ReactForm component. Using the first child of:', children);
        children = children[0];
      }
      return _react2.default.cloneElement(children, _extends({}, rest, {
        /* Let the parent form set defaultValues */
        values: getValue(),
        /* Respond to the parent form's dirty submission attempts */
        touched: getTouched(),
        /* Notify the parent of any nestedForm-level errors and values */
        onChange: function onChange(_ref3, props, initial) {
          var values = _ref3.values,
              errors = _ref3.errors;

          errors ? setNestedError(true) : setNestedError(false);
          setValue(values, initial);
        }
      }));
    }
  );
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtSW5wdXRzL25lc3RlZEZvcm0uanMiXSwibmFtZXMiOlsiRm9ybUlucHV0TmVzdGVkRm9ybSIsImZpZWxkIiwiY2hpbGRyZW4iLCJyZXN0Iiwic2V0VmFsdWUiLCJnZXRWYWx1ZSIsImdldFRvdWNoZWQiLCJzZXROZXN0ZWRFcnJvciIsIkFycmF5IiwiaXNBcnJheSIsImNvbnNvbGUiLCJ3YXJuIiwiY2xvbmVFbGVtZW50IiwidmFsdWVzIiwidG91Y2hlZCIsIm9uQ2hhbmdlIiwicHJvcHMiLCJpbml0aWFsIiwiZXJyb3JzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztrQkFJd0JBLG1COztBQUp4Qjs7OztBQUVBOzs7Ozs7O0FBREE7OztBQUdlLFNBQVNBLG1CQUFULE9BQTBEO0FBQUEsTUFBM0JDLEtBQTJCLFFBQTNCQSxLQUEyQjtBQUFBLE1BQXBCQyxRQUFvQixRQUFwQkEsUUFBb0I7QUFBQSxNQUFQQyxJQUFPOztBQUN2RSxTQUNFO0FBQUE7QUFBQTtBQUNFLGFBQU9GLEtBRFQ7QUFFRSx1QkFGRjtBQUdFO0FBSEY7QUFLRyxxQkFBc0Q7QUFBQSxVQUFwREcsUUFBb0QsU0FBcERBLFFBQW9EO0FBQUEsVUFBMUNDLFFBQTBDLFNBQTFDQSxRQUEwQztBQUFBLFVBQWhDQyxVQUFnQyxTQUFoQ0EsVUFBZ0M7QUFBQSxVQUFwQkMsY0FBb0IsU0FBcEJBLGNBQW9COztBQUNyRCxVQUFJQyxNQUFNQyxPQUFOLENBQWNQLFFBQWQsQ0FBSixFQUE2QjtBQUMzQlEsZ0JBQVFDLElBQVIsQ0FBYSwwRkFBYixFQUF5R1QsUUFBekc7QUFDQUEsbUJBQVdBLFNBQVMsQ0FBVCxDQUFYO0FBQ0Q7QUFDRCxhQUFPLGdCQUFNVSxZQUFOLENBQW1CVixRQUFuQixlQUNGQyxJQURFO0FBRUw7QUFDQVUsZ0JBQVFSLFVBSEg7QUFJTDtBQUNBUyxpQkFBU1IsWUFMSjtBQU1MO0FBQ0FTLGtCQUFVLHlCQUFtQkMsS0FBbkIsRUFBMEJDLE9BQTFCLEVBQXNDO0FBQUEsY0FBcENKLE1BQW9DLFNBQXBDQSxNQUFvQztBQUFBLGNBQTVCSyxNQUE0QixTQUE1QkEsTUFBNEI7O0FBQzlDQSxtQkFBU1gsZUFBZSxJQUFmLENBQVQsR0FBZ0NBLGVBQWUsS0FBZixDQUFoQztBQUNBSCxtQkFBU1MsTUFBVCxFQUFpQkksT0FBakI7QUFDRDtBQVZJLFNBQVA7QUFZRDtBQXRCSCxHQURGO0FBMEJEIiwiZmlsZSI6Im5lc3RlZEZvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG4vL1xuaW1wb3J0IEZvcm1JbnB1dCBmcm9tICcuLi9mb3JtSW5wdXQnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEZvcm1JbnB1dE5lc3RlZEZvcm0gKHtmaWVsZCwgY2hpbGRyZW4sIC4uLnJlc3R9KSB7XG4gIHJldHVybiAoXG4gICAgPEZvcm1JbnB1dFxuICAgICAgZmllbGQ9e2ZpZWxkfVxuICAgICAgZXJyb3JCZWZvcmVcbiAgICAgIGlzRm9ybVxuICAgID5cbiAgICAgIHsoe3NldFZhbHVlLCBnZXRWYWx1ZSwgZ2V0VG91Y2hlZCwgc2V0TmVzdGVkRXJyb3J9KSA9PiB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuKSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybignTmVzdGVkRm9ybVxcJ3Mgb25seSBjaGlsZCBtdXN0IGJlIGEgc2luZ2xlIFJlYWN0Rm9ybSBjb21wb25lbnQuIFVzaW5nIHRoZSBmaXJzdCBjaGlsZCBvZjonLCBjaGlsZHJlbilcbiAgICAgICAgICBjaGlsZHJlbiA9IGNoaWxkcmVuWzBdXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFJlYWN0LmNsb25lRWxlbWVudChjaGlsZHJlbiwge1xuICAgICAgICAgIC4uLnJlc3QsXG4gICAgICAgICAgLyogTGV0IHRoZSBwYXJlbnQgZm9ybSBzZXQgZGVmYXVsdFZhbHVlcyAqL1xuICAgICAgICAgIHZhbHVlczogZ2V0VmFsdWUoKSxcbiAgICAgICAgICAvKiBSZXNwb25kIHRvIHRoZSBwYXJlbnQgZm9ybSdzIGRpcnR5IHN1Ym1pc3Npb24gYXR0ZW1wdHMgKi9cbiAgICAgICAgICB0b3VjaGVkOiBnZXRUb3VjaGVkKCksXG4gICAgICAgICAgLyogTm90aWZ5IHRoZSBwYXJlbnQgb2YgYW55IG5lc3RlZEZvcm0tbGV2ZWwgZXJyb3JzIGFuZCB2YWx1ZXMgKi9cbiAgICAgICAgICBvbkNoYW5nZTogKHt2YWx1ZXMsIGVycm9yc30sIHByb3BzLCBpbml0aWFsKSA9PiB7XG4gICAgICAgICAgICBlcnJvcnMgPyBzZXROZXN0ZWRFcnJvcih0cnVlKSA6IHNldE5lc3RlZEVycm9yKGZhbHNlKVxuICAgICAgICAgICAgc2V0VmFsdWUodmFsdWVzLCBpbml0aWFsKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH19XG4gICAgPC9Gb3JtSW5wdXQ+XG4gIClcbn1cbiJdfQ==