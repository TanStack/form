var formComponents = document.querySelectorAll('.form-component');
var browserInputs = document.querySelectorAll('.browser__form-input');
var heroAnimation = document.querySelector('.hero__animation');
var browser = document.querySelector('.browser');
var copyright = document.querySelector('.copyright');

var offsets = Array.from(formComponents).map(function(formComponent) {
  return parseInt(formComponent.getBoundingClientRect().left - heroAnimation.getBoundingClientRect().left);
});

formComponents[0].style.transitionDelay = '1.5s';
browserInputs[0].style.transitionDelay = '2.5s';
browserInputs[0].style.opacity = 1;
formComponents[0].style.webkitTransform = `translate3d(${parseInt(((browser.scrollWidth / 1.75) - offsets[0]) + 40)}px, -240px, 0)`;
formComponents[0].style.opacity = 0;


Array.from(formComponents).slice(1).reduce(function(prev, el, index) {
  prev.addEventListener('transitionend', function() {
    el.style.webkitTransform = `translate3d(${parseInt(((browser.scrollWidth / 1.75) - offsets[index + 1]) + 40)}px, -240px, 0)`;
    el.style.opacity = 0;
    browserInputs[index + 1].style.transitionDelay = '2s';
    browserInputs[index + 1].style.opacity = 1;
  });
  return el;
}, formComponents[0]);

copyright.innerHTML = 'Copyright &copy; ' + new Date().getFullYear();
