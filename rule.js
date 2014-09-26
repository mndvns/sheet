
module.exports = Rule;

function Rule(selector, property, cache, sheet){
  this.sheet = sheet;
  this.cache = cache = cache || {};
  this.selector = selector;
  this.property = cache.property && cache.property + ';' + property || property;
  this.index = cache.index || sheet.length();
  this.cache = this;
}

Rule.prototype.merge = function(property){
  if (!property) return;
  this.property = this.property + ';' + property;
};

Rule.prototype.remove = function(){
  this.sheet.removeRuleAt(this.index);
};

Rule.prototype.toString = function(){
  return this.selector + '{' + this.property + '}';
};
