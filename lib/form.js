'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormDefaultProps = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var noop = function noop() {};
var reop = function reop(d) {
  return d;
};

var FormDefaultProps = exports.FormDefaultProps = {
  loadState: noop,
  defaultValues: {},
  preValidate: reop,
  validate: function validate() {
    return null;
  },
  onValidationFail: noop,
  onChange: noop,
  saveState: noop,
  willUnmount: noop,
  preSubmit: reop,
  onSubmit: noop,
  postSubmit: noop,
  component: 'div'
};

exports.default = _react2.default.createClass({
  displayName: 'Form',
  childContextTypes: {
    formAPI: _react2.default.PropTypes.object
  },
  getChildContext: function getChildContext() {
    return {
      formAPI: this.getAPI()
    };
  },

  // Lifecycle
  getDefaultProps: function getDefaultProps() {
    return FormDefaultProps;
  },
  getInitialState: function getInitialState() {
    var _props = this.props,
        defaultValues = _props.defaultValues,
        values = _props.values,
        loadState = _props.loadState;

    var mergedValues = _extends({}, defaultValues, values);

    return loadState(this.props, this) || {
      values: mergedValues,
      touched: {},
      errors: this.validate(mergedValues),
      nestedErrors: {}
    };
  },
  componentWillMount: function componentWillMount() {
    this.emitChange(this.state, true);
  },
  componentWillReceiveProps: function componentWillReceiveProps(props) {
    if (props.values === this.props.values) {
      return;
    }

    this.setFormState({
      values: props.values || {}
    }, true);
  },
  componentWillUnmount: function componentWillUnmount() {
    this.props.willUnmount(this.state, this.props, this);
  },


  // API
  setAllValues: function setAllValues(values, noTouch) {
    if (noTouch) {
      return this.setFormState({ values: values });
    }
    this.setFormState({ values: values, touched: {} });
  },
  setValue: function setValue(field, value, noTouch) {
    var state = this.state;
    var values = _utils2.default.set(state.values, field, value);
    // Also set touched since the value is changing
    if (noTouch) {
      return this.setFormState({ values: values });
    }
    var touched = _utils2.default.set(state.touched, field);
    this.setFormState({ values: values, touched: touched });
  },
  getValue: function getValue(field, fallback) {
    var state = this.state;
    var val = _utils2.default.get(state.values, field);
    return typeof val !== 'undefined' ? val : fallback;
  },
  setNestedError: function setNestedError(field) {
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var nestedErrors = _utils2.default.set(this.state.nestedErrors, field, value);
    this.setFormState({ nestedErrors: nestedErrors });
  },
  getError: function getError(field) {
    return _utils2.default.get(this.state.errors, field);
  },
  setTouched: function setTouched(field) {
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var touched = _utils2.default.set(this.state.touched, field, value);
    this.setFormState({ touched: touched });
  },
  getTouched: function getTouched(field) {
    var state = this.state;
    if (this.state.dirty === true || this.props.touched === true) {
      return true;
    }
    return _utils2.default.get(state.touched, field);
  },
  addValue: function addValue(field, value) {
    var state = this.state;
    var values = _utils2.default.set(state.values, field, [].concat(_toConsumableArray(_utils2.default.get(state.values, field, [])), [value]));
    this.setFormState({ values: values });
  },
  removeValue: function removeValue(field, index) {
    var state = this.state;
    var fieldValue = _utils2.default.get(state.values, field, []);
    var values = _utils2.default.set(state.values, field, [].concat(_toConsumableArray(fieldValue.slice(0, index)), _toConsumableArray(fieldValue.slice(index + 1))));
    this.setFormState({ values: values });
  },
  swapValues: function swapValues(field, index, destIndex) {
    var state = this.state;

    var min = Math.min(index, destIndex);
    var max = Math.max(index, destIndex);

    var fieldValues = _utils2.default.get(state.values, field, []);
    var values = _utils2.default.set(state.values, field, [].concat(_toConsumableArray(fieldValues.slice(0, min)), [fieldValues[max]], _toConsumableArray(fieldValues.slice(min + 1, max)), [fieldValues[min]], _toConsumableArray(fieldValues.slice(max + 1))));
    this.setFormState({ values: values });
  },
  setAllTouched: function setAllTouched() {
    var dirty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var state = arguments[1];

    this.setFormState(_extends({}, state, {
      dirty: !!dirty
    }));
  },
  resetForm: function resetForm() {
    return this.setFormState(this.getInitialState());
  },
  submitForm: function submitForm(e) {
    e && e.preventDefault && e.preventDefault(e);
    var state = this.state;
    var errors = this.validate(state.values, state, this.props);
    if (errors) {
      if (!state.dirty) {
        this.setAllTouched(true, { errors: errors });
      }
      return this.props.onValidationFail(state.values, state, this.props, this);
    }
    var preSubmitValues = this.props.preSubmit(state.values, state, this.props, this);
    this.props.onSubmit(preSubmitValues, state, this.props, this);
    this.props.postSubmit(preSubmitValues, state, this.props, this);
  },


  // Utils
  getAPI: function getAPI() {
    return {
      setAllValues: this.setAllValues,
      setValue: this.setValue,
      getValue: this.getValue,
      setNestedError: this.setNestedError,
      getError: this.getError,
      setTouched: this.setTouched,
      getTouched: this.getTouched,
      addValue: this.addValue,
      removeValue: this.removeValue,
      swapValues: this.swapValues,
      setAllTouched: this.setAllTouched,
      resetForm: this.resetForm,
      submitForm: this.submitForm
    };
  },
  setFormState: function setFormState(newState, silent) {
    var _this = this;

    if (newState && newState.values && !newState.errors) {
      newState.values = this.props.preValidate(newState.values, newState, this.props, this);
      newState.errors = this.validate(newState.values, newState, this.props);
    }
    this.setState(newState, function () {
      _this.props.saveState(_this.state, _this.props, _this);
      if (!silent) {
        _this.emitChange(_this.state, _this.props);
      }
    });
  },
  emitChange: function emitChange(state, initial) {
    this.props.onChange(state, this.props, initial, this);
  },
  validate: function validate(values, state, props) {
    var errors = this.props.validate(removeNestedErrorValues(values, this.state ? this.state.nestedErrors : {}), state, props, this);
    return cleanErrors(errors);
  },

  // Render
  render: function render() {
    var props = _extends({}, this.props, this.state, this.getAPI());

    var component = props.component,
        children = props.children,
        rest = _objectWithoutProperties(props, ['component', 'children']);

    var resolvedChild = typeof children === 'function' ? children(rest) : children;
    var RootEl = component;
    if (!RootEl) {
      return resolvedChild;
    }
    return _react2.default.createElement(
      RootEl,
      { className: 'ReactForm' },
      resolvedChild
    );
  }
});

// Utils

function cleanErrors(err) {
  if (_utils2.default.isObject(err)) {
    var resolved = _utils2.default.mapValues(err, cleanErrors);
    var found = _utils2.default.pickBy(resolved, function (d) {
      return d;
    });
    return Object.keys(found).length ? resolved : undefined;
  }
  if (_utils2.default.isArray(err)) {
    var _resolved = err.map(cleanErrors);
    var _found = _resolved.find(function (d) {
      return d;
    });
    return _found ? _resolved : undefined;
  }
  return err;
}

// removeNestedErrorValues recurses the values object and turns any
// field that has a truthy corresponding nested form error field into undefined.
// This allows properly validating a nested form by detecting that undefined value
// in the validation function
function removeNestedErrorValues(values, nestedErrors) {
  var recurse = function recurse(current) {
    var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    if (_utils2.default.isObject(current)) {
      return _utils2.default.mapValues(current, function (d, i) {
        return recurse(d, [].concat(_toConsumableArray(path), [i]));
      });
    }
    if (_utils2.default.isArray(current)) {
      return current.map(function (d, key) {
        return recurse(d, [].concat(_toConsumableArray(path), [key]));
      });
    }
    if (!_utils2.default.isObject(current) && !_utils2.default.isArray(current) && current) {
      return _utils2.default.set(values, path, undefined);
    }
    return current;
  };
  recurse(nestedErrors);
  return values;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9mb3JtLmpzIl0sIm5hbWVzIjpbIm5vb3AiLCJyZW9wIiwiZCIsIkZvcm1EZWZhdWx0UHJvcHMiLCJsb2FkU3RhdGUiLCJkZWZhdWx0VmFsdWVzIiwicHJlVmFsaWRhdGUiLCJ2YWxpZGF0ZSIsIm9uVmFsaWRhdGlvbkZhaWwiLCJvbkNoYW5nZSIsInNhdmVTdGF0ZSIsIndpbGxVbm1vdW50IiwicHJlU3VibWl0Iiwib25TdWJtaXQiLCJwb3N0U3VibWl0IiwiY29tcG9uZW50IiwiY3JlYXRlQ2xhc3MiLCJkaXNwbGF5TmFtZSIsImNoaWxkQ29udGV4dFR5cGVzIiwiZm9ybUFQSSIsIlByb3BUeXBlcyIsIm9iamVjdCIsImdldENoaWxkQ29udGV4dCIsImdldEFQSSIsImdldERlZmF1bHRQcm9wcyIsImdldEluaXRpYWxTdGF0ZSIsInByb3BzIiwidmFsdWVzIiwibWVyZ2VkVmFsdWVzIiwidG91Y2hlZCIsImVycm9ycyIsIm5lc3RlZEVycm9ycyIsImNvbXBvbmVudFdpbGxNb3VudCIsImVtaXRDaGFuZ2UiLCJzdGF0ZSIsImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJzZXRGb3JtU3RhdGUiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsInNldEFsbFZhbHVlcyIsIm5vVG91Y2giLCJzZXRWYWx1ZSIsImZpZWxkIiwidmFsdWUiLCJzZXQiLCJnZXRWYWx1ZSIsImZhbGxiYWNrIiwidmFsIiwiZ2V0Iiwic2V0TmVzdGVkRXJyb3IiLCJnZXRFcnJvciIsInNldFRvdWNoZWQiLCJnZXRUb3VjaGVkIiwiZGlydHkiLCJhZGRWYWx1ZSIsInJlbW92ZVZhbHVlIiwiaW5kZXgiLCJmaWVsZFZhbHVlIiwic2xpY2UiLCJzd2FwVmFsdWVzIiwiZGVzdEluZGV4IiwibWluIiwiTWF0aCIsIm1heCIsImZpZWxkVmFsdWVzIiwic2V0QWxsVG91Y2hlZCIsInJlc2V0Rm9ybSIsInN1Ym1pdEZvcm0iLCJlIiwicHJldmVudERlZmF1bHQiLCJwcmVTdWJtaXRWYWx1ZXMiLCJuZXdTdGF0ZSIsInNpbGVudCIsInNldFN0YXRlIiwiaW5pdGlhbCIsInJlbW92ZU5lc3RlZEVycm9yVmFsdWVzIiwiY2xlYW5FcnJvcnMiLCJyZW5kZXIiLCJjaGlsZHJlbiIsInJlc3QiLCJyZXNvbHZlZENoaWxkIiwiUm9vdEVsIiwiZXJyIiwiaXNPYmplY3QiLCJyZXNvbHZlZCIsIm1hcFZhbHVlcyIsImZvdW5kIiwicGlja0J5IiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsImlzQXJyYXkiLCJtYXAiLCJmaW5kIiwicmVjdXJzZSIsImN1cnJlbnQiLCJwYXRoIiwiaSIsImtleSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7OztBQUVBLElBQU1BLE9BQU8sU0FBUEEsSUFBTyxHQUFNLENBQUUsQ0FBckI7QUFDQSxJQUFNQyxPQUFPLFNBQVBBLElBQU87QUFBQSxTQUFLQyxDQUFMO0FBQUEsQ0FBYjs7QUFFTyxJQUFNQyw4Q0FBbUI7QUFDOUJDLGFBQVdKLElBRG1CO0FBRTlCSyxpQkFBZSxFQUZlO0FBRzlCQyxlQUFhTCxJQUhpQjtBQUk5Qk0sWUFBVTtBQUFBLFdBQU0sSUFBTjtBQUFBLEdBSm9CO0FBSzlCQyxvQkFBa0JSLElBTFk7QUFNOUJTLFlBQVVULElBTm9CO0FBTzlCVSxhQUFXVixJQVBtQjtBQVE5QlcsZUFBYVgsSUFSaUI7QUFTOUJZLGFBQVdYLElBVG1CO0FBVTlCWSxZQUFVYixJQVZvQjtBQVc5QmMsY0FBWWQsSUFYa0I7QUFZOUJlLGFBQVc7QUFabUIsQ0FBekI7O2tCQWVRLGdCQUFNQyxXQUFOLENBQWtCO0FBQy9CQyxlQUFhLE1BRGtCO0FBRS9CQyxxQkFBbUI7QUFDakJDLGFBQVMsZ0JBQU1DLFNBQU4sQ0FBZ0JDO0FBRFIsR0FGWTtBQUsvQkMsaUJBTCtCLDZCQUtaO0FBQ2pCLFdBQU87QUFDTEgsZUFBUyxLQUFLSSxNQUFMO0FBREosS0FBUDtBQUdELEdBVDhCOztBQVUvQjtBQUNBQyxpQkFYK0IsNkJBV1o7QUFDakIsV0FBT3JCLGdCQUFQO0FBQ0QsR0FiOEI7QUFjL0JzQixpQkFkK0IsNkJBY1o7QUFBQSxpQkFLYixLQUFLQyxLQUxRO0FBQUEsUUFFZnJCLGFBRmUsVUFFZkEsYUFGZTtBQUFBLFFBR2ZzQixNQUhlLFVBR2ZBLE1BSGU7QUFBQSxRQUlmdkIsU0FKZSxVQUlmQSxTQUplOztBQU1qQixRQUFNd0IsNEJBQ0R2QixhQURDLEVBRURzQixNQUZDLENBQU47O0FBS0EsV0FBT3ZCLFVBQVUsS0FBS3NCLEtBQWYsRUFBc0IsSUFBdEIsS0FBK0I7QUFDcENDLGNBQVFDLFlBRDRCO0FBRXBDQyxlQUFTLEVBRjJCO0FBR3BDQyxjQUFRLEtBQUt2QixRQUFMLENBQWNxQixZQUFkLENBSDRCO0FBSXBDRyxvQkFBYztBQUpzQixLQUF0QztBQU1ELEdBL0I4QjtBQWdDL0JDLG9CQWhDK0IsZ0NBZ0NUO0FBQ3BCLFNBQUtDLFVBQUwsQ0FBZ0IsS0FBS0MsS0FBckIsRUFBNEIsSUFBNUI7QUFDRCxHQWxDOEI7QUFtQy9CQywyQkFuQytCLHFDQW1DSlQsS0FuQ0ksRUFtQ0c7QUFDaEMsUUFBSUEsTUFBTUMsTUFBTixLQUFpQixLQUFLRCxLQUFMLENBQVdDLE1BQWhDLEVBQXdDO0FBQ3RDO0FBQ0Q7O0FBRUQsU0FBS1MsWUFBTCxDQUFrQjtBQUNoQlQsY0FBUUQsTUFBTUMsTUFBTixJQUFnQjtBQURSLEtBQWxCLEVBRUcsSUFGSDtBQUdELEdBM0M4QjtBQTRDL0JVLHNCQTVDK0Isa0NBNENQO0FBQ3RCLFNBQUtYLEtBQUwsQ0FBV2YsV0FBWCxDQUF1QixLQUFLdUIsS0FBNUIsRUFBbUMsS0FBS1IsS0FBeEMsRUFBK0MsSUFBL0M7QUFDRCxHQTlDOEI7OztBQWdEL0I7QUFDQVksY0FqRCtCLHdCQWlEakJYLE1BakRpQixFQWlEVFksT0FqRFMsRUFpREE7QUFDN0IsUUFBSUEsT0FBSixFQUFhO0FBQ1gsYUFBTyxLQUFLSCxZQUFMLENBQWtCLEVBQUNULGNBQUQsRUFBbEIsQ0FBUDtBQUNEO0FBQ0QsU0FBS1MsWUFBTCxDQUFrQixFQUFDVCxjQUFELEVBQVNFLFNBQVMsRUFBbEIsRUFBbEI7QUFDRCxHQXREOEI7QUF1RC9CVyxVQXZEK0Isb0JBdURyQkMsS0F2RHFCLEVBdURkQyxLQXZEYyxFQXVEUEgsT0F2RE8sRUF1REU7QUFDL0IsUUFBTUwsUUFBUSxLQUFLQSxLQUFuQjtBQUNBLFFBQU1QLFNBQVMsZ0JBQUVnQixHQUFGLENBQU1ULE1BQU1QLE1BQVosRUFBb0JjLEtBQXBCLEVBQTJCQyxLQUEzQixDQUFmO0FBQ0E7QUFDQSxRQUFJSCxPQUFKLEVBQWE7QUFDWCxhQUFPLEtBQUtILFlBQUwsQ0FBa0IsRUFBQ1QsY0FBRCxFQUFsQixDQUFQO0FBQ0Q7QUFDRCxRQUFNRSxVQUFVLGdCQUFFYyxHQUFGLENBQU1ULE1BQU1MLE9BQVosRUFBcUJZLEtBQXJCLENBQWhCO0FBQ0EsU0FBS0wsWUFBTCxDQUFrQixFQUFDVCxjQUFELEVBQVNFLGdCQUFULEVBQWxCO0FBQ0QsR0FoRThCO0FBaUUvQmUsVUFqRStCLG9CQWlFckJILEtBakVxQixFQWlFZEksUUFqRWMsRUFpRUo7QUFDekIsUUFBTVgsUUFBUSxLQUFLQSxLQUFuQjtBQUNBLFFBQU1ZLE1BQU0sZ0JBQUVDLEdBQUYsQ0FBTWIsTUFBTVAsTUFBWixFQUFvQmMsS0FBcEIsQ0FBWjtBQUNBLFdBQU8sT0FBT0ssR0FBUCxLQUFlLFdBQWYsR0FBNkJBLEdBQTdCLEdBQW1DRCxRQUExQztBQUNELEdBckU4QjtBQXNFL0JHLGdCQXRFK0IsMEJBc0VmUCxLQXRFZSxFQXNFTTtBQUFBLFFBQWRDLEtBQWMsdUVBQU4sSUFBTTs7QUFDbkMsUUFBTVgsZUFBZSxnQkFBRVksR0FBRixDQUFNLEtBQUtULEtBQUwsQ0FBV0gsWUFBakIsRUFBK0JVLEtBQS9CLEVBQXNDQyxLQUF0QyxDQUFyQjtBQUNBLFNBQUtOLFlBQUwsQ0FBa0IsRUFBQ0wsMEJBQUQsRUFBbEI7QUFDRCxHQXpFOEI7QUEwRS9Ca0IsVUExRStCLG9CQTBFckJSLEtBMUVxQixFQTBFZDtBQUNmLFdBQU8sZ0JBQUVNLEdBQUYsQ0FBTSxLQUFLYixLQUFMLENBQVdKLE1BQWpCLEVBQXlCVyxLQUF6QixDQUFQO0FBQ0QsR0E1RThCO0FBNkUvQlMsWUE3RStCLHNCQTZFbkJULEtBN0VtQixFQTZFRTtBQUFBLFFBQWRDLEtBQWMsdUVBQU4sSUFBTTs7QUFDL0IsUUFBTWIsVUFBVSxnQkFBRWMsR0FBRixDQUFNLEtBQUtULEtBQUwsQ0FBV0wsT0FBakIsRUFBMEJZLEtBQTFCLEVBQWlDQyxLQUFqQyxDQUFoQjtBQUNBLFNBQUtOLFlBQUwsQ0FBa0IsRUFBQ1AsZ0JBQUQsRUFBbEI7QUFDRCxHQWhGOEI7QUFpRi9Cc0IsWUFqRitCLHNCQWlGbkJWLEtBakZtQixFQWlGWjtBQUNqQixRQUFNUCxRQUFRLEtBQUtBLEtBQW5CO0FBQ0EsUUFBSSxLQUFLQSxLQUFMLENBQVdrQixLQUFYLEtBQXFCLElBQXJCLElBQTZCLEtBQUsxQixLQUFMLENBQVdHLE9BQVgsS0FBdUIsSUFBeEQsRUFBOEQ7QUFDNUQsYUFBTyxJQUFQO0FBQ0Q7QUFDRCxXQUFPLGdCQUFFa0IsR0FBRixDQUFNYixNQUFNTCxPQUFaLEVBQXFCWSxLQUFyQixDQUFQO0FBQ0QsR0F2RjhCO0FBd0YvQlksVUF4RitCLG9CQXdGckJaLEtBeEZxQixFQXdGZEMsS0F4RmMsRUF3RlA7QUFDdEIsUUFBTVIsUUFBUSxLQUFLQSxLQUFuQjtBQUNBLFFBQU1QLFNBQVMsZ0JBQUVnQixHQUFGLENBQU1ULE1BQU1QLE1BQVosRUFBb0JjLEtBQXBCLCtCQUNWLGdCQUFFTSxHQUFGLENBQU1iLE1BQU1QLE1BQVosRUFBb0JjLEtBQXBCLEVBQTJCLEVBQTNCLENBRFUsSUFFYkMsS0FGYSxHQUFmO0FBSUEsU0FBS04sWUFBTCxDQUFrQixFQUFDVCxjQUFELEVBQWxCO0FBQ0QsR0EvRjhCO0FBZ0cvQjJCLGFBaEcrQix1QkFnR2xCYixLQWhHa0IsRUFnR1hjLEtBaEdXLEVBZ0dKO0FBQ3pCLFFBQU1yQixRQUFRLEtBQUtBLEtBQW5CO0FBQ0EsUUFBTXNCLGFBQWEsZ0JBQUVULEdBQUYsQ0FBTWIsTUFBTVAsTUFBWixFQUFvQmMsS0FBcEIsRUFBMkIsRUFBM0IsQ0FBbkI7QUFDQSxRQUFNZCxTQUFTLGdCQUFFZ0IsR0FBRixDQUFNVCxNQUFNUCxNQUFaLEVBQW9CYyxLQUFwQiwrQkFDVmUsV0FBV0MsS0FBWCxDQUFpQixDQUFqQixFQUFvQkYsS0FBcEIsQ0FEVSxzQkFFVkMsV0FBV0MsS0FBWCxDQUFpQkYsUUFBUSxDQUF6QixDQUZVLEdBQWY7QUFJQSxTQUFLbkIsWUFBTCxDQUFrQixFQUFDVCxjQUFELEVBQWxCO0FBQ0QsR0F4RzhCO0FBeUcvQitCLFlBekcrQixzQkF5R25CakIsS0F6R21CLEVBeUdaYyxLQXpHWSxFQXlHTEksU0F6R0ssRUF5R007QUFDbkMsUUFBTXpCLFFBQVEsS0FBS0EsS0FBbkI7O0FBRUEsUUFBTTBCLE1BQU1DLEtBQUtELEdBQUwsQ0FBU0wsS0FBVCxFQUFnQkksU0FBaEIsQ0FBWjtBQUNBLFFBQU1HLE1BQU1ELEtBQUtDLEdBQUwsQ0FBU1AsS0FBVCxFQUFnQkksU0FBaEIsQ0FBWjs7QUFFQSxRQUFNSSxjQUFjLGdCQUFFaEIsR0FBRixDQUFNYixNQUFNUCxNQUFaLEVBQW9CYyxLQUFwQixFQUEyQixFQUEzQixDQUFwQjtBQUNBLFFBQU1kLFNBQVMsZ0JBQUVnQixHQUFGLENBQU1ULE1BQU1QLE1BQVosRUFBb0JjLEtBQXBCLCtCQUNWc0IsWUFBWU4sS0FBWixDQUFrQixDQUFsQixFQUFxQkcsR0FBckIsQ0FEVSxJQUViRyxZQUFZRCxHQUFaLENBRmEsc0JBR1ZDLFlBQVlOLEtBQVosQ0FBa0JHLE1BQU0sQ0FBeEIsRUFBMkJFLEdBQTNCLENBSFUsSUFJYkMsWUFBWUgsR0FBWixDQUphLHNCQUtWRyxZQUFZTixLQUFaLENBQWtCSyxNQUFNLENBQXhCLENBTFUsR0FBZjtBQU9BLFNBQUsxQixZQUFMLENBQWtCLEVBQUNULGNBQUQsRUFBbEI7QUFDRCxHQXhIOEI7QUF5SC9CcUMsZUF6SCtCLDJCQXlISztBQUFBLFFBQXJCWixLQUFxQix1RUFBYixJQUFhO0FBQUEsUUFBUGxCLEtBQU87O0FBQ2xDLFNBQUtFLFlBQUwsY0FDS0YsS0FETDtBQUVFa0IsYUFBTyxDQUFDLENBQUNBO0FBRlg7QUFJRCxHQTlIOEI7QUErSC9CYSxXQS9IK0IsdUJBK0hsQjtBQUNYLFdBQU8sS0FBSzdCLFlBQUwsQ0FBa0IsS0FBS1gsZUFBTCxFQUFsQixDQUFQO0FBQ0QsR0FqSThCO0FBa0kvQnlDLFlBbEkrQixzQkFrSW5CQyxDQWxJbUIsRUFrSWhCO0FBQ2JBLFNBQUtBLEVBQUVDLGNBQVAsSUFBeUJELEVBQUVDLGNBQUYsQ0FBaUJELENBQWpCLENBQXpCO0FBQ0EsUUFBTWpDLFFBQVEsS0FBS0EsS0FBbkI7QUFDQSxRQUFNSixTQUFTLEtBQUt2QixRQUFMLENBQWMyQixNQUFNUCxNQUFwQixFQUE0Qk8sS0FBNUIsRUFBbUMsS0FBS1IsS0FBeEMsQ0FBZjtBQUNBLFFBQUlJLE1BQUosRUFBWTtBQUNWLFVBQUksQ0FBQ0ksTUFBTWtCLEtBQVgsRUFBa0I7QUFDaEIsYUFBS1ksYUFBTCxDQUFtQixJQUFuQixFQUF5QixFQUFDbEMsY0FBRCxFQUF6QjtBQUNEO0FBQ0QsYUFBTyxLQUFLSixLQUFMLENBQVdsQixnQkFBWCxDQUE0QjBCLE1BQU1QLE1BQWxDLEVBQTBDTyxLQUExQyxFQUFpRCxLQUFLUixLQUF0RCxFQUE2RCxJQUE3RCxDQUFQO0FBQ0Q7QUFDRCxRQUFNMkMsa0JBQWtCLEtBQUszQyxLQUFMLENBQVdkLFNBQVgsQ0FBcUJzQixNQUFNUCxNQUEzQixFQUFtQ08sS0FBbkMsRUFBMEMsS0FBS1IsS0FBL0MsRUFBc0QsSUFBdEQsQ0FBeEI7QUFDQSxTQUFLQSxLQUFMLENBQVdiLFFBQVgsQ0FBb0J3RCxlQUFwQixFQUFxQ25DLEtBQXJDLEVBQTRDLEtBQUtSLEtBQWpELEVBQXdELElBQXhEO0FBQ0EsU0FBS0EsS0FBTCxDQUFXWixVQUFYLENBQXNCdUQsZUFBdEIsRUFBdUNuQyxLQUF2QyxFQUE4QyxLQUFLUixLQUFuRCxFQUEwRCxJQUExRDtBQUNELEdBL0k4Qjs7O0FBaUovQjtBQUNBSCxRQWxKK0Isb0JBa0pyQjtBQUNSLFdBQU87QUFDTGUsb0JBQWMsS0FBS0EsWUFEZDtBQUVMRSxnQkFBVSxLQUFLQSxRQUZWO0FBR0xJLGdCQUFVLEtBQUtBLFFBSFY7QUFJTEksc0JBQWdCLEtBQUtBLGNBSmhCO0FBS0xDLGdCQUFVLEtBQUtBLFFBTFY7QUFNTEMsa0JBQVksS0FBS0EsVUFOWjtBQU9MQyxrQkFBWSxLQUFLQSxVQVBaO0FBUUxFLGdCQUFVLEtBQUtBLFFBUlY7QUFTTEMsbUJBQWEsS0FBS0EsV0FUYjtBQVVMSSxrQkFBWSxLQUFLQSxVQVZaO0FBV0xNLHFCQUFlLEtBQUtBLGFBWGY7QUFZTEMsaUJBQVcsS0FBS0EsU0FaWDtBQWFMQyxrQkFBWSxLQUFLQTtBQWJaLEtBQVA7QUFlRCxHQWxLOEI7QUFtSy9COUIsY0FuSytCLHdCQW1LakJrQyxRQW5LaUIsRUFtS1BDLE1BbktPLEVBbUtDO0FBQUE7O0FBQzlCLFFBQUlELFlBQVlBLFNBQVMzQyxNQUFyQixJQUErQixDQUFDMkMsU0FBU3hDLE1BQTdDLEVBQXFEO0FBQ25Ed0MsZUFBUzNDLE1BQVQsR0FBa0IsS0FBS0QsS0FBTCxDQUFXcEIsV0FBWCxDQUF1QmdFLFNBQVMzQyxNQUFoQyxFQUF3QzJDLFFBQXhDLEVBQWtELEtBQUs1QyxLQUF2RCxFQUE4RCxJQUE5RCxDQUFsQjtBQUNBNEMsZUFBU3hDLE1BQVQsR0FBa0IsS0FBS3ZCLFFBQUwsQ0FBYytELFNBQVMzQyxNQUF2QixFQUErQjJDLFFBQS9CLEVBQXlDLEtBQUs1QyxLQUE5QyxDQUFsQjtBQUNEO0FBQ0QsU0FBSzhDLFFBQUwsQ0FBY0YsUUFBZCxFQUF3QixZQUFNO0FBQzVCLFlBQUs1QyxLQUFMLENBQVdoQixTQUFYLENBQXFCLE1BQUt3QixLQUExQixFQUFpQyxNQUFLUixLQUF0QztBQUNBLFVBQUksQ0FBQzZDLE1BQUwsRUFBYTtBQUNYLGNBQUt0QyxVQUFMLENBQWdCLE1BQUtDLEtBQXJCLEVBQTRCLE1BQUtSLEtBQWpDO0FBQ0Q7QUFDRixLQUxEO0FBTUQsR0E5SzhCO0FBK0svQk8sWUEvSytCLHNCQStLbkJDLEtBL0ttQixFQStLWnVDLE9BL0tZLEVBK0tIO0FBQzFCLFNBQUsvQyxLQUFMLENBQVdqQixRQUFYLENBQW9CeUIsS0FBcEIsRUFBMkIsS0FBS1IsS0FBaEMsRUFBdUMrQyxPQUF2QyxFQUFnRCxJQUFoRDtBQUNELEdBakw4QjtBQWtML0JsRSxVQWxMK0Isb0JBa0xyQm9CLE1BbExxQixFQWtMYk8sS0FsTGEsRUFrTE5SLEtBbExNLEVBa0xDO0FBQzlCLFFBQU1JLFNBQVMsS0FBS0osS0FBTCxDQUFXbkIsUUFBWCxDQUNibUUsd0JBQXdCL0MsTUFBeEIsRUFBZ0MsS0FBS08sS0FBTCxHQUFhLEtBQUtBLEtBQUwsQ0FBV0gsWUFBeEIsR0FBdUMsRUFBdkUsQ0FEYSxFQUViRyxLQUZhLEVBR2JSLEtBSGEsRUFJYixJQUphLENBQWY7QUFNQSxXQUFPaUQsWUFBWTdDLE1BQVosQ0FBUDtBQUNELEdBMUw4Qjs7QUEyTC9CO0FBQ0E4QyxRQTVMK0Isb0JBNExyQjtBQUNSLFFBQU1sRCxxQkFDRCxLQUFLQSxLQURKLEVBRUQsS0FBS1EsS0FGSixFQUdELEtBQUtYLE1BQUwsRUFIQyxDQUFOOztBQURRLFFBTUFSLFNBTkEsR0FNaUNXLEtBTmpDLENBTUFYLFNBTkE7QUFBQSxRQU1XOEQsUUFOWCxHQU1pQ25ELEtBTmpDLENBTVdtRCxRQU5YO0FBQUEsUUFNd0JDLElBTnhCLDRCQU1pQ3BELEtBTmpDOztBQU9SLFFBQU1xRCxnQkFBZ0IsT0FBT0YsUUFBUCxLQUFvQixVQUFwQixHQUFpQ0EsU0FBU0MsSUFBVCxDQUFqQyxHQUFrREQsUUFBeEU7QUFDQSxRQUFNRyxTQUFTakUsU0FBZjtBQUNBLFFBQUksQ0FBQ2lFLE1BQUwsRUFBYTtBQUNYLGFBQU9ELGFBQVA7QUFDRDtBQUNELFdBQ0U7QUFBQyxZQUFEO0FBQUEsUUFBUSxXQUFVLFdBQWxCO0FBQStCQTtBQUEvQixLQURGO0FBR0Q7QUEzTThCLENBQWxCLEM7O0FBOE1mOztBQUVBLFNBQVNKLFdBQVQsQ0FBc0JNLEdBQXRCLEVBQTJCO0FBQ3pCLE1BQUksZ0JBQUVDLFFBQUYsQ0FBV0QsR0FBWCxDQUFKLEVBQXFCO0FBQ25CLFFBQU1FLFdBQVcsZ0JBQUVDLFNBQUYsQ0FBWUgsR0FBWixFQUFpQk4sV0FBakIsQ0FBakI7QUFDQSxRQUFNVSxRQUFRLGdCQUFFQyxNQUFGLENBQVNILFFBQVQsRUFBbUI7QUFBQSxhQUFLakYsQ0FBTDtBQUFBLEtBQW5CLENBQWQ7QUFDQSxXQUFPcUYsT0FBT0MsSUFBUCxDQUFZSCxLQUFaLEVBQW1CSSxNQUFuQixHQUE0Qk4sUUFBNUIsR0FBdUNPLFNBQTlDO0FBQ0Q7QUFDRCxNQUFJLGdCQUFFQyxPQUFGLENBQVVWLEdBQVYsQ0FBSixFQUFvQjtBQUNsQixRQUFNRSxZQUFXRixJQUFJVyxHQUFKLENBQVFqQixXQUFSLENBQWpCO0FBQ0EsUUFBTVUsU0FBUUYsVUFBU1UsSUFBVCxDQUFjO0FBQUEsYUFBSzNGLENBQUw7QUFBQSxLQUFkLENBQWQ7QUFDQSxXQUFPbUYsU0FBUUYsU0FBUixHQUFtQk8sU0FBMUI7QUFDRDtBQUNELFNBQU9ULEdBQVA7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVNQLHVCQUFULENBQWtDL0MsTUFBbEMsRUFBMENJLFlBQTFDLEVBQXdEO0FBQ3RELE1BQU0rRCxVQUFVLFNBQVZBLE9BQVUsQ0FBQ0MsT0FBRCxFQUF3QjtBQUFBLFFBQWRDLElBQWMsdUVBQVAsRUFBTzs7QUFDdEMsUUFBSSxnQkFBRWQsUUFBRixDQUFXYSxPQUFYLENBQUosRUFBeUI7QUFDdkIsYUFBTyxnQkFBRVgsU0FBRixDQUFZVyxPQUFaLEVBQXFCLFVBQUM3RixDQUFELEVBQUkrRixDQUFKLEVBQVU7QUFDcEMsZUFBT0gsUUFBUTVGLENBQVIsK0JBQWU4RixJQUFmLElBQXFCQyxDQUFyQixHQUFQO0FBQ0QsT0FGTSxDQUFQO0FBR0Q7QUFDRCxRQUFJLGdCQUFFTixPQUFGLENBQVVJLE9BQVYsQ0FBSixFQUF3QjtBQUN0QixhQUFPQSxRQUFRSCxHQUFSLENBQVksVUFBQzFGLENBQUQsRUFBSWdHLEdBQUosRUFBWTtBQUM3QixlQUFPSixRQUFRNUYsQ0FBUiwrQkFBZThGLElBQWYsSUFBcUJFLEdBQXJCLEdBQVA7QUFDRCxPQUZNLENBQVA7QUFHRDtBQUNELFFBQUksQ0FBQyxnQkFBRWhCLFFBQUYsQ0FBV2EsT0FBWCxDQUFELElBQXdCLENBQUMsZ0JBQUVKLE9BQUYsQ0FBVUksT0FBVixDQUF6QixJQUErQ0EsT0FBbkQsRUFBNEQ7QUFDMUQsYUFBTyxnQkFBRXBELEdBQUYsQ0FBTWhCLE1BQU4sRUFBY3FFLElBQWQsRUFBb0JOLFNBQXBCLENBQVA7QUFDRDtBQUNELFdBQU9LLE9BQVA7QUFDRCxHQWZEO0FBZ0JBRCxVQUFRL0QsWUFBUjtBQUNBLFNBQU9KLE1BQVA7QUFDRCIsImZpbGUiOiJmb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IF8gZnJvbSAnLi91dGlscydcblxuY29uc3Qgbm9vcCA9ICgpID0+IHt9XG5jb25zdCByZW9wID0gZCA9PiBkXG5cbmV4cG9ydCBjb25zdCBGb3JtRGVmYXVsdFByb3BzID0ge1xuICBsb2FkU3RhdGU6IG5vb3AsXG4gIGRlZmF1bHRWYWx1ZXM6IHt9LFxuICBwcmVWYWxpZGF0ZTogcmVvcCxcbiAgdmFsaWRhdGU6ICgpID0+IG51bGwsXG4gIG9uVmFsaWRhdGlvbkZhaWw6IG5vb3AsXG4gIG9uQ2hhbmdlOiBub29wLFxuICBzYXZlU3RhdGU6IG5vb3AsXG4gIHdpbGxVbm1vdW50OiBub29wLFxuICBwcmVTdWJtaXQ6IHJlb3AsXG4gIG9uU3VibWl0OiBub29wLFxuICBwb3N0U3VibWl0OiBub29wLFxuICBjb21wb25lbnQ6ICdkaXYnXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdGb3JtJyxcbiAgY2hpbGRDb250ZXh0VHlwZXM6IHtcbiAgICBmb3JtQVBJOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XG4gIH0sXG4gIGdldENoaWxkQ29udGV4dCAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZvcm1BUEk6IHRoaXMuZ2V0QVBJKClcbiAgICB9XG4gIH0sXG4gIC8vIExpZmVjeWNsZVxuICBnZXREZWZhdWx0UHJvcHMgKCkge1xuICAgIHJldHVybiBGb3JtRGVmYXVsdFByb3BzXG4gIH0sXG4gIGdldEluaXRpYWxTdGF0ZSAoKSB7XG4gICAgY29uc3Qge1xuICAgICAgZGVmYXVsdFZhbHVlcyxcbiAgICAgIHZhbHVlcyxcbiAgICAgIGxvYWRTdGF0ZVxuICAgIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgbWVyZ2VkVmFsdWVzID0ge1xuICAgICAgLi4uZGVmYXVsdFZhbHVlcyxcbiAgICAgIC4uLnZhbHVlc1xuICAgIH1cblxuICAgIHJldHVybiBsb2FkU3RhdGUodGhpcy5wcm9wcywgdGhpcykgfHwge1xuICAgICAgdmFsdWVzOiBtZXJnZWRWYWx1ZXMsXG4gICAgICB0b3VjaGVkOiB7fSxcbiAgICAgIGVycm9yczogdGhpcy52YWxpZGF0ZShtZXJnZWRWYWx1ZXMpLFxuICAgICAgbmVzdGVkRXJyb3JzOiB7fVxuICAgIH1cbiAgfSxcbiAgY29tcG9uZW50V2lsbE1vdW50ICgpIHtcbiAgICB0aGlzLmVtaXRDaGFuZ2UodGhpcy5zdGF0ZSwgdHJ1ZSlcbiAgfSxcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyAocHJvcHMpIHtcbiAgICBpZiAocHJvcHMudmFsdWVzID09PSB0aGlzLnByb3BzLnZhbHVlcykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5zZXRGb3JtU3RhdGUoe1xuICAgICAgdmFsdWVzOiBwcm9wcy52YWx1ZXMgfHwge31cbiAgICB9LCB0cnVlKVxuICB9LFxuICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgdGhpcy5wcm9wcy53aWxsVW5tb3VudCh0aGlzLnN0YXRlLCB0aGlzLnByb3BzLCB0aGlzKVxuICB9LFxuXG4gIC8vIEFQSVxuICBzZXRBbGxWYWx1ZXMgKHZhbHVlcywgbm9Ub3VjaCkge1xuICAgIGlmIChub1RvdWNoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRGb3JtU3RhdGUoe3ZhbHVlc30pXG4gICAgfVxuICAgIHRoaXMuc2V0Rm9ybVN0YXRlKHt2YWx1ZXMsIHRvdWNoZWQ6IHt9fSlcbiAgfSxcbiAgc2V0VmFsdWUgKGZpZWxkLCB2YWx1ZSwgbm9Ub3VjaCkge1xuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZVxuICAgIGNvbnN0IHZhbHVlcyA9IF8uc2V0KHN0YXRlLnZhbHVlcywgZmllbGQsIHZhbHVlKVxuICAgIC8vIEFsc28gc2V0IHRvdWNoZWQgc2luY2UgdGhlIHZhbHVlIGlzIGNoYW5naW5nXG4gICAgaWYgKG5vVG91Y2gpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldEZvcm1TdGF0ZSh7dmFsdWVzfSlcbiAgICB9XG4gICAgY29uc3QgdG91Y2hlZCA9IF8uc2V0KHN0YXRlLnRvdWNoZWQsIGZpZWxkKVxuICAgIHRoaXMuc2V0Rm9ybVN0YXRlKHt2YWx1ZXMsIHRvdWNoZWR9KVxuICB9LFxuICBnZXRWYWx1ZSAoZmllbGQsIGZhbGxiYWNrKSB7XG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLnN0YXRlXG4gICAgY29uc3QgdmFsID0gXy5nZXQoc3RhdGUudmFsdWVzLCBmaWVsZClcbiAgICByZXR1cm4gdHlwZW9mIHZhbCAhPT0gJ3VuZGVmaW5lZCcgPyB2YWwgOiBmYWxsYmFja1xuICB9LFxuICBzZXROZXN0ZWRFcnJvciAoZmllbGQsIHZhbHVlID0gdHJ1ZSkge1xuICAgIGNvbnN0IG5lc3RlZEVycm9ycyA9IF8uc2V0KHRoaXMuc3RhdGUubmVzdGVkRXJyb3JzLCBmaWVsZCwgdmFsdWUpXG4gICAgdGhpcy5zZXRGb3JtU3RhdGUoe25lc3RlZEVycm9yc30pXG4gIH0sXG4gIGdldEVycm9yIChmaWVsZCkge1xuICAgIHJldHVybiBfLmdldCh0aGlzLnN0YXRlLmVycm9ycywgZmllbGQpXG4gIH0sXG4gIHNldFRvdWNoZWQgKGZpZWxkLCB2YWx1ZSA9IHRydWUpIHtcbiAgICBjb25zdCB0b3VjaGVkID0gXy5zZXQodGhpcy5zdGF0ZS50b3VjaGVkLCBmaWVsZCwgdmFsdWUpXG4gICAgdGhpcy5zZXRGb3JtU3RhdGUoe3RvdWNoZWR9KVxuICB9LFxuICBnZXRUb3VjaGVkIChmaWVsZCkge1xuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZVxuICAgIGlmICh0aGlzLnN0YXRlLmRpcnR5ID09PSB0cnVlIHx8IHRoaXMucHJvcHMudG91Y2hlZCA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmV0dXJuIF8uZ2V0KHN0YXRlLnRvdWNoZWQsIGZpZWxkKVxuICB9LFxuICBhZGRWYWx1ZSAoZmllbGQsIHZhbHVlKSB7XG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLnN0YXRlXG4gICAgY29uc3QgdmFsdWVzID0gXy5zZXQoc3RhdGUudmFsdWVzLCBmaWVsZCwgW1xuICAgICAgLi4uXy5nZXQoc3RhdGUudmFsdWVzLCBmaWVsZCwgW10pLFxuICAgICAgdmFsdWVcbiAgICBdKVxuICAgIHRoaXMuc2V0Rm9ybVN0YXRlKHt2YWx1ZXN9KVxuICB9LFxuICByZW1vdmVWYWx1ZSAoZmllbGQsIGluZGV4KSB7XG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLnN0YXRlXG4gICAgY29uc3QgZmllbGRWYWx1ZSA9IF8uZ2V0KHN0YXRlLnZhbHVlcywgZmllbGQsIFtdKVxuICAgIGNvbnN0IHZhbHVlcyA9IF8uc2V0KHN0YXRlLnZhbHVlcywgZmllbGQsIFtcbiAgICAgIC4uLmZpZWxkVmFsdWUuc2xpY2UoMCwgaW5kZXgpLFxuICAgICAgLi4uZmllbGRWYWx1ZS5zbGljZShpbmRleCArIDEpXG4gICAgXSlcbiAgICB0aGlzLnNldEZvcm1TdGF0ZSh7dmFsdWVzfSlcbiAgfSxcbiAgc3dhcFZhbHVlcyAoZmllbGQsIGluZGV4LCBkZXN0SW5kZXgpIHtcbiAgICBjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGVcblxuICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKGluZGV4LCBkZXN0SW5kZXgpXG4gICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoaW5kZXgsIGRlc3RJbmRleClcblxuICAgIGNvbnN0IGZpZWxkVmFsdWVzID0gXy5nZXQoc3RhdGUudmFsdWVzLCBmaWVsZCwgW10pXG4gICAgY29uc3QgdmFsdWVzID0gXy5zZXQoc3RhdGUudmFsdWVzLCBmaWVsZCwgW1xuICAgICAgLi4uZmllbGRWYWx1ZXMuc2xpY2UoMCwgbWluKSxcbiAgICAgIGZpZWxkVmFsdWVzW21heF0sXG4gICAgICAuLi5maWVsZFZhbHVlcy5zbGljZShtaW4gKyAxLCBtYXgpLFxuICAgICAgZmllbGRWYWx1ZXNbbWluXSxcbiAgICAgIC4uLmZpZWxkVmFsdWVzLnNsaWNlKG1heCArIDEpXG4gICAgXSlcbiAgICB0aGlzLnNldEZvcm1TdGF0ZSh7dmFsdWVzfSlcbiAgfSxcbiAgc2V0QWxsVG91Y2hlZCAoZGlydHkgPSB0cnVlLCBzdGF0ZSkge1xuICAgIHRoaXMuc2V0Rm9ybVN0YXRlKHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgZGlydHk6ICEhZGlydHlcbiAgICB9KVxuICB9LFxuICByZXNldEZvcm0gKCkge1xuICAgIHJldHVybiB0aGlzLnNldEZvcm1TdGF0ZSh0aGlzLmdldEluaXRpYWxTdGF0ZSgpKVxuICB9LFxuICBzdWJtaXRGb3JtIChlKSB7XG4gICAgZSAmJiBlLnByZXZlbnREZWZhdWx0ICYmIGUucHJldmVudERlZmF1bHQoZSlcbiAgICBjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGVcbiAgICBjb25zdCBlcnJvcnMgPSB0aGlzLnZhbGlkYXRlKHN0YXRlLnZhbHVlcywgc3RhdGUsIHRoaXMucHJvcHMpXG4gICAgaWYgKGVycm9ycykge1xuICAgICAgaWYgKCFzdGF0ZS5kaXJ0eSkge1xuICAgICAgICB0aGlzLnNldEFsbFRvdWNoZWQodHJ1ZSwge2Vycm9yc30pXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5vblZhbGlkYXRpb25GYWlsKHN0YXRlLnZhbHVlcywgc3RhdGUsIHRoaXMucHJvcHMsIHRoaXMpXG4gICAgfVxuICAgIGNvbnN0IHByZVN1Ym1pdFZhbHVlcyA9IHRoaXMucHJvcHMucHJlU3VibWl0KHN0YXRlLnZhbHVlcywgc3RhdGUsIHRoaXMucHJvcHMsIHRoaXMpXG4gICAgdGhpcy5wcm9wcy5vblN1Ym1pdChwcmVTdWJtaXRWYWx1ZXMsIHN0YXRlLCB0aGlzLnByb3BzLCB0aGlzKVxuICAgIHRoaXMucHJvcHMucG9zdFN1Ym1pdChwcmVTdWJtaXRWYWx1ZXMsIHN0YXRlLCB0aGlzLnByb3BzLCB0aGlzKVxuICB9LFxuXG4gIC8vIFV0aWxzXG4gIGdldEFQSSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNldEFsbFZhbHVlczogdGhpcy5zZXRBbGxWYWx1ZXMsXG4gICAgICBzZXRWYWx1ZTogdGhpcy5zZXRWYWx1ZSxcbiAgICAgIGdldFZhbHVlOiB0aGlzLmdldFZhbHVlLFxuICAgICAgc2V0TmVzdGVkRXJyb3I6IHRoaXMuc2V0TmVzdGVkRXJyb3IsXG4gICAgICBnZXRFcnJvcjogdGhpcy5nZXRFcnJvcixcbiAgICAgIHNldFRvdWNoZWQ6IHRoaXMuc2V0VG91Y2hlZCxcbiAgICAgIGdldFRvdWNoZWQ6IHRoaXMuZ2V0VG91Y2hlZCxcbiAgICAgIGFkZFZhbHVlOiB0aGlzLmFkZFZhbHVlLFxuICAgICAgcmVtb3ZlVmFsdWU6IHRoaXMucmVtb3ZlVmFsdWUsXG4gICAgICBzd2FwVmFsdWVzOiB0aGlzLnN3YXBWYWx1ZXMsXG4gICAgICBzZXRBbGxUb3VjaGVkOiB0aGlzLnNldEFsbFRvdWNoZWQsXG4gICAgICByZXNldEZvcm06IHRoaXMucmVzZXRGb3JtLFxuICAgICAgc3VibWl0Rm9ybTogdGhpcy5zdWJtaXRGb3JtXG4gICAgfVxuICB9LFxuICBzZXRGb3JtU3RhdGUgKG5ld1N0YXRlLCBzaWxlbnQpIHtcbiAgICBpZiAobmV3U3RhdGUgJiYgbmV3U3RhdGUudmFsdWVzICYmICFuZXdTdGF0ZS5lcnJvcnMpIHtcbiAgICAgIG5ld1N0YXRlLnZhbHVlcyA9IHRoaXMucHJvcHMucHJlVmFsaWRhdGUobmV3U3RhdGUudmFsdWVzLCBuZXdTdGF0ZSwgdGhpcy5wcm9wcywgdGhpcylcbiAgICAgIG5ld1N0YXRlLmVycm9ycyA9IHRoaXMudmFsaWRhdGUobmV3U3RhdGUudmFsdWVzLCBuZXdTdGF0ZSwgdGhpcy5wcm9wcylcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZShuZXdTdGF0ZSwgKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy5zYXZlU3RhdGUodGhpcy5zdGF0ZSwgdGhpcy5wcm9wcywgdGhpcylcbiAgICAgIGlmICghc2lsZW50KSB7XG4gICAgICAgIHRoaXMuZW1pdENoYW5nZSh0aGlzLnN0YXRlLCB0aGlzLnByb3BzKVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG4gIGVtaXRDaGFuZ2UgKHN0YXRlLCBpbml0aWFsKSB7XG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZShzdGF0ZSwgdGhpcy5wcm9wcywgaW5pdGlhbCwgdGhpcylcbiAgfSxcbiAgdmFsaWRhdGUgKHZhbHVlcywgc3RhdGUsIHByb3BzKSB7XG4gICAgY29uc3QgZXJyb3JzID0gdGhpcy5wcm9wcy52YWxpZGF0ZShcbiAgICAgIHJlbW92ZU5lc3RlZEVycm9yVmFsdWVzKHZhbHVlcywgdGhpcy5zdGF0ZSA/IHRoaXMuc3RhdGUubmVzdGVkRXJyb3JzIDoge30pLFxuICAgICAgc3RhdGUsXG4gICAgICBwcm9wcyxcbiAgICAgIHRoaXNcbiAgICApXG4gICAgcmV0dXJuIGNsZWFuRXJyb3JzKGVycm9ycylcbiAgfSxcbiAgLy8gUmVuZGVyXG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAuLi50aGlzLnByb3BzLFxuICAgICAgLi4udGhpcy5zdGF0ZSxcbiAgICAgIC4uLnRoaXMuZ2V0QVBJKClcbiAgICB9XG4gICAgY29uc3QgeyBjb21wb25lbnQsIGNoaWxkcmVuLCAuLi5yZXN0IH0gPSBwcm9wc1xuICAgIGNvbnN0IHJlc29sdmVkQ2hpbGQgPSB0eXBlb2YgY2hpbGRyZW4gPT09ICdmdW5jdGlvbicgPyBjaGlsZHJlbihyZXN0KSA6IGNoaWxkcmVuXG4gICAgY29uc3QgUm9vdEVsID0gY29tcG9uZW50XG4gICAgaWYgKCFSb290RWwpIHtcbiAgICAgIHJldHVybiByZXNvbHZlZENoaWxkXG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8Um9vdEVsIGNsYXNzTmFtZT0nUmVhY3RGb3JtJz57cmVzb2x2ZWRDaGlsZH08L1Jvb3RFbD5cbiAgICApXG4gIH1cbn0pXG5cbi8vIFV0aWxzXG5cbmZ1bmN0aW9uIGNsZWFuRXJyb3JzIChlcnIpIHtcbiAgaWYgKF8uaXNPYmplY3QoZXJyKSkge1xuICAgIGNvbnN0IHJlc29sdmVkID0gXy5tYXBWYWx1ZXMoZXJyLCBjbGVhbkVycm9ycylcbiAgICBjb25zdCBmb3VuZCA9IF8ucGlja0J5KHJlc29sdmVkLCBkID0+IGQpXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGZvdW5kKS5sZW5ndGggPyByZXNvbHZlZCA6IHVuZGVmaW5lZFxuICB9XG4gIGlmIChfLmlzQXJyYXkoZXJyKSkge1xuICAgIGNvbnN0IHJlc29sdmVkID0gZXJyLm1hcChjbGVhbkVycm9ycylcbiAgICBjb25zdCBmb3VuZCA9IHJlc29sdmVkLmZpbmQoZCA9PiBkKVxuICAgIHJldHVybiBmb3VuZCA/IHJlc29sdmVkIDogdW5kZWZpbmVkXG4gIH1cbiAgcmV0dXJuIGVyclxufVxuXG4vLyByZW1vdmVOZXN0ZWRFcnJvclZhbHVlcyByZWN1cnNlcyB0aGUgdmFsdWVzIG9iamVjdCBhbmQgdHVybnMgYW55XG4vLyBmaWVsZCB0aGF0IGhhcyBhIHRydXRoeSBjb3JyZXNwb25kaW5nIG5lc3RlZCBmb3JtIGVycm9yIGZpZWxkIGludG8gdW5kZWZpbmVkLlxuLy8gVGhpcyBhbGxvd3MgcHJvcGVybHkgdmFsaWRhdGluZyBhIG5lc3RlZCBmb3JtIGJ5IGRldGVjdGluZyB0aGF0IHVuZGVmaW5lZCB2YWx1ZVxuLy8gaW4gdGhlIHZhbGlkYXRpb24gZnVuY3Rpb25cbmZ1bmN0aW9uIHJlbW92ZU5lc3RlZEVycm9yVmFsdWVzICh2YWx1ZXMsIG5lc3RlZEVycm9ycykge1xuICBjb25zdCByZWN1cnNlID0gKGN1cnJlbnQsIHBhdGggPSBbXSkgPT4ge1xuICAgIGlmIChfLmlzT2JqZWN0KGN1cnJlbnQpKSB7XG4gICAgICByZXR1cm4gXy5tYXBWYWx1ZXMoY3VycmVudCwgKGQsIGkpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlY3Vyc2UoZCwgWy4uLnBhdGgsIGldKVxuICAgICAgfSlcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheShjdXJyZW50KSkge1xuICAgICAgcmV0dXJuIGN1cnJlbnQubWFwKChkLCBrZXkpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlY3Vyc2UoZCwgWy4uLnBhdGgsIGtleV0pXG4gICAgICB9KVxuICAgIH1cbiAgICBpZiAoIV8uaXNPYmplY3QoY3VycmVudCkgJiYgIV8uaXNBcnJheShjdXJyZW50KSAmJiBjdXJyZW50KSB7XG4gICAgICByZXR1cm4gXy5zZXQodmFsdWVzLCBwYXRoLCB1bmRlZmluZWQpXG4gICAgfVxuICAgIHJldHVybiBjdXJyZW50XG4gIH1cbiAgcmVjdXJzZShuZXN0ZWRFcnJvcnMpXG4gIHJldHVybiB2YWx1ZXNcbn1cbiJdfQ==