/**
 * Lambda handler for SNS notification subscriber
 * This function is triggered when a message is published to the SNS topic
 */

module.exports.handler = async (event) => {
  console.log('SNS Notification received:', JSON.stringify(event, null, 2));

  try {
    for (const record of event.Records || []) {
      if (record.Sns) {
        const message = JSON.parse(record.Sns.Message);
        const subject = record.Sns.Subject;
        const timestamp = record.Sns.Timestamp;

        console.log('Processing notification:');
        console.log('- Subject:', subject);
        console.log('- Event Type:', message.eventType);
        console.log('- Timestamp:', timestamp);
        console.log('- Item:', JSON.stringify(message.item, null, 2));

        console.log(`Notification processed successfully for ${message.eventType} event`);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Notifications processed successfully'
      })
    };
  } catch (err) {
    console.error('Error processing SNS notification:', err);
    throw err;
  }
};

