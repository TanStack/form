'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
//


var noop = function noop() {};

exports.default = _react2.default.createClass({
  displayName: 'radio',

  contextTypes: {
    formRadioGroup: _react2.default.PropTypes.object
  },
  render: function render() {
    var _props = this.props,
        value = _props.value,
        onClick = _props.onClick,
        onChange = _props.onChange,
        onBlur = _props.onBlur,
        rest = _objectWithoutProperties(_props, ['value', 'onClick', 'onChange', 'onBlur']);

    var _context$formRadioGro = this.context.formRadioGroup,
        setValue = _context$formRadioGro.setValue,
        getValue = _context$formRadioGro.getValue,
        setTouched = _context$formRadioGro.setTouched,
        noTouch = _context$formRadioGro.props.noTouch;

    return _react2.default.createElement('input', _extends({}, rest, {
      type: 'radio',
      checked: getValue(false) === value,
      onChange: (0, _util.buildHandler)(onChange, noop),
      onClick: (0, _util.buildHandler)(onClick, function (e) {
        return setValue(value, noTouch);
      }),
      onBlur: (0, _util.buildHandler)(onBlur, function () {
        return setTouched();
      })
    }));
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtSW5wdXRzL3JhZGlvLmpzIl0sIm5hbWVzIjpbIm5vb3AiLCJjcmVhdGVDbGFzcyIsImNvbnRleHRUeXBlcyIsImZvcm1SYWRpb0dyb3VwIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwicmVuZGVyIiwicHJvcHMiLCJ2YWx1ZSIsIm9uQ2xpY2siLCJvbkNoYW5nZSIsIm9uQmx1ciIsInJlc3QiLCJjb250ZXh0Iiwic2V0VmFsdWUiLCJnZXRWYWx1ZSIsInNldFRvdWNoZWQiLCJub1RvdWNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBRUE7Ozs7O0FBREE7OztBQUVBLElBQU1BLE9BQU8sU0FBUEEsSUFBTyxHQUFNLENBQUUsQ0FBckI7O2tCQUVlLGdCQUFNQyxXQUFOLENBQWtCO0FBQUE7O0FBQy9CQyxnQkFBYztBQUNaQyxvQkFBZ0IsZ0JBQU1DLFNBQU4sQ0FBZ0JDO0FBRHBCLEdBRGlCO0FBSS9CQyxRQUorQixvQkFJckI7QUFBQSxpQkFDOEMsS0FBS0MsS0FEbkQ7QUFBQSxRQUNBQyxLQURBLFVBQ0FBLEtBREE7QUFBQSxRQUNPQyxPQURQLFVBQ09BLE9BRFA7QUFBQSxRQUNnQkMsUUFEaEIsVUFDZ0JBLFFBRGhCO0FBQUEsUUFDMEJDLE1BRDFCLFVBQzBCQSxNQUQxQjtBQUFBLFFBQ3FDQyxJQURyQzs7QUFBQSxnQ0FFcUQsS0FBS0MsT0FBTCxDQUFhVixjQUZsRTtBQUFBLFFBRURXLFFBRkMseUJBRURBLFFBRkM7QUFBQSxRQUVTQyxRQUZULHlCQUVTQSxRQUZUO0FBQUEsUUFFbUJDLFVBRm5CLHlCQUVtQkEsVUFGbkI7QUFBQSxRQUV3Q0MsT0FGeEMseUJBRStCVixLQUYvQixDQUV3Q1UsT0FGeEM7O0FBR1IsV0FDRSxvREFDTUwsSUFETjtBQUVFLFlBQUssT0FGUDtBQUdFLGVBQVNHLFNBQVMsS0FBVCxNQUFvQlAsS0FIL0I7QUFJRSxnQkFBVSx3QkFBYUUsUUFBYixFQUF1QlYsSUFBdkIsQ0FKWjtBQUtFLGVBQVMsd0JBQWFTLE9BQWIsRUFBc0I7QUFBQSxlQUFLSyxTQUFTTixLQUFULEVBQWdCUyxPQUFoQixDQUFMO0FBQUEsT0FBdEIsQ0FMWDtBQU1FLGNBQVEsd0JBQWFOLE1BQWIsRUFBcUI7QUFBQSxlQUFNSyxZQUFOO0FBQUEsT0FBckI7QUFOVixPQURGO0FBVUQ7QUFqQjhCLENBQWxCLEMiLCJmaWxlIjoicmFkaW8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG4vL1xuaW1wb3J0IHsgYnVpbGRIYW5kbGVyIH0gZnJvbSAnLi91dGlsJ1xuY29uc3Qgbm9vcCA9ICgpID0+IHt9XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgY29udGV4dFR5cGVzOiB7XG4gICAgZm9ybVJhZGlvR3JvdXA6IFJlYWN0LlByb3BUeXBlcy5vYmplY3RcbiAgfSxcbiAgcmVuZGVyICgpIHtcbiAgICBjb25zdCB7IHZhbHVlLCBvbkNsaWNrLCBvbkNoYW5nZSwgb25CbHVyLCAuLi5yZXN0IH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3Qge3NldFZhbHVlLCBnZXRWYWx1ZSwgc2V0VG91Y2hlZCwgcHJvcHM6IHsgbm9Ub3VjaCB9fSA9IHRoaXMuY29udGV4dC5mb3JtUmFkaW9Hcm91cFxuICAgIHJldHVybiAoXG4gICAgICA8aW5wdXRcbiAgICAgICAgey4uLnJlc3R9XG4gICAgICAgIHR5cGU9J3JhZGlvJ1xuICAgICAgICBjaGVja2VkPXtnZXRWYWx1ZShmYWxzZSkgPT09IHZhbHVlfVxuICAgICAgICBvbkNoYW5nZT17YnVpbGRIYW5kbGVyKG9uQ2hhbmdlLCBub29wKX1cbiAgICAgICAgb25DbGljaz17YnVpbGRIYW5kbGVyKG9uQ2xpY2ssIGUgPT4gc2V0VmFsdWUodmFsdWUsIG5vVG91Y2gpKX1cbiAgICAgICAgb25CbHVyPXtidWlsZEhhbmRsZXIob25CbHVyLCAoKSA9PiBzZXRUb3VjaGVkKCkpfVxuICAgICAgLz5cbiAgICApXG4gIH1cbn0pXG4iXX0=