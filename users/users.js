const aws = require('aws-sdk')
const dynamoDB = new aws.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    acessKeyId: 'DEFAULT_ACCESS_KEY',
    secretAccessKey: 'DEFAULT_SECRET'
})

const get = async (event, context) => {
    const params = {
        ExpressionAttributeValues: {
            ':pk': '1'
        },
        KeyConditionExpression: 'pk = :pk',
        TableName: 'users' 
    }

    let result = await dynamoDB.query(params).promise()
    console.log(result)

    return {
        "statusCode": 200,
        "body": JSON.stringify({ 'message': `Resultado: ${JSON.stringify(result)}`})
    }
}

module.exports = {
    get
}
