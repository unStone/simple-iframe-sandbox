const vm = require("vm");

const ctx = Object.create(null);

try {
  vm.runInNewContext(
    'this.constructor.constructor("return process")().exit()',
    ctx
  );
} catch(e) {
  console.log('------', e);
}

console.log("Never gets executed.");
