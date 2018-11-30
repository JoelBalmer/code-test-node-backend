if (!req.query.startDate || !req.query.endDate) {
  var err = new Error("Date values not supplied");
  err.status = 400;
  next(err);  
  return;
}