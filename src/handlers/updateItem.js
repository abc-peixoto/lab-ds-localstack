/**
 * Lambda handler for updating an existing item
 * PUT /items/{id}
 */

const { dynamoDb, getTableName } = require('../utils/dynamodb');
const { publishNotification } = require('../utils/sns');
const { validateUpdateItem } = require('../utils/validation');
const { success, error } = require('../utils/response');

module.exports.handler = async (event) => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return error('Item ID is required', 400);
    }

    let body;
    try {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (e) {
      return error('Invalid JSON in request body', 400);
    }

    const validation = validateUpdateItem(body);
    if (!validation.isValid) {
      return error(validation.errors.join(', '), 400);
    }

    const getParams = {
      TableName: getTableName(),
      Key: { id }
    };

    const existingItem = await dynamoDb.get(getParams).promise();
    if (!existingItem.Item) {
      return error('Item not found', 404);
    }

    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    if (body.name !== undefined) {
      updateExpressions.push('#name = :name');
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':name'] = body.name.trim();
    }

    if (body.description !== undefined) {
      updateExpressions.push('#description = :description');
      expressionAttributeNames['#description'] = 'description';
      expressionAttributeValues[':description'] = body.description;
    }

    if (body.price !== undefined) {
      updateExpressions.push('#price = :price');
      expressionAttributeNames['#price'] = 'price';
      expressionAttributeValues[':price'] = body.price;
    }

    if (body.category !== undefined) {
      updateExpressions.push('#category = :category');
      expressionAttributeNames['#category'] = 'category';
      expressionAttributeValues[':category'] = body.category;
    }

    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const updateParams = {
      TableName: getTableName(),
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamoDb.update(updateParams).promise();

    try {
      const topicArn = process.env.SNS_TOPIC_ARN;
      if (topicArn) {
        await publishNotification(topicArn, 'UPDATED', result.Attributes);
      }
    } catch (snsError) {
      console.error('Failed to publish SNS notification:', snsError);
    }

    return success(result.Attributes);
  } catch (err) {
    console.error('Error updating item:', err);
    return error('Internal server error', 500);
  }
};

