/**
 * Lambda handler for listing all items
 * GET /items
 */

const { dynamoDb, getTableName } = require('../utils/dynamodb');
const { success, error } = require('../utils/response');

module.exports.handler = async (event) => {
  try {
    const params = {
      TableName: getTableName()
    };

    const result = await dynamoDb.scan(params).promise();

    return success({
      items: result.Items || [],
      count: result.Items ? result.Items.length : 0
    });
  } catch (err) {
    console.error('Error listing items:', err);
    return error('Internal server error', 500);
  }
};

