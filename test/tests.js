var Sheet = window.Sheet = (require('sheet') || window.Sheet);
var sheet = window.sheet = new Sheet('testing');
var $ = window.jQuery;

describe('Sheet', function(){

  it('should add a rule to the page', function(){
    sheet.addRule('span.test', 'color: blue');
    $('span.test').css('color').should.startWith('rgb(0, 0, 255)');
  });

  it('should remove a rule by index', function(){
    sheet.removeRule(0);
    $('span.test').css('color').should.startWith('rgb(0, 0, 0)');
  });

  it('should remove a rule by selector', function(){
    sheet.addRule('label.test', 'color: blue');
    sheet.removeRule('label.test');
    $('label.test').css('color').should.startWith('rgb(0, 0, 0');
  });

  it('should let rules remove themselves', function(){
    sheet.addRule('label.test', 'color: orange').remove();
    $('label.test').css('color').should.startWith('rgb(0, 0, 0');
  });

  it('should lookup a rule exactly by string', function(){
    sheet.addRule('span.test', 'color: green');
    var lu = sheet.lookup('span.test');
    lu.selector.should.equal('span.test');
    lu.property.should.equal('color: green');
    lu.remove();
  });

  it('should merge properties of a common selector', function(){
    sheet.addRule('a.test', 'color: green');
    sheet.addRule('a.test', 'font-size: 12px');
    ([sheet.length()]).should.eql([1]);
    sheet.cssRules[0].cssText.should.equal('a.test { color: green; font-size: 12px; }');
    sheet.lookup('a.test').remove();
  });

  it('should remove itself', function(){
    var head = document.getElementsByTagName('head')[0];
    var pre = head.children.length;
    sheet.remove();
    var post = head.children.length;
    // wrapped in array because of ie bug in should.js
    ([pre]).should.eql([post + 1]);
  });

});
