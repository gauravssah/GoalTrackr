const AppError = require("../utils/app-error");

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    if (!result.success) {
      return next(new AppError(result.error.errors.map((entry) => entry.message).join(", "), 400));
    }

    req.validated = result.data;
    return next();
  };
}

module.exports = validate;
