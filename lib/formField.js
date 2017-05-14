'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FormField;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FormField(_ref, context) {
  var field = _ref.field,
      children = _ref.children;

  var bind = function bind(cb) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return function () {
      for (var _len2 = arguments.length, args2 = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args2[_key2] = arguments[_key2];
      }

      return cb.apply(undefined, args.concat(args2));
    };
  };
  return children(field ? _utils2.default.mapValues(context.formAPI, function (d) {
    return bind(d, field);
  }) : context.formAPI);
}
//

FormField.contextTypes = {
  formAPI: _react2.default.PropTypes.object
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9mb3JtRmllbGQuanMiXSwibmFtZXMiOlsiRm9ybUZpZWxkIiwiY29udGV4dCIsImZpZWxkIiwiY2hpbGRyZW4iLCJiaW5kIiwiY2IiLCJhcmdzIiwiYXJnczIiLCJtYXBWYWx1ZXMiLCJmb3JtQVBJIiwiZCIsImNvbnRleHRUeXBlcyIsIlByb3BUeXBlcyIsIm9iamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBSXdCQSxTOztBQUp4Qjs7OztBQUVBOzs7Ozs7QUFFZSxTQUFTQSxTQUFULE9BQXVDQyxPQUF2QyxFQUFnRDtBQUFBLE1BQTNCQyxLQUEyQixRQUEzQkEsS0FBMkI7QUFBQSxNQUFwQkMsUUFBb0IsUUFBcEJBLFFBQW9COztBQUM3RCxNQUFNQyxPQUFPLFNBQVBBLElBQU8sQ0FBQ0MsRUFBRDtBQUFBLHNDQUFRQyxJQUFSO0FBQVFBLFVBQVI7QUFBQTs7QUFBQSxXQUFpQjtBQUFBLHlDQUFJQyxLQUFKO0FBQUlBLGFBQUo7QUFBQTs7QUFBQSxhQUFjRixvQkFBTUMsSUFBTixRQUFlQyxLQUFmLEVBQWQ7QUFBQSxLQUFqQjtBQUFBLEdBQWI7QUFDQSxTQUFPSixTQUFTRCxRQUFRLGdCQUFFTSxTQUFGLENBQVlQLFFBQVFRLE9BQXBCLEVBQTZCO0FBQUEsV0FBS0wsS0FBS00sQ0FBTCxFQUFRUixLQUFSLENBQUw7QUFBQSxHQUE3QixDQUFSLEdBQTRERCxRQUFRUSxPQUE3RSxDQUFQO0FBQ0Q7QUFORDs7QUFPQVQsVUFBVVcsWUFBVixHQUF5QjtBQUN2QkYsV0FBUyxnQkFBTUcsU0FBTixDQUFnQkM7QUFERixDQUF6QiIsImZpbGUiOiJmb3JtRmllbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG4vL1xuaW1wb3J0IF8gZnJvbSAnLi91dGlscydcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRm9ybUZpZWxkICh7ZmllbGQsIGNoaWxkcmVufSwgY29udGV4dCkge1xuICBjb25zdCBiaW5kID0gKGNiLCAuLi5hcmdzKSA9PiAoLi4uYXJnczIpID0+IGNiKC4uLmFyZ3MsIC4uLmFyZ3MyKVxuICByZXR1cm4gY2hpbGRyZW4oZmllbGQgPyBfLm1hcFZhbHVlcyhjb250ZXh0LmZvcm1BUEksIGQgPT4gYmluZChkLCBmaWVsZCkpIDogY29udGV4dC5mb3JtQVBJKVxufVxuRm9ybUZpZWxkLmNvbnRleHRUeXBlcyA9IHtcbiAgZm9ybUFQSTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdFxufVxuIl19