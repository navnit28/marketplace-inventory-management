module.exports.sqsListener = async (event) => {
    console.log('event', JSON.parse(event))
    return {
        statusCode: 200,
        body: JSON.stringify({
        message: 'SQS Listener executed successfully!',
        input: event,
        }),
    }
}
