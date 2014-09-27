var Sheet = window.Sheet = (require('sheet') || window.Sheet);
var sheet = window.sheet = new Sheet();

group(100);
group(1000);
group(2000);

function group(q, opts){
  create('h1', q);

  bench(q, opts, function(){
    sheet.insertRule('label.test', 'color: red');
  });

  bench(q, opts, function(){
    sheet.addRule('span.test { color: red; background: yellow }');
  });

  bench(q, opts, function(i){
    sheet.insertRule('div.test' + i, 'color: red');
  });

  bench(q, opts, function(i){
    sheet.addRule('input.test' + i, 'color: red');
  });

  create('hr');
}

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
  result.per = Math.round((result.total / ceiling) * 1000)
  for (var k in limit) {
    if (!limit.hasOwnProperty(k)) continue;
    if (result.warn === true) break;
    if (result[k] >= limit[k]) result.warn = true;
  }

  create('li', result.total + ' ms', result.warn);
  create('li', result.per + ' µs', result.warn);
}

function create(tag, msg, warn){
  var el = document.createElement(tag);
  el.textContent = msg;
  if (warn) el.style.color = 'red'
  document.body.appendChild(el);
}
