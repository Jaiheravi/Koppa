const x = (() => {
  const a = 1;
  const b = 2;
  const c = 3;
  return a + b + c;
})();

const x = (() => {
  const a = 3;
  const b = 1;
  return a + b;
})();

const x = (() => {
  const y = x => x + 2;
  return y(2);
})();

const x = (() => {
  const y = x => x + 2;
  return y(2);
})();

module.exports = {x}
