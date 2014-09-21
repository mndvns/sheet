module.exports = Sheet;

function Sheet(){
  // TODO
  // cache the rules for lookup
  this._rules = {};
  this.style = createStyleSheet();
  this.sheet = this.style.sheet;
  this.lookup = lookup.bind(this);
  this.addRule = addRule.bind(null, this.sheet);
}

Sheet.prototype.removeRule = function(arg){
  if (typeof arg === 'number') return removeRuleAt(this.sheet, arg)
  var lu = this.lookup(arg);
  if (!lu) throw Error('no rule matches ' + arg);
  removeRuleAt(this.sheet, lu.index);
};

Sheet.prototype.merge = function(path){
  // TODO
  // implement this
};

Sheet.prototype.enable = function(){
  this.sheet.disabled = false;
};

Sheet.prototype.disable = function(){
  this.sheet.disabled = true;
};

Sheet.prototype.toggle = function(){
  this.sheet.disabled = !this.sheet.disabled;
};

Sheet.prototype.length = function(){
  return this.sheet.rules.length;
};

function lookup(selector){
  for (var i = 0, l = this.length(); i < l; i++) {
    var rule = this.sheet.rules[i];
    if (rule.selectorText === selector) return {
      rule: rule,
      index: i
    }
  }
};

function createStyleSheet(){
  // ie
  if (document.createStyleSheet) return document.createStyleSheet();
  // modern
  var style = document.createElement('style');
  var head = document.getElementsByTagName('head')[0];
  return head.appendChild(style);
}

function addRule(sheet, selector, property){
  // ie
  if (sheet.addRule) return sheet.addRule(selector, property);
  // modern
  var rule = selector  + '{' + property + '}';
  return sheet.insertRule(rule, sheet.cssRules.length);
}

function removeRuleAt(sheet, idx){
  // ie
  if (sheet.removeRule) return sheet.removeRule(idx);
  // modern
  return sheet.deleteRule(idx);
}
