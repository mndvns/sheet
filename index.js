/**
 * Module dependencies
 */

var Rule = require('./rule');
var keys = require('keys');

/**
 * Expose `Sheet`
 */

module.exports = Sheet;

function Sheet(title){
  this.title = title;
  this._rules = {};
  this.head = document.getElementsByTagName('head')[0];
  this.createStyleSheet();
  this.cssRules = this.sheet.cssRules;
}

Sheet.prototype.createStyleSheet = function(){
  var head = this.head;
  var sheet;
  var style;
  var index;

  if (document.createStyleSheet) {
    // ie
    sheet = document.createStyleSheet();
    index = head.children.length - 1;
    style = head.children[index]
  } else {
    // modern
    style = document.createElement('style');
    sheet = head.appendChild(style).sheet;
    index = head.children.length - 1;
  }

  style.id = this.title;
  sheet.title = this.title;

  this.sheet = sheet;
  this.style = style;
  this.index = index;
};

Sheet.prototype.remove = function(){
  this.head.removeChild(this.head.children[this.index]);
};

Sheet.prototype.addRule = function(selector, property){
  // remove cached rule
  var cache = this._rules[selector];
  if (cache && ~cache.index) this.removeRuleAt(cache.index);
  // instantiate new rule
  var rule = new Rule(selector, property, cache, this);
  this._rules[selector] = rule;
  // insert rule
  var sheet = this.sheet;
  // ff
  if (sheet.insertRule) sheet.insertRule(rule.toString(), rule.index);
  else sheet.addRule(rule.selector, rule.property);
  return rule;
};

Sheet.prototype.removeRule = function(arg){
  if (typeof arg === 'number') return this.removeRuleAt(arg);
  var lu = this.lookup(arg);
  if (!lu) throw Error('no rule matches ' + arg);
  this.removeRuleAt(lu.index);
};

Sheet.prototype.removeRuleAt = function (idx){
  if (typeof idx !== 'number')
    throw new TypeError('must pass a number');
  // remove from cache
  var rules = this._rules;
  delete rules[keys(rules)[idx]];
  // ie
  if (this.sheet.removeRule) this.sheet.removeRule(idx);
  // modern
  else this.sheet.deleteRule(idx);
};

Sheet.prototype.lookup = function(selector){
  return this._rules[selector];
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
  return this.cssRules.length;
};
