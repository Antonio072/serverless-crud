const aws = require('aws-sdk')

let dynamoDBParams = []

if (process.env.IS_OFFLINE) {
    dynamoDBParams = 
    {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        acessKeyId: 'DEFAULT_ACCESS_KEY',
        secretAccessKey: 'DEFAULT_SECRET'
    }
}
const dynamoDB = new aws.DynamoDB.DocumentClient(dynamoDBParams)

const get = async (event, context) => {
    const params = {
        TableName: 'users',
        select: 'ALL_ATTRIBUTES'
    }

    let result = await dynamoDB.scan(params).promise()
    console.log(result)

    return {
        "statusCode": 200,
        "body": JSON.stringify({ 'message': `Resultado: ${JSON.stringify(result)}`})
    }
}

module.exports = {
    get
}
