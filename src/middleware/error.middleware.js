//Handles requests that do not match any defined API route
const notFoundHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found."
  });
};

//Centralized error handler for errors that are passed through Express
const errorHandler = (err, req, res, next) => {
  //Handles malformed JSON sent in the request body
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON in request body."
    });
  }

  //Log the full error on the server for debugging and internal error details are never returned to the client
  console.error("Unhandled application error:", err);

  return res.status(500).json({
    success: false,
    message: "An unexpected error occurred."
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};