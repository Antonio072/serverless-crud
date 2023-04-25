const aws = require('aws-sdk')
const { randomUUID } = require('crypto')

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

const getOne = async (event, context) => {
    const userID = event.pathParameters.id
    const params = {
        TableName: 'users',
        Key: {
            pk: userID
        }
    }

    let result = await dynamoDB.get(params).promise()

    return {
        "statusCode": 200,
        "body": JSON.stringify({ 'message': `Resultado: ${JSON.stringify(result)}`})
    }
}

const create = async (event, context) => {
    const id = randomUUID()

    const data = JSON.parse(event.body)
    data.pk = id
    const params = {
        TableName: 'users',
        Item: data
    }
    await dynamoDB.put(params).promise()

    return {
        "statusCode": 200,
        "body": JSON.stringify({ 'message': `Usuario creado exitosamente: ${JSON.stringify(params.Item)}`})
    }
}

module.exports = {
    get,
    getOne,
    create,
}
