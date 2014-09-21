
var Sheet = window.Sheet;
var sheet = new Sheet();
var $ = window.jQuery;

describe('Sheet', function(){

  it('should add a rule to the page', function(){
    sheet.addRule('span.test', 'background: blue');
    sheet.addRule('label.test', 'background: red');
    $('.test').css('background').should.startWith('rgb(0, 0, 255)');
  });

  it('should remove a rule by index', function(){
    sheet.removeRule(0);
    $('span.test').css('background').should.startWith('rgba(0, 0, 0, 0)');
  });

  it('should remove a rule by selector', function(){
    sheet.removeRule('label.test');
    $('label.test').css('background').should.startWith('rgba(0, 0, 0, 0)');
  });

  it('should lookup a rule by selector', function(){
    sheet.addRule('span.test', 'color: green');
    var lu = sheet.lookup('span.test');
    lu.rule.cssText.should.eql('span.test { color: green; }');
  });

  after(reset);
});


function reset(){
  document.getElementsByTagName('head')[0].removeChild(sheet.style);
  sheet = new Sheet();
}
