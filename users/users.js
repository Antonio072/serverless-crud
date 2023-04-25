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
        "body": JSON.stringify({ 'message': 'Usuario encontrado', 'item': result.Item})
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
        "body": JSON.stringify({ 'message': `Usuario creado exitosamente`, item: data})
    }
}

const updateOne = async (event, context) => {
    const userID = event.pathParameters.id
    const data = JSON.parse(event.body)
    const params = {
        TableName: 'users',
        Key: {
            pk: userID
        },
        UpdateExpression: 'set #name = :name',
        ExpressionAttributeNames: {
            '#name': 'name',
        },
        ExpressionAttributeValues: {
            ':name': data.name,
        },
        ReturnValues: 'UPDATED_NEW'
    }

    await dynamoDB.update(params).promise()

    return {
        "statusCode": 200,
        "body": JSON.stringify({ 'message': `Usuario actualizado exitosamente`, 'data': data})
    }
}

const deleteOne = async (event, context) => {
    const userID = event.pathParameters.id
    const params = {
        TableName: 'users',
        Key: {
            pk: userID
        }
    }

    await dynamoDB.delete(params).promise()

    return {
        "statusCode": 200,
        "body": JSON.stringify({ 'message': `Usuario eliminado exitosamente`, 'item': userID})
    }
}

module.exports = {
    get,
    getOne,
    create,
    updateOne,
    deleteOne,
}