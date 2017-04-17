'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = FormInput;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _formField = require('./formField');

var _formField2 = _interopRequireDefault(_formField);

var _formError = require('./formError');

var _formError2 = _interopRequireDefault(_formError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function FormInput(_ref) {
  var field = _ref.field,
      _ref$showErrors = _ref.showErrors,
      showErrors = _ref$showErrors === undefined ? true : _ref$showErrors,
      errorBefore = _ref.errorBefore,
      isForm = _ref.isForm,
      className = _ref.className,
      children = _ref.children;

  return _react2.default.createElement(
    _formField2.default,
    { field: field },
    function (_ref2) {
      var api = _objectWithoutProperties(_ref2, []);

      var showAnyErrors = showErrors && (isForm ? api.getTouched() === true : true);
      var classes = (0, _classnames2.default)('FormInput', {
        '-hasError': !errorBefore && showAnyErrors && api.getTouched() && api.getError()
      }, className);

      return _react2.default.createElement(
        'div',
        { className: classes },
        errorBefore && showAnyErrors && _react2.default.createElement(_formError2.default, { field: field }),
        children(_extends({}, api)),
        !errorBefore && showAnyErrors && _react2.default.createElement(_formError2.default, { field: field })
      );
    }
  );
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9mb3JtSW5wdXQuanMiXSwibmFtZXMiOlsiRm9ybUlucHV0IiwiZmllbGQiLCJzaG93RXJyb3JzIiwiZXJyb3JCZWZvcmUiLCJpc0Zvcm0iLCJjbGFzc05hbWUiLCJjaGlsZHJlbiIsImFwaSIsInNob3dBbnlFcnJvcnMiLCJnZXRUb3VjaGVkIiwiY2xhc3NlcyIsImdldEVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztrQkFNd0JBLFM7O0FBTnhCOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7OztBQUVlLFNBQVNBLFNBQVQsT0FBNEY7QUFBQSxNQUF0RUMsS0FBc0UsUUFBdEVBLEtBQXNFO0FBQUEsNkJBQS9EQyxVQUErRDtBQUFBLE1BQS9EQSxVQUErRCxtQ0FBbEQsSUFBa0Q7QUFBQSxNQUE1Q0MsV0FBNEMsUUFBNUNBLFdBQTRDO0FBQUEsTUFBL0JDLE1BQStCLFFBQS9CQSxNQUErQjtBQUFBLE1BQXZCQyxTQUF1QixRQUF2QkEsU0FBdUI7QUFBQSxNQUFaQyxRQUFZLFFBQVpBLFFBQVk7O0FBQ3pHLFNBQ0U7QUFBQTtBQUFBLE1BQVcsT0FBT0wsS0FBbEI7QUFDRyxxQkFBZ0I7QUFBQSxVQUFWTSxHQUFVOztBQUNmLFVBQU1DLGdCQUFnQk4sZUFBZUUsU0FBU0csSUFBSUUsVUFBSixPQUFxQixJQUE5QixHQUFxQyxJQUFwRCxDQUF0QjtBQUNBLFVBQU1DLFVBQVUsMEJBQVcsV0FBWCxFQUF3QjtBQUN0QyxxQkFBYSxDQUFDUCxXQUFELElBQWdCSyxhQUFoQixJQUFpQ0QsSUFBSUUsVUFBSixFQUFqQyxJQUFxREYsSUFBSUksUUFBSjtBQUQ1QixPQUF4QixFQUViTixTQUZhLENBQWhCOztBQUlBLGFBQ0U7QUFBQTtBQUFBLFVBQUssV0FBV0ssT0FBaEI7QUFDR1AsdUJBQWVLLGFBQWYsSUFDQyxxREFBVyxPQUFPUCxLQUFsQixHQUZKO0FBSUdLLDhCQUNJQyxHQURKLEVBSkg7QUFPRyxTQUFDSixXQUFELElBQWdCSyxhQUFoQixJQUNDLHFEQUFXLE9BQU9QLEtBQWxCO0FBUkosT0FERjtBQWFEO0FBcEJILEdBREY7QUF3QkQiLCJmaWxlIjoiZm9ybUlucHV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcydcblxuaW1wb3J0IEZvcm1GaWVsZCBmcm9tICcuL2Zvcm1GaWVsZCdcbmltcG9ydCBGb3JtRXJyb3IgZnJvbSAnLi9mb3JtRXJyb3InXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEZvcm1JbnB1dCAoeyBmaWVsZCwgc2hvd0Vycm9ycyA9IHRydWUsIGVycm9yQmVmb3JlLCBpc0Zvcm0sIGNsYXNzTmFtZSwgY2hpbGRyZW4gfSkge1xuICByZXR1cm4gKFxuICAgIDxGb3JtRmllbGQgZmllbGQ9e2ZpZWxkfT5cbiAgICAgIHsoeyAuLi5hcGkgfSkgPT4ge1xuICAgICAgICBjb25zdCBzaG93QW55RXJyb3JzID0gc2hvd0Vycm9ycyAmJiAoaXNGb3JtID8gYXBpLmdldFRvdWNoZWQoKSA9PT0gdHJ1ZSA6IHRydWUpXG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSBjbGFzc25hbWVzKCdGb3JtSW5wdXQnLCB7XG4gICAgICAgICAgJy1oYXNFcnJvcic6ICFlcnJvckJlZm9yZSAmJiBzaG93QW55RXJyb3JzICYmIGFwaS5nZXRUb3VjaGVkKCkgJiYgYXBpLmdldEVycm9yKClcbiAgICAgICAgfSwgY2xhc3NOYW1lKVxuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzZXN9PlxuICAgICAgICAgICAge2Vycm9yQmVmb3JlICYmIHNob3dBbnlFcnJvcnMgJiYgKFxuICAgICAgICAgICAgICA8Rm9ybUVycm9yIGZpZWxkPXtmaWVsZH0gLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7Y2hpbGRyZW4oe1xuICAgICAgICAgICAgICAuLi5hcGlcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgeyFlcnJvckJlZm9yZSAmJiBzaG93QW55RXJyb3JzICYmIChcbiAgICAgICAgICAgICAgPEZvcm1FcnJvciBmaWVsZD17ZmllbGR9IC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgICB9fVxuICAgIDwvRm9ybUZpZWxkPlxuICApXG59XG4iXX0=