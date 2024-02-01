async function getCode(url) {
  return fetch(url, {
    headers: { 'content-type': 'text/plain' },
  }).then(res => res.text());
}

getCode('./run.js').then((code) => {
  // console.log('code', code);
  // console.log('fakeWindow', fakeWindow);
  const globalData = {};
  const fn = new fakeWindow.Function(...Object.keys(globalData), code);
  const data = fn.call(fakeWindow, ...Object.values(globalData));
  
})