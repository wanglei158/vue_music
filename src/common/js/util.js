export function shuffle(arr) {
  let _arr = arr.slice();
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i);
    let t = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = t;
  }
  return _arr;
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
export function unescapeHtml(lrc) {
  return lrc
    .replace(/&#58;/g, ":")
    .replace(/&#10;/g, "\n")
    .replace(/&#46;/g, ".")
    .replace(/&#32;/g, " ")
    .replace(/&#40;/g, "(")
    .replace(/&#41;/g, ")")
    .replace(/&#45;/g, "-")
    .replace(/&#39;/g, "'")
    .replace(/&#64;/g, "@")
    .replace(/&#13;/g, "");
}

export function debounce(func, delay) {
  let timer;
  return function(...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
