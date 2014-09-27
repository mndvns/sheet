var Sheet = window.Sheet = (require('sheet') || window.Sheet);
var sheet = window.sheet = new Sheet();
var rule = window.rule = sheet.addRule('.test-container .test', 'color: orange');
var $ = window.jQuery;

describe('Rule', function(){
  describe('#remove', function(){
    it('should remove itself', function(){
      $(rule.selector).css('color').should.startWith('rgb(255, 165, 0');
      rule.remove();
      $(rule.selector).css('color').should.startWith('rgb(0, 0, 0');
    });
  });

  describe('#add', function(){
    it('should add itself', function(){
      rule.add();
      $(rule.selector).css('color').should.startWith('rgb(255, 165, 0');
    });
  });

  describe('#query', function(){
    it('should find single element', function(){
      $(rule.selector)[0].should.eql(rule.query());
    });
  });

  describe('#queryAll', function(){
    it('should find all elements', function(){
      var queries = rule.queryAll();
      for (var i = 0, l = queries.length; i < l; i++) {
        $(rule.selector)[i].should.eql(queries[i]);
      }
    });
  });

  after(function(){
    sheet.remove();
    sheet = new Sheet();
  });
});

describe('Sheet', function(){
  describe('#addRule', function(){
    it('should accept split format', function(){
      sheet.addRule('span.test', 'color: blue');
      $('span.test').css('color').should.startWith('rgb(0, 0, 255)');
    });

    it('should accept flat format', function(){
      sheet.addRule('span.test { color: red }');
      $('span.test').css('color').should.startWith('rgb(255, 0, 0)');
    });
  });

  describe('#removeRule', function(){
    it('should remove a rule by index', function(){
      sheet.removeRule(1);
      sheet.removeRule(0);
      $('span.test').css('color').should.startWith('rgb(0, 0, 0)');
    });

    it('should remove a rule by selector', function(){
      sheet.addRule('label.test', 'color: blue');
      sheet.removeRule('label.test');
      $('label.test').css('color').should.startWith('rgb(0, 0, 0');
    });
  });

  describe('#lookup', function(){
    it('should lookup a rule exactly by string', function(){
      sheet.addRule('span.test', 'color: green');
      var lu = sheet.lookup('span.test');
      lu.selector.should.equal('span.test');
      lu.property.should.equal('color: green');
      lu.remove();
    });
  });

  describe('#insertRule', function(){
    it('should merge properties of a common selector', function(){
      sheet.insertRule('a.test', 'color: green');
      sheet.insertRule('a.test', 'font-size: 12px');
      ([sheet.length()]).should.eql([1]);
      sheet.cssRules[0].cssText.should.equal('a.test { color: green; font-size: 12px; }');
      sheet.lookup('a.test').remove();
    });
  });

  describe('#remove', function(){
    it('should remove itself', function(){
      var head = document.getElementsByTagName('head')[0];
      var pre = head.children.length;
      sheet.remove();
      var post = head.children.length;
      // wrapped in array because of ie bug in should.js
      ([pre]).should.eql([post + 1]);
    });
  });

  after(function(){
    // sheet.remove();
    sheet = new Sheet();
  });
});
