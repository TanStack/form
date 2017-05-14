'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = FormInputTextarea;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _util = require('./util');

var _formInput = require('../formInput');

var _formInput2 = _interopRequireDefault(_formInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
//


function FormInputTextarea(_ref) {
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

      return _react2.default.createElement('textarea', _extends({}, rest, {
        value: getValue(),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtSW5wdXRzL3RleHRhcmVhLmpzIl0sIm5hbWVzIjpbIkZvcm1JbnB1dFRleHRhcmVhIiwiZmllbGQiLCJzaG93RXJyb3JzIiwiZXJyb3JCZWZvcmUiLCJvbkNoYW5nZSIsIm9uQmx1ciIsImlzRm9ybSIsIm5vVG91Y2giLCJyZXN0Iiwic2V0VmFsdWUiLCJnZXRWYWx1ZSIsInNldFRvdWNoZWQiLCJlIiwidGFyZ2V0IiwidmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O2tCQUt3QkEsaUI7O0FBTHhCOzs7O0FBRUE7O0FBQ0E7Ozs7Ozs7QUFGQTs7O0FBSWUsU0FBU0EsaUJBQVQsT0FTWjtBQUFBLE1BUkRDLEtBUUMsUUFSREEsS0FRQztBQUFBLE1BUERDLFVBT0MsUUFQREEsVUFPQztBQUFBLE1BTkRDLFdBTUMsUUFOREEsV0FNQztBQUFBLE1BTERDLFFBS0MsUUFMREEsUUFLQztBQUFBLE1BSkRDLE1BSUMsUUFKREEsTUFJQztBQUFBLE1BSERDLE1BR0MsUUFIREEsTUFHQztBQUFBLE1BRkRDLE9BRUMsUUFGREEsT0FFQztBQUFBLE1BREVDLElBQ0Y7O0FBQ0QsU0FDRTtBQUFBO0FBQUEsTUFBVyxPQUFPUCxLQUFsQixFQUF5QixZQUFZQyxVQUFyQyxFQUFpRCxhQUFhQyxXQUE5RCxFQUEyRSxRQUFRRyxNQUFuRjtBQUNHLHFCQUFzQztBQUFBLFVBQXBDRyxRQUFvQyxTQUFwQ0EsUUFBb0M7QUFBQSxVQUExQkMsUUFBMEIsU0FBMUJBLFFBQTBCO0FBQUEsVUFBaEJDLFVBQWdCLFNBQWhCQSxVQUFnQjs7QUFDckMsYUFDRSx1REFDTUgsSUFETjtBQUVFLGVBQU9FLFVBRlQ7QUFHRSxrQkFBVSx3QkFBYU4sUUFBYixFQUF1QjtBQUFBLGlCQUFLSyxTQUFTRyxFQUFFQyxNQUFGLENBQVNDLEtBQWxCLEVBQXlCUCxPQUF6QixDQUFMO0FBQUEsU0FBdkIsQ0FIWjtBQUlFLGdCQUFRLHdCQUFhRixNQUFiLEVBQXFCO0FBQUEsaUJBQU1NLFlBQU47QUFBQSxTQUFyQjtBQUpWLFNBREY7QUFRRDtBQVZILEdBREY7QUFjRCIsImZpbGUiOiJ0ZXh0YXJlYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbi8vXG5pbXBvcnQgeyBidWlsZEhhbmRsZXIgfSBmcm9tICcuL3V0aWwnXG5pbXBvcnQgRm9ybUlucHV0IGZyb20gJy4uL2Zvcm1JbnB1dCdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRm9ybUlucHV0VGV4dGFyZWEgKHtcbiAgZmllbGQsXG4gIHNob3dFcnJvcnMsXG4gIGVycm9yQmVmb3JlLFxuICBvbkNoYW5nZSxcbiAgb25CbHVyLFxuICBpc0Zvcm0sXG4gIG5vVG91Y2gsXG4gIC4uLnJlc3Rcbn0pIHtcbiAgcmV0dXJuIChcbiAgICA8Rm9ybUlucHV0IGZpZWxkPXtmaWVsZH0gc2hvd0Vycm9ycz17c2hvd0Vycm9yc30gZXJyb3JCZWZvcmU9e2Vycm9yQmVmb3JlfSBpc0Zvcm09e2lzRm9ybX0+XG4gICAgICB7KHtzZXRWYWx1ZSwgZ2V0VmFsdWUsIHNldFRvdWNoZWR9KSA9PiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPHRleHRhcmVhXG4gICAgICAgICAgICB7Li4ucmVzdH1cbiAgICAgICAgICAgIHZhbHVlPXtnZXRWYWx1ZSgpfVxuICAgICAgICAgICAgb25DaGFuZ2U9e2J1aWxkSGFuZGxlcihvbkNoYW5nZSwgZSA9PiBzZXRWYWx1ZShlLnRhcmdldC52YWx1ZSwgbm9Ub3VjaCkpfVxuICAgICAgICAgICAgb25CbHVyPXtidWlsZEhhbmRsZXIob25CbHVyLCAoKSA9PiBzZXRUb3VjaGVkKCkpfVxuICAgICAgICAgIC8+XG4gICAgICAgIClcbiAgICAgIH19XG4gICAgPC9Gb3JtSW5wdXQ+XG4gIClcbn1cbiJdfQ==