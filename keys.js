const keys = {};
document.addEventListener('keydown', e => {
  keys[e.keyCode] = true;
});
document.addEventListener('keyup', e => {
  keys[e.keyCode] = false;
});
