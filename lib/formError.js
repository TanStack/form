'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
//


exports.default = FormError;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _formField = require('./formField');

var _formField2 = _interopRequireDefault(_formField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FormError(_ref) {
  var field = _ref.field,
      className = _ref.className,
      style = _ref.style;

  return _react2.default.createElement(
    _formField2.default,
    { field: field },
    function (_ref2) {
      var getTouched = _ref2.getTouched,
          getError = _ref2.getError;

      var touched = getTouched();
      var error = getError();
      var styles = {
        display: touched && error ? 'block' : 'none'
      };
      var classes = (0, _classnames2.default)('FormError', className);
      return _react2.default.createElement(
        'div',
        {
          className: classes,
          style: _extends({}, styles, style)
        },
        touched && typeof error === 'string' ? error : ''
      );
    }
  );
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9mb3JtRXJyb3IuanMiXSwibmFtZXMiOlsiRm9ybUVycm9yIiwiZmllbGQiLCJjbGFzc05hbWUiLCJzdHlsZSIsImdldFRvdWNoZWQiLCJnZXRFcnJvciIsInRvdWNoZWQiLCJlcnJvciIsInN0eWxlcyIsImRpc3BsYXkiLCJjbGFzc2VzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7OztrQkFHd0JBLFM7O0FBTHhCOzs7O0FBQ0E7Ozs7QUFFQTs7Ozs7O0FBRWUsU0FBU0EsU0FBVCxPQUErQztBQUFBLE1BQTFCQyxLQUEwQixRQUExQkEsS0FBMEI7QUFBQSxNQUFuQkMsU0FBbUIsUUFBbkJBLFNBQW1CO0FBQUEsTUFBUkMsS0FBUSxRQUFSQSxLQUFROztBQUM1RCxTQUNFO0FBQUE7QUFBQSxNQUFXLE9BQU9GLEtBQWxCO0FBQ0cscUJBQTRCO0FBQUEsVUFBMUJHLFVBQTBCLFNBQTFCQSxVQUEwQjtBQUFBLFVBQWRDLFFBQWMsU0FBZEEsUUFBYzs7QUFDM0IsVUFBTUMsVUFBVUYsWUFBaEI7QUFDQSxVQUFNRyxRQUFRRixVQUFkO0FBQ0EsVUFBTUcsU0FBUztBQUNiQyxpQkFBU0gsV0FBV0MsS0FBWCxHQUFtQixPQUFuQixHQUE2QjtBQUR6QixPQUFmO0FBR0EsVUFBTUcsVUFBVSwwQkFBVyxXQUFYLEVBQXdCUixTQUF4QixDQUFoQjtBQUNBLGFBQ0U7QUFBQTtBQUFBO0FBQ0UscUJBQVdRLE9BRGI7QUFFRSxpQkFBTyxTQUFjLEVBQWQsRUFBa0JGLE1BQWxCLEVBQTBCTCxLQUExQjtBQUZUO0FBSUdHLG1CQUFXLE9BQU9DLEtBQVAsS0FBaUIsUUFBNUIsR0FBdUNBLEtBQXZDLEdBQStDO0FBSmxELE9BREY7QUFRRDtBQWhCSCxHQURGO0FBb0JEIiwiZmlsZSI6ImZvcm1FcnJvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnXG4vL1xuaW1wb3J0IEZvcm1GaWVsZCBmcm9tICcuL2Zvcm1GaWVsZCdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRm9ybUVycm9yICh7ZmllbGQsIGNsYXNzTmFtZSwgc3R5bGV9KSB7XG4gIHJldHVybiAoXG4gICAgPEZvcm1GaWVsZCBmaWVsZD17ZmllbGR9PlxuICAgICAgeyh7Z2V0VG91Y2hlZCwgZ2V0RXJyb3J9KSA9PiB7XG4gICAgICAgIGNvbnN0IHRvdWNoZWQgPSBnZXRUb3VjaGVkKClcbiAgICAgICAgY29uc3QgZXJyb3IgPSBnZXRFcnJvcigpXG4gICAgICAgIGNvbnN0IHN0eWxlcyA9IHtcbiAgICAgICAgICBkaXNwbGF5OiB0b3VjaGVkICYmIGVycm9yID8gJ2Jsb2NrJyA6ICdub25lJ1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSBjbGFzc25hbWVzKCdGb3JtRXJyb3InLCBjbGFzc05hbWUpXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc2VzfVxuICAgICAgICAgICAgc3R5bGU9e09iamVjdC5hc3NpZ24oe30sIHN0eWxlcywgc3R5bGUpfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0b3VjaGVkICYmIHR5cGVvZiBlcnJvciA9PT0gJ3N0cmluZycgPyBlcnJvciA6ICcnfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgICB9fVxuICAgIDwvRm9ybUZpZWxkPlxuICApXG59XG4iXX0=