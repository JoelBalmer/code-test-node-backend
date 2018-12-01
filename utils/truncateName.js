module.exports = function truncateName(name) {
  var truncatedName = name;
  if (name.length > 50) {
    truncatedName = name.slice(0,50);
  }

  return truncatedName;
};