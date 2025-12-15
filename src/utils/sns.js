/**
 * SNS utility functions for publishing notifications
 */

const AWS = require('aws-sdk');

const sns = new AWS.SNS({
  endpoint: process.env.IS_OFFLINE || process.env.STAGE === 'local' 
    ? 'http://localhost:4566' 
    : undefined,
  region: process.env.AWS_REGION || 'us-east-1'
});

const publishNotification = async (topicArn, eventType, item) => {
  try {
    const message = {
      eventType,
      timestamp: new Date().toISOString(),
      item: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category
      }
    };

    const params = {
      TopicArn: topicArn,
      Message: JSON.stringify(message),
      Subject: `Item ${eventType}: ${item.name}`
    };

    const result = await sns.publish(params).promise();
    console.log('SNS notification published:', result.MessageId);
    
    return result;
  } catch (error) {
    console.error('Error publishing SNS notification:', error);
    throw error;
  }
};

module.exports = {
  publishNotification
};

