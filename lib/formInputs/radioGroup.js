'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _formInput = require('../formInput');

var _formInput2 = _interopRequireDefault(_formInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
//


exports.default = _react2.default.createClass({
  displayName: 'radioGroup',

  childContextTypes: {
    formRadioGroup: _react2.default.PropTypes.object
  },
  getChildContext: function getChildContext() {
    return {
      formRadioGroup: this
    };
  },
  render: function render() {
    var _this = this;

    var _props = this.props,
        field = _props.field,
        showErrors = _props.showErrors,
        _props$errorBefore = _props.errorBefore,
        errorBefore = _props$errorBefore === undefined ? true : _props$errorBefore,
        isForm = _props.isForm,
        children = _props.children,
        rest = _objectWithoutProperties(_props, ['field', 'showErrors', 'errorBefore', 'isForm', 'children']);

    return _react2.default.createElement(
      _formInput2.default,
      { field: field, showErrors: showErrors, errorBefore: errorBefore, isForm: isForm },
      function (api) {
        _extends(_this, api);
        return _react2.default.createElement(
          'radiogroup',
          rest,
          children
        );
      }
    );
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtSW5wdXRzL3JhZGlvR3JvdXAuanMiXSwibmFtZXMiOlsiY3JlYXRlQ2xhc3MiLCJjaGlsZENvbnRleHRUeXBlcyIsImZvcm1SYWRpb0dyb3VwIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiZ2V0Q2hpbGRDb250ZXh0IiwicmVuZGVyIiwicHJvcHMiLCJmaWVsZCIsInNob3dFcnJvcnMiLCJlcnJvckJlZm9yZSIsImlzRm9ybSIsImNoaWxkcmVuIiwicmVzdCIsImFwaSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUVBOzs7Ozs7O0FBREE7OztrQkFHZSxnQkFBTUEsV0FBTixDQUFrQjtBQUFBOztBQUMvQkMscUJBQW1CO0FBQ2pCQyxvQkFBZ0IsZ0JBQU1DLFNBQU4sQ0FBZ0JDO0FBRGYsR0FEWTtBQUkvQkMsaUJBSitCLDZCQUlaO0FBQ2pCLFdBQU87QUFDTEgsc0JBQWdCO0FBRFgsS0FBUDtBQUdELEdBUjhCO0FBUy9CSSxRQVQrQixvQkFTckI7QUFBQTs7QUFBQSxpQkFDcUUsS0FBS0MsS0FEMUU7QUFBQSxRQUNBQyxLQURBLFVBQ0FBLEtBREE7QUFBQSxRQUNPQyxVQURQLFVBQ09BLFVBRFA7QUFBQSxvQ0FDbUJDLFdBRG5CO0FBQUEsUUFDbUJBLFdBRG5CLHNDQUNpQyxJQURqQztBQUFBLFFBQ3VDQyxNQUR2QyxVQUN1Q0EsTUFEdkM7QUFBQSxRQUMrQ0MsUUFEL0MsVUFDK0NBLFFBRC9DO0FBQUEsUUFDNERDLElBRDVEOztBQUVSLFdBQ0U7QUFBQTtBQUFBLFFBQVcsT0FBT0wsS0FBbEIsRUFBeUIsWUFBWUMsVUFBckMsRUFBaUQsYUFBYUMsV0FBOUQsRUFBMkUsUUFBUUMsTUFBbkY7QUFDRyxnQkFBQ0csR0FBRCxFQUFTO0FBQ1Isd0JBQW9CQSxHQUFwQjtBQUNBLGVBQ0U7QUFBQTtBQUFnQkQsY0FBaEI7QUFDR0Q7QUFESCxTQURGO0FBS0Q7QUFSSCxLQURGO0FBWUQ7QUF2QjhCLENBQWxCLEMiLCJmaWxlIjoicmFkaW9Hcm91cC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbi8vXG5pbXBvcnQgRm9ybUlucHV0IGZyb20gJy4uL2Zvcm1JbnB1dCdcblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBjaGlsZENvbnRleHRUeXBlczoge1xuICAgIGZvcm1SYWRpb0dyb3VwOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XG4gIH0sXG4gIGdldENoaWxkQ29udGV4dCAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZvcm1SYWRpb0dyb3VwOiB0aGlzXG4gICAgfVxuICB9LFxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IHsgZmllbGQsIHNob3dFcnJvcnMsIGVycm9yQmVmb3JlID0gdHJ1ZSwgaXNGb3JtLCBjaGlsZHJlbiwgLi4ucmVzdCB9ID0gdGhpcy5wcm9wc1xuICAgIHJldHVybiAoXG4gICAgICA8Rm9ybUlucHV0IGZpZWxkPXtmaWVsZH0gc2hvd0Vycm9ycz17c2hvd0Vycm9yc30gZXJyb3JCZWZvcmU9e2Vycm9yQmVmb3JlfSBpc0Zvcm09e2lzRm9ybX0+XG4gICAgICAgIHsoYXBpKSA9PiB7XG4gICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBhcGkpXG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxyYWRpb2dyb3VwIHsuLi5yZXN0fT5cbiAgICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICAgICAgPC9yYWRpb2dyb3VwPlxuICAgICAgICAgIClcbiAgICAgICAgfX1cbiAgICAgIDwvRm9ybUlucHV0PlxuICAgIClcbiAgfVxufSlcbiJdfQ==