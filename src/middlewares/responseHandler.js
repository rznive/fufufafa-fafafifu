module.exports = {
  success(res, message = "Success", data = null, status = 200) {
    const response = {
      success: true,
      message,
    };

    if (data !== null) {
      response.data = data;
    }

    return res.status(status).json(response);
  },

  error(res, message = "Error", status = 400, errors = null) {
    const response = {
      success: false,
      message,
    };
    if (errors !== null) {
      response.errors = errors;
    }

    return res.status(status).json(response);
  },
};
