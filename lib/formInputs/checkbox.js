'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = FormInputCheckbox;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _util = require('./util');

var _formInput = require('../formInput');

var _formInput2 = _interopRequireDefault(_formInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
//


function FormInputCheckbox(_ref) {
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
        type: 'checkbox',
        checked: getValue(),
        onChange: (0, _util.buildHandler)(onChange, function (e) {
          return setValue(e.target.checked, noTouch);
        }),
        onBlur: (0, _util.buildHandler)(onBlur, function () {
          return setTouched();
        })
      }));
    }
  );
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtSW5wdXRzL2NoZWNrYm94LmpzIl0sIm5hbWVzIjpbIkZvcm1JbnB1dENoZWNrYm94IiwiZmllbGQiLCJzaG93RXJyb3JzIiwiZXJyb3JCZWZvcmUiLCJvbkNoYW5nZSIsIm9uQmx1ciIsImlzRm9ybSIsIm5vVG91Y2giLCJyZXN0Iiwic2V0VmFsdWUiLCJnZXRWYWx1ZSIsInNldFRvdWNoZWQiLCJlIiwidGFyZ2V0IiwiY2hlY2tlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7a0JBS3dCQSxpQjs7QUFMeEI7Ozs7QUFFQTs7QUFDQTs7Ozs7OztBQUZBOzs7QUFJZSxTQUFTQSxpQkFBVCxPQVNaO0FBQUEsTUFSREMsS0FRQyxRQVJEQSxLQVFDO0FBQUEsTUFQREMsVUFPQyxRQVBEQSxVQU9DO0FBQUEsTUFOREMsV0FNQyxRQU5EQSxXQU1DO0FBQUEsTUFMREMsUUFLQyxRQUxEQSxRQUtDO0FBQUEsTUFKREMsTUFJQyxRQUpEQSxNQUlDO0FBQUEsTUFIREMsTUFHQyxRQUhEQSxNQUdDO0FBQUEsTUFGREMsT0FFQyxRQUZEQSxPQUVDO0FBQUEsTUFERUMsSUFDRjs7QUFDRCxTQUNFO0FBQUE7QUFBQSxNQUFXLE9BQU9QLEtBQWxCLEVBQXlCLFlBQVlDLFVBQXJDLEVBQWlELGFBQWFDLFdBQTlELEVBQTJFLFFBQVFHLE1BQW5GO0FBQ0cscUJBQXNDO0FBQUEsVUFBcENHLFFBQW9DLFNBQXBDQSxRQUFvQztBQUFBLFVBQTFCQyxRQUEwQixTQUExQkEsUUFBMEI7QUFBQSxVQUFoQkMsVUFBZ0IsU0FBaEJBLFVBQWdCOztBQUNyQyxhQUNFLG9EQUNNSCxJQUROO0FBRUUsY0FBSyxVQUZQO0FBR0UsaUJBQVNFLFVBSFg7QUFJRSxrQkFBVSx3QkFBYU4sUUFBYixFQUF1QjtBQUFBLGlCQUFLSyxTQUFTRyxFQUFFQyxNQUFGLENBQVNDLE9BQWxCLEVBQTJCUCxPQUEzQixDQUFMO0FBQUEsU0FBdkIsQ0FKWjtBQUtFLGdCQUFRLHdCQUFhRixNQUFiLEVBQXFCO0FBQUEsaUJBQU1NLFlBQU47QUFBQSxTQUFyQjtBQUxWLFNBREY7QUFTRDtBQVhILEdBREY7QUFlRCIsImZpbGUiOiJjaGVja2JveC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbi8vXG5pbXBvcnQgeyBidWlsZEhhbmRsZXIgfSBmcm9tICcuL3V0aWwnXG5pbXBvcnQgRm9ybUlucHV0IGZyb20gJy4uL2Zvcm1JbnB1dCdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRm9ybUlucHV0Q2hlY2tib3ggKHtcbiAgZmllbGQsXG4gIHNob3dFcnJvcnMsXG4gIGVycm9yQmVmb3JlLFxuICBvbkNoYW5nZSxcbiAgb25CbHVyLFxuICBpc0Zvcm0sXG4gIG5vVG91Y2gsXG4gIC4uLnJlc3Rcbn0pIHtcbiAgcmV0dXJuIChcbiAgICA8Rm9ybUlucHV0IGZpZWxkPXtmaWVsZH0gc2hvd0Vycm9ycz17c2hvd0Vycm9yc30gZXJyb3JCZWZvcmU9e2Vycm9yQmVmb3JlfSBpc0Zvcm09e2lzRm9ybX0+XG4gICAgICB7KHtzZXRWYWx1ZSwgZ2V0VmFsdWUsIHNldFRvdWNoZWR9KSA9PiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB7Li4ucmVzdH1cbiAgICAgICAgICAgIHR5cGU9J2NoZWNrYm94J1xuICAgICAgICAgICAgY2hlY2tlZD17Z2V0VmFsdWUoKX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtidWlsZEhhbmRsZXIob25DaGFuZ2UsIGUgPT4gc2V0VmFsdWUoZS50YXJnZXQuY2hlY2tlZCwgbm9Ub3VjaCkpfVxuICAgICAgICAgICAgb25CbHVyPXtidWlsZEhhbmRsZXIob25CbHVyLCAoKSA9PiBzZXRUb3VjaGVkKCkpfVxuICAgICAgICAgIC8+XG4gICAgICAgIClcbiAgICAgIH19XG4gICAgPC9Gb3JtSW5wdXQ+XG4gIClcbn1cbiJdfQ==