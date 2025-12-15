/**
 * SNS utility functions for publishing notifications
 */
const AWS = require("aws-sdk");

function localEndpoint() {
  const host = process.env.LOCALSTACK_HOSTNAME || "localhost";
  return `http://${host}:4566`;
}

const isLocal = process.env.STAGE === "local" || process.env.IS_OFFLINE === "true";

const sns = new AWS.SNS({
  region: process.env.AWS_REGION || "us-east-1",
  ...(isLocal ? { endpoint: localEndpoint() } : {}),
});

async function publishNotification(topicArn, eventType, item) {
  return sns
    .publish({
      TopicArn: topicArn,
      Subject: `ITEM_${eventType}`,
      Message: JSON.stringify({ eventType, item }),
    })
    .promise();
}

module.exports = { publishNotification };
