module.exports = function createError(message, status) {
  var err = new Error(message);
  err.status = status;
  return err;
};