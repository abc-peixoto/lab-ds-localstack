/**
 * Lambda handler for creating a new item
 * POST /items
 */

const { v4: uuidv4 } = require('uuid');
const { dynamoDb, getTableName } = require('../utils/dynamodb');
const { publishNotification } = require('../utils/sns');
const { validateItem } = require('../utils/validation');
const { success, error } = require('../utils/response');

module.exports.handler = async (event) => {
  try {
    let body;
    try {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (e) {
      return error('Invalid JSON in request body', 400);
    }

    const validation = validateItem(body);
    if (!validation.isValid) {
      return error(validation.errors.join(', '), 400);
    }

    const item = {
      id: uuidv4(),
      name: body.name.trim(),
      description: body.description || '',
      price: body.price || 0,
      category: body.category || 'general',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const params = {
      TableName: getTableName(),
      Item: item
    };

    await dynamoDb.put(params).promise();

    try {
      const topicArn = process.env.SNS_TOPIC_ARN;
      if (topicArn) {
        await publishNotification(topicArn, 'CREATED', item);
      }
    } catch (snsError) {
      console.error('Failed to publish SNS notification:', snsError);
    }

    return success(item, 201);
  } catch (err) {
    console.error('Error creating item:', err);
    return error('Internal server error', 500);
  }
};

