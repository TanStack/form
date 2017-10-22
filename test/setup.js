const jsdom = require( 'jsdom' );

/*
Create jsdom versions of the document and window objects that
would normally be provided by the web browser
*/
const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;

/*
Put document and window on the global object
*/
global.document = doc;
global.window = win;
global.HTMLElement = window.HTMLElement;

/*
Additionally, we need to take all the properties that the jsdom window
object contains, such as navigator, and hoist them on to the Node.js
global object. This is done so that properties provided by window
can be used without the window. prefix, which is what would happen
in a browser environment. Some of the code inside React relies on this
*/
Object.keys(window).forEach((key) => {
  if (!(key in global)) {
    global[key] = window[key];
  }
});
