/**
 * Utility functions for API Gateway responses
 */

const createResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    body: JSON.stringify(body)
  };
};

const success = (data, statusCode = 200) => {
  return createResponse(statusCode, {
    success: true,
    data
  });
};

const error = (message, statusCode = 400) => {
  return createResponse(statusCode, {
    success: false,
    error: message
  });
};

module.exports = {
  success,
  error,
  createResponse
};


