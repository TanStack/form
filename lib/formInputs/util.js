"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var buildHandler = exports.buildHandler = function buildHandler(override, fn) {
  return function (e) {
    return !override ? fn(e) : override(e, function () {
      return fn(e);
    });
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtSW5wdXRzL3V0aWwuanMiXSwibmFtZXMiOlsiYnVpbGRIYW5kbGVyIiwib3ZlcnJpZGUiLCJmbiIsImUiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQU8sSUFBTUEsc0NBQWUsU0FBZkEsWUFBZSxDQUFDQyxRQUFELEVBQVdDLEVBQVg7QUFBQSxTQUFrQjtBQUFBLFdBQzVDLENBQUNELFFBQUQsR0FDSUMsR0FBR0MsQ0FBSCxDQURKLEdBRUlGLFNBQVNFLENBQVQsRUFBWTtBQUFBLGFBQU1ELEdBQUdDLENBQUgsQ0FBTjtBQUFBLEtBQVosQ0FId0M7QUFBQSxHQUFsQjtBQUFBLENBQXJCIiwiZmlsZSI6InV0aWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgYnVpbGRIYW5kbGVyID0gKG92ZXJyaWRlLCBmbikgPT4gZSA9PlxuICAhb3ZlcnJpZGVcbiAgICA/IGZuKGUpXG4gICAgOiBvdmVycmlkZShlLCAoKSA9PiBmbihlKSlcblxuIl19