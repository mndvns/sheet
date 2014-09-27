/**
 * Module dependencies
 */

var Rule = require('./rule');
var keys = require('keys');
var uid = require('uid');

/**
 * Expose `Sheet`
 */

module.exports = Sheet;

function Sheet(title){
  this._rules = {};
  this.head = document.getElementsByTagName('head')[0];
  this.createStyleSheet(title);
}

/**
 * Create new stylesheet with optional `title`
 * @param {String} [title]
 */

Sheet.prototype.createStyleSheet = function(title){
  var head = this.head;
  var sheet, style, index;
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

  this.title = style.id = sheet.title = (title || uid(4));
  this.cssRules = sheet.cssRules;

  this.sheet = sheet;
  this.style = style;
  this.index = index;
};

/**
 * Remove stylesheet from `head`
 */

Sheet.prototype.remove = function(){
  this.head.removeChild(this.head.children[this.index]);
};

/**
 * Replace cached rule at `selector` and add rule to stylesheet
 * @param {String} selector
 * @param {String} property
 * @param {Number} [index]
 * @return {Rule}
 */

Sheet.prototype.insertRule = function(selector, property, index){
  // remove cached rule
  var cache = this._rules[selector];
  if (index) this.removeRuleAt(index);
  else if (cache && ~cache.index) this.removeRuleAt(cache.index);
  return this.addRule(selector, property, cache);
};

/**
 * Add rule to stylesheet
 * @param {String} selector
 * @param {String} property
 * @param {Object} [cache]
 * @return {Rule}
 */

Sheet.prototype.addRule = function(selector, property, cache){
  cache = cache || this._rules[selector];
  var m = /(.*){(.*)}/.exec(selector);
  if (m) {
    selector = m[1];
    property = m[2];
  }
  selector = selector.trim();
  // create rule
  var rule = new Rule(selector, property, cache, this);
  this._rules[selector] = rule;
  var sheet = this.sheet;
  // add to stylesheet
  if (sheet.insertRule) sheet.insertRule(rule.toString(), rule.index); // ff
  else sheet.addRule(rule.selector, rule.property); // chrome, ie
  return rule;
};

/**
 * Remove rule
 * @param {Number|String} arg
 */

Sheet.prototype.removeRule = function(arg){
  if (typeof arg === 'number') return this.removeRuleAt(arg);
  var lu = this.lookup(arg);
  if (!lu) throw Error('no rule matches ' + arg);
  this.removeRuleAt(lu.index);
};

/**
 * Remove rule at `index`
 * @param {Number} index
 */

Sheet.prototype.removeRuleAt = function (index){
  if (typeof index !== 'number')
    throw new TypeError('must pass a number');
  // remove from cache
  var rules = this._rules;
  delete rules[keys(rules)[index]];
  if (this.sheet.removeRule) this.sheet.removeRule(index); // ie
  else this.sheet.deleteRule(index); // modern
};

/**
 * Find rules that match `selector`
 * @param {String} selector
 * @return {Rule}
 */

Sheet.prototype.lookup = function(selector){
  return this._rules[selector];
};

/**
 * Enable stylsheet
 */

Sheet.prototype.enable = function(){
  this.sheet.disabled = false;
};

/**
 * Disable stylesheet
 */

Sheet.prototype.disable = function(){
  this.sheet.disabled = true;
};

/**
 * Toggle stylesheet
 */

Sheet.prototype.toggle = function(){
  this.sheet.disabled = !this.sheet.disabled;
};

/**
 * Stylesheet rules length
 * @return {Number}
 */

Sheet.prototype.length = function(){
  return this.cssRules.length;
};
