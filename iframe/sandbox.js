console.log('window.parent:::', window.parent.blur.__proto__.__proto__.constructor.__proto__.constructor('this')())
console.log('window.parent:::', window.parent.blur.__proto__.__proto__.constructor.__proto__.constructor('globalThis')())

const linkMap = new Map();
const fakeLinkMap = new Map();
const setNodeLink = (fakeNode, node) => {
  linkMap.set(node, fakeNode);
  fakeLinkMap.set(fakeNode, node);
}

const getDomObserve = (fakeDom, targetDom) => {
  const observe = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        if (mutation.addedNodes.length > 0) {
          const target = fakeLinkMap.get(mutation.target);
          for (const fakeNode of mutation.addedNodes) {
            if (target) {
              const cloneNode = target.cloneNode.call(fakeNode, { deep: true });
              setNodeLink(fakeNode, cloneNode)
              const nextSibling = mutation.nextSibling && fakeLinkMap.get(mutation.nextSibling);
              const previousSibling = mutation.previousSibling && fakeLinkMap.get(mutation.previousSibling);
              if (nextSibling) {
                nextSibling.insertAdjacentElement.call(nextSibling, 'beforebegin', cloneNode);
              } else if (previousSibling) {
                previousSibling.insertAdjacentElement('afterend', cloneNode);
              } else {
                targetDom.appendChild(cloneNode);
              }
            }
          }
        }
        if (mutation.removedNodes.length > 0) {
          const fakeTarget = mutation.target;
          const target = fakeLinkMap.get(fakeTarget);
          for (const fakeNode of mutation.removedNodes) {
            const node = fakeLinkMap.get(fakeNode);
            if (target) {
              target.removeChild(node);
            }
          }
        }
      } else if (mutation.type === "attributes") {
      }
    }

  })
  
  observe.observe(fakeDom, {
    childList: true
  })
}

const createFakeNode = (fakeDocument, text = 123) => {
  fakeNode = fakeDocument.createElement('div');
  fakeNode.innerText = text
  return fakeNode;
}

const iframe = document.createElement('iframe');
iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
document.body.appendChild(iframe);
const fakeWindow = iframe.contentWindow;
setNodeLink(fakeWindow.document.body, document.body)
fakeWindow.parent = '';
fakeWindow.data = ''

let times = 0;
Object.defineProperty(fakeWindow, 'data', {
  set: (value) => {
    // if (value === 'test') {
    //   console.log('start:', Date.now());
    //   while(times < 10000000) {
        fakeWindow.receive = '0000000000';
    //     times++;
    //   }
    // }
  }
})

getDomObserve(fakeWindow.document.body, window.document.body);

const a = createFakeNode(fakeWindow.document, 'a');
const b = createFakeNode(fakeWindow.document, 'b');
const c = createFakeNode(fakeWindow.document, 'c');
const d = createFakeNode(fakeWindow.document, 'd');

fakeWindow.document.body.appendChild(a)
fakeWindow.document.body.insertBefore(c, a)

a.insertAdjacentElement('beforebegin', b)
fakeWindow.document.body.replaceChild(b, a)
fakeWindow.document.body.removeChild(b)

const fragment = fakeWindow.document.createDocumentFragment();
for (let i=0;i<10;i++) {
  let li = fakeWindow.document.createElement('li');
  li.innerHTML = 'li标签';
  fragment.appendChild(li);
}
fakeWindow.document.body.appendChild(fragment)
