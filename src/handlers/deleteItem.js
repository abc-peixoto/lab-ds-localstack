/**
 * Lambda handler for deleting an item
 * DELETE /items/{id}
 */

const { dynamoDb, getTableName } = require('../utils/dynamodb');
const { success, error } = require('../utils/response');

module.exports.handler = async (event) => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return error('Item ID is required', 400);
    }

    const getParams = {
      TableName: getTableName(),
      Key: { id }
    };

    const existingItem = await dynamoDb.get(getParams).promise();
    if (!existingItem.Item) {
      return error('Item not found', 404);
    }

    const deleteParams = {
      TableName: getTableName(),
      Key: { id }
    };

    await dynamoDb.delete(deleteParams).promise();

    return success({ message: 'Item deleted successfully', id });
  } catch (err) {
    console.error('Error deleting item:', err);
    return error('Internal server error', 500);
  }
};


