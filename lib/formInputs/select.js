'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = FormInputSelect;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _util = require('./util');

var _formInput = require('../formInput');

var _formInput2 = _interopRequireDefault(_formInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
//


function FormInputSelect(_ref) {
  var options = _ref.options,
      field = _ref.field,
      showErrors = _ref.showErrors,
      errorBefore = _ref.errorBefore,
      onChange = _ref.onChange,
      onBlur = _ref.onBlur,
      isForm = _ref.isForm,
      noTouch = _ref.noTouch,
      rest = _objectWithoutProperties(_ref, ['options', 'field', 'showErrors', 'errorBefore', 'onChange', 'onBlur', 'isForm', 'noTouch']);

  return _react2.default.createElement(
    _formInput2.default,
    { field: field, showErrors: showErrors, errorBefore: errorBefore, isForm: isForm },
    function (_ref2) {
      var setValue = _ref2.setValue,
          getValue = _ref2.getValue,
          setTouched = _ref2.setTouched;

      var resolvedOptions = options.find(function (d) {
        return d.value === '';
      }) ? options : [{
        label: 'Select One...',
        value: '',
        disabled: true
      }].concat(_toConsumableArray(options));
      var selectedIndex = resolvedOptions.findIndex(function (d) {
        return d.value === getValue();
      });
      var nullIndex = resolvedOptions.findIndex(function (d) {
        return d.value === '';
      });
      return _react2.default.createElement(
        'select',
        _extends({}, rest, {
          onChange: (0, _util.buildHandler)(onChange, function (e) {
            var val = resolvedOptions[e.target.value].value;
            setValue(val, noTouch);
          }),
          onBlur: (0, _util.buildHandler)(onBlur, function () {
            return setTouched();
          }),
          value: selectedIndex > -1 ? selectedIndex : nullIndex
        }),
        resolvedOptions.map(function (option, i) {
          return _react2.default.createElement(
            'option',
            {
              key: i,
              value: i,
              disabled: option.disabled
            },
            option.label
          );
        })
      );
    }
  );
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtSW5wdXRzL3NlbGVjdC5qcyJdLCJuYW1lcyI6WyJGb3JtSW5wdXRTZWxlY3QiLCJvcHRpb25zIiwiZmllbGQiLCJzaG93RXJyb3JzIiwiZXJyb3JCZWZvcmUiLCJvbkNoYW5nZSIsIm9uQmx1ciIsImlzRm9ybSIsIm5vVG91Y2giLCJyZXN0Iiwic2V0VmFsdWUiLCJnZXRWYWx1ZSIsInNldFRvdWNoZWQiLCJyZXNvbHZlZE9wdGlvbnMiLCJmaW5kIiwiZCIsInZhbHVlIiwibGFiZWwiLCJkaXNhYmxlZCIsInNlbGVjdGVkSW5kZXgiLCJmaW5kSW5kZXgiLCJudWxsSW5kZXgiLCJlIiwidmFsIiwidGFyZ2V0IiwibWFwIiwib3B0aW9uIiwiaSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7a0JBS3dCQSxlOztBQUx4Qjs7OztBQUVBOztBQUNBOzs7Ozs7Ozs7QUFGQTs7O0FBSWUsU0FBU0EsZUFBVCxPQVVaO0FBQUEsTUFUREMsT0FTQyxRQVREQSxPQVNDO0FBQUEsTUFSREMsS0FRQyxRQVJEQSxLQVFDO0FBQUEsTUFQREMsVUFPQyxRQVBEQSxVQU9DO0FBQUEsTUFOREMsV0FNQyxRQU5EQSxXQU1DO0FBQUEsTUFMREMsUUFLQyxRQUxEQSxRQUtDO0FBQUEsTUFKREMsTUFJQyxRQUpEQSxNQUlDO0FBQUEsTUFIREMsTUFHQyxRQUhEQSxNQUdDO0FBQUEsTUFGREMsT0FFQyxRQUZEQSxPQUVDO0FBQUEsTUFERUMsSUFDRjs7QUFDRCxTQUNFO0FBQUE7QUFBQSxNQUFXLE9BQU9QLEtBQWxCLEVBQXlCLFlBQVlDLFVBQXJDLEVBQWlELGFBQWFDLFdBQTlELEVBQTJFLFFBQVFHLE1BQW5GO0FBQ0cscUJBQXNDO0FBQUEsVUFBcENHLFFBQW9DLFNBQXBDQSxRQUFvQztBQUFBLFVBQTFCQyxRQUEwQixTQUExQkEsUUFBMEI7QUFBQSxVQUFoQkMsVUFBZ0IsU0FBaEJBLFVBQWdCOztBQUNyQyxVQUFNQyxrQkFBa0JaLFFBQVFhLElBQVIsQ0FBYTtBQUFBLGVBQUtDLEVBQUVDLEtBQUYsS0FBWSxFQUFqQjtBQUFBLE9BQWIsSUFBb0NmLE9BQXBDLElBQStDO0FBQ3JFZ0IsZUFBTyxlQUQ4RDtBQUVyRUQsZUFBTyxFQUY4RDtBQUdyRUUsa0JBQVU7QUFIMkQsT0FBL0MsNEJBSWxCakIsT0FKa0IsRUFBeEI7QUFLQSxVQUFNa0IsZ0JBQWdCTixnQkFBZ0JPLFNBQWhCLENBQTBCO0FBQUEsZUFBS0wsRUFBRUMsS0FBRixLQUFZTCxVQUFqQjtBQUFBLE9BQTFCLENBQXRCO0FBQ0EsVUFBTVUsWUFBWVIsZ0JBQWdCTyxTQUFoQixDQUEwQjtBQUFBLGVBQUtMLEVBQUVDLEtBQUYsS0FBWSxFQUFqQjtBQUFBLE9BQTFCLENBQWxCO0FBQ0EsYUFDRTtBQUFBO0FBQUEscUJBQ01QLElBRE47QUFFRSxvQkFBVSx3QkFBYUosUUFBYixFQUF1QixVQUFDaUIsQ0FBRCxFQUFPO0FBQ3RDLGdCQUFNQyxNQUFNVixnQkFBZ0JTLEVBQUVFLE1BQUYsQ0FBU1IsS0FBekIsRUFBZ0NBLEtBQTVDO0FBQ0FOLHFCQUFTYSxHQUFULEVBQWNmLE9BQWQ7QUFDRCxXQUhTLENBRlo7QUFNRSxrQkFBUSx3QkFBYUYsTUFBYixFQUFxQjtBQUFBLG1CQUFNTSxZQUFOO0FBQUEsV0FBckIsQ0FOVjtBQU9FLGlCQUFPTyxnQkFBZ0IsQ0FBQyxDQUFqQixHQUFxQkEsYUFBckIsR0FBcUNFO0FBUDlDO0FBU0dSLHdCQUFnQlksR0FBaEIsQ0FBb0IsVUFBQ0MsTUFBRCxFQUFTQyxDQUFULEVBQWU7QUFDbEMsaUJBQ0U7QUFBQTtBQUFBO0FBQ0UsbUJBQUtBLENBRFA7QUFFRSxxQkFBT0EsQ0FGVDtBQUdFLHdCQUFVRCxPQUFPUjtBQUhuQjtBQUtHUSxtQkFBT1Q7QUFMVixXQURGO0FBU0QsU0FWQTtBQVRILE9BREY7QUF1QkQ7QUFoQ0gsR0FERjtBQW9DRCIsImZpbGUiOiJzZWxlY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG4vL1xuaW1wb3J0IHsgYnVpbGRIYW5kbGVyIH0gZnJvbSAnLi91dGlsJ1xuaW1wb3J0IEZvcm1JbnB1dCBmcm9tICcuLi9mb3JtSW5wdXQnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEZvcm1JbnB1dFNlbGVjdCAoe1xuICBvcHRpb25zLFxuICBmaWVsZCxcbiAgc2hvd0Vycm9ycyxcbiAgZXJyb3JCZWZvcmUsXG4gIG9uQ2hhbmdlLFxuICBvbkJsdXIsXG4gIGlzRm9ybSxcbiAgbm9Ub3VjaCxcbiAgLi4ucmVzdFxufSkge1xuICByZXR1cm4gKFxuICAgIDxGb3JtSW5wdXQgZmllbGQ9e2ZpZWxkfSBzaG93RXJyb3JzPXtzaG93RXJyb3JzfSBlcnJvckJlZm9yZT17ZXJyb3JCZWZvcmV9IGlzRm9ybT17aXNGb3JtfT5cbiAgICAgIHsoe3NldFZhbHVlLCBnZXRWYWx1ZSwgc2V0VG91Y2hlZH0pID0+IHtcbiAgICAgICAgY29uc3QgcmVzb2x2ZWRPcHRpb25zID0gb3B0aW9ucy5maW5kKGQgPT4gZC52YWx1ZSA9PT0gJycpID8gb3B0aW9ucyA6IFt7XG4gICAgICAgICAgbGFiZWw6ICdTZWxlY3QgT25lLi4uJyxcbiAgICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgICAgZGlzYWJsZWQ6IHRydWVcbiAgICAgICAgfSwgLi4ub3B0aW9uc11cbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRJbmRleCA9IHJlc29sdmVkT3B0aW9ucy5maW5kSW5kZXgoZCA9PiBkLnZhbHVlID09PSBnZXRWYWx1ZSgpKVxuICAgICAgICBjb25zdCBudWxsSW5kZXggPSByZXNvbHZlZE9wdGlvbnMuZmluZEluZGV4KGQgPT4gZC52YWx1ZSA9PT0gJycpXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgey4uLnJlc3R9XG4gICAgICAgICAgICBvbkNoYW5nZT17YnVpbGRIYW5kbGVyKG9uQ2hhbmdlLCAoZSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCB2YWwgPSByZXNvbHZlZE9wdGlvbnNbZS50YXJnZXQudmFsdWVdLnZhbHVlXG4gICAgICAgICAgICAgIHNldFZhbHVlKHZhbCwgbm9Ub3VjaClcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgb25CbHVyPXtidWlsZEhhbmRsZXIob25CbHVyLCAoKSA9PiBzZXRUb3VjaGVkKCkpfVxuICAgICAgICAgICAgdmFsdWU9e3NlbGVjdGVkSW5kZXggPiAtMSA/IHNlbGVjdGVkSW5kZXggOiBudWxsSW5kZXh9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3Jlc29sdmVkT3B0aW9ucy5tYXAoKG9wdGlvbiwgaSkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxvcHRpb25cbiAgICAgICAgICAgICAgICAgIGtleT17aX1cbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtpfVxuICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e29wdGlvbi5kaXNhYmxlZH1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7b3B0aW9uLmxhYmVsfVxuICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgKVxuICAgICAgfX1cbiAgICA8L0Zvcm1JbnB1dD5cbiAgKVxufVxuIl19