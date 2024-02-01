let times = 0;
console.log('[run] window', window);

Object.defineProperty(window, 'receive', {
  set: (value) => {
    // times++;
    // if (times >= 10000000) {
    //   console.log('[run] end:', Date.now());
    // }
  }
})

// const fun = func.constructor('window.document.body.innerHTML = ""')
// const fun = data.__proto__.constructor.__proto__.constructor('window.document.body.innerHTML = ""')
// fun()

window.data = 'test';
console.log('[run] window.data', window.data);

console.log('[run] window.parent', window.parent)
window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
  console.log('event', event)
  var origin = event.origin;
  if (origin !== "http://example.org:8080") return;
}

window.postMessage({data: 1}, 'http://127.0.0.1:5500')

