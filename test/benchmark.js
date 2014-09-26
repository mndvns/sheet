var Sheet = window.Sheet = (require('sheet') || window.Sheet);
var sheet = window.sheet = new Sheet('testing');

bench(1000, {per: .5}, function(){
  sheet.addRule('a.test', 'color: red');
});

bench(1000, {per: .5}, function(){
  sheet.addRule('.test-container *', 'color: blue');
});

function bench(ceiling, limit, cb){
  var start = Date.now();
  var end;
  for (var i = 0, l = ceiling; i <= l; i++) {
    cb(i);
    if (i === ceiling) end = Date.now();
  }


  var name = cb.toString().split('\n').slice(1, -1).join('\n');
  create('ul', name);

  var result = {};
  result.warn = false;
  result.total = end - start;
  result.per = Math.round((result.total / ceiling) * 10000) / 10000;
  for (var k in limit) {
    if (!limit.hasOwnProperty(k)) continue;
    if (result.warn === true) break;
    if (result[k] >= limit[k]) result.warn = true;
  }

  create('li', result.total + ' ms', result.warn);
  create('li', result.per + ' ms', result.warn);
}

function create(tag, msg, warn){
  var el = document.createElement(tag);
  el.textContent = msg;
  if (warn) el.style.color = 'red'
  document.body.appendChild(el);
}
