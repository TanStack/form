'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = FormInputText;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _util = require('./util');

var _formInput = require('../formInput');

var _formInput2 = _interopRequireDefault(_formInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
//


function FormInputText(_ref) {
  var field = _ref.field,
      showErrors = _ref.showErrors,
      errorBefore = _ref.errorBefore,
      onChange = _ref.onChange,
      onBlur = _ref.onBlur,
      isForm = _ref.isForm,
      noTouch = _ref.noTouch,
      rest = _objectWithoutProperties(_ref, ['field', 'showErrors', 'errorBefore', 'onChange', 'onBlur', 'isForm', 'noTouch']);

  return _react2.default.createElement(
    _formInput2.default,
    { field: field, showErrors: showErrors, errorBefore: errorBefore, isForm: isForm },
    function (_ref2) {
      var setValue = _ref2.setValue,
          getValue = _ref2.getValue,
          setTouched = _ref2.setTouched;

      return _react2.default.createElement('input', _extends({}, rest, {
        value: getValue(''),
        onChange: (0, _util.buildHandler)(onChange, function (e) {
          return setValue(e.target.value, noTouch);
        }),
        onBlur: (0, _util.buildHandler)(onBlur, function () {
          return setTouched();
        })
      }));
    }
  );
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtSW5wdXRzL3RleHQuanMiXSwibmFtZXMiOlsiRm9ybUlucHV0VGV4dCIsImZpZWxkIiwic2hvd0Vycm9ycyIsImVycm9yQmVmb3JlIiwib25DaGFuZ2UiLCJvbkJsdXIiLCJpc0Zvcm0iLCJub1RvdWNoIiwicmVzdCIsInNldFZhbHVlIiwiZ2V0VmFsdWUiLCJzZXRUb3VjaGVkIiwiZSIsInRhcmdldCIsInZhbHVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztrQkFLd0JBLGE7O0FBTHhCOzs7O0FBRUE7O0FBQ0E7Ozs7Ozs7QUFGQTs7O0FBSWUsU0FBU0EsYUFBVCxPQVNaO0FBQUEsTUFSREMsS0FRQyxRQVJEQSxLQVFDO0FBQUEsTUFQREMsVUFPQyxRQVBEQSxVQU9DO0FBQUEsTUFOREMsV0FNQyxRQU5EQSxXQU1DO0FBQUEsTUFMREMsUUFLQyxRQUxEQSxRQUtDO0FBQUEsTUFKREMsTUFJQyxRQUpEQSxNQUlDO0FBQUEsTUFIREMsTUFHQyxRQUhEQSxNQUdDO0FBQUEsTUFGREMsT0FFQyxRQUZEQSxPQUVDO0FBQUEsTUFERUMsSUFDRjs7QUFDRCxTQUNFO0FBQUE7QUFBQSxNQUFXLE9BQU9QLEtBQWxCLEVBQXlCLFlBQVlDLFVBQXJDLEVBQWlELGFBQWFDLFdBQTlELEVBQTJFLFFBQVFHLE1BQW5GO0FBQ0cscUJBQXNDO0FBQUEsVUFBcENHLFFBQW9DLFNBQXBDQSxRQUFvQztBQUFBLFVBQTFCQyxRQUEwQixTQUExQkEsUUFBMEI7QUFBQSxVQUFoQkMsVUFBZ0IsU0FBaEJBLFVBQWdCOztBQUNyQyxhQUNFLG9EQUNNSCxJQUROO0FBRUUsZUFBT0UsU0FBUyxFQUFULENBRlQ7QUFHRSxrQkFBVSx3QkFBYU4sUUFBYixFQUF1QjtBQUFBLGlCQUFLSyxTQUFTRyxFQUFFQyxNQUFGLENBQVNDLEtBQWxCLEVBQXlCUCxPQUF6QixDQUFMO0FBQUEsU0FBdkIsQ0FIWjtBQUlFLGdCQUFRLHdCQUFhRixNQUFiLEVBQXFCO0FBQUEsaUJBQU1NLFlBQU47QUFBQSxTQUFyQjtBQUpWLFNBREY7QUFRRDtBQVZILEdBREY7QUFjRCIsImZpbGUiOiJ0ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuLy9cbmltcG9ydCB7IGJ1aWxkSGFuZGxlciB9IGZyb20gJy4vdXRpbCdcbmltcG9ydCBGb3JtSW5wdXQgZnJvbSAnLi4vZm9ybUlucHV0J1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBGb3JtSW5wdXRUZXh0ICh7XG4gIGZpZWxkLFxuICBzaG93RXJyb3JzLFxuICBlcnJvckJlZm9yZSxcbiAgb25DaGFuZ2UsXG4gIG9uQmx1cixcbiAgaXNGb3JtLFxuICBub1RvdWNoLFxuICAuLi5yZXN0XG59KSB7XG4gIHJldHVybiAoXG4gICAgPEZvcm1JbnB1dCBmaWVsZD17ZmllbGR9IHNob3dFcnJvcnM9e3Nob3dFcnJvcnN9IGVycm9yQmVmb3JlPXtlcnJvckJlZm9yZX0gaXNGb3JtPXtpc0Zvcm19PlxuICAgICAgeyh7c2V0VmFsdWUsIGdldFZhbHVlLCBzZXRUb3VjaGVkfSkgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgey4uLnJlc3R9XG4gICAgICAgICAgICB2YWx1ZT17Z2V0VmFsdWUoJycpfVxuICAgICAgICAgICAgb25DaGFuZ2U9e2J1aWxkSGFuZGxlcihvbkNoYW5nZSwgZSA9PiBzZXRWYWx1ZShlLnRhcmdldC52YWx1ZSwgbm9Ub3VjaCkpfVxuICAgICAgICAgICAgb25CbHVyPXtidWlsZEhhbmRsZXIob25CbHVyLCAoKSA9PiBzZXRUb3VjaGVkKCkpfVxuICAgICAgICAgIC8+XG4gICAgICAgIClcbiAgICAgIH19XG4gICAgPC9Gb3JtSW5wdXQ+XG4gIClcbn1cbiJdfQ==