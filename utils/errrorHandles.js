const createError = require("http-errors");

module.exports = app => {
  app.use((req, res, next) => {
    next(createError(404));
  });

  app.use((err, req, res, next) => {
    let status = err.status || 500;
    let errorCode = "error";
    if (status === 404) errorCode = "404";
    if (status === 500) errorCode = "500";
    let errorMsg = err.message;
    res.render(`errors/${errorView}`, {
      layout: false,
      errorCode,
      errorMsg,
      error: err
    });
  });
};
