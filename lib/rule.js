/**
 * Module dependencies
 */

var query = require('query');

/**
 * Expose `Rule`
 */

module.exports = Rule;

/**
 * Create new rule, merging with `cache`
 * @param {String} selector
 * @param {String} property
 * @param {Rule} [cache]
 * @param {Sheet} sheet
 */

function Rule(selector, property, cache, sheet){
  this.cache = cache = cache || {};
  this.selector = selector;
  this.property = cache.property && cache.property + '; ' + property || property;
  this.index = cache.index || sheet.length();
  this.sheet = sheet;
  this.cache = this;
}

/**
 * Find single element in dom with `this.selector`
 * @return {Element}
 */

Rule.prototype.query = function(){
  return query(this.selector);
};

/**
 * Find all elements in dom with `this.selector`
 * @return {Array}
 */

Rule.prototype.queryAll = function(){
  return query.all(this.selector);
};

/**
 * Merge given `property` with current `property` and update stylesheet
 * @return {Rule}
 */

Rule.prototype.merge = function(property){
  if (!property) return;
  this.property = this.property + '; ' + property;
  return this.update();
};

/**
 * Update stylesheet with rule properties
 * @return {Rule}
 */

Rule.prototype.update = function(){
  return this.remove().add();
};

/**
 * Add rule to stylesheet
 * @return {Rule}
 */

Rule.prototype.add = function(){
  return this.sheet.insertRule(this.cache.selector, this.cache.property, this.index);
};

/**
 * Remove rule from stylsheet
 * @return {Rule}
 */

Rule.prototype.remove = function(){
  this.sheet.removeRuleAt(this.index);
  return this;
};

/**
 * Return rule cssText
 * @return {String}
 */

Rule.prototype.toString = function(){
  return this.selector + '{ ' + this.property + ' }';
};
