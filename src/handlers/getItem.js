/**
 * Lambda handler for getting a single item by ID
 * GET /items/{id}
 */

const { dynamoDb, getTableName } = require('../utils/dynamodb');
const { success, error } = require('../utils/response');

module.exports.handler = async (event) => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return error('Item ID is required', 400);
    }

    const params = {
      TableName: getTableName(),
      Key: {
        id: id
      }
    };

    const result = await dynamoDb.get(params).promise();

    if (!result.Item) {
      return error('Item not found', 404);
    }

    return success(result.Item);
  } catch (err) {
    console.error('Error getting item:', err);
    return error('Internal server error', 500);
  }
};

