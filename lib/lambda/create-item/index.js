const aws = require('aws-sdk');
const ddb = new aws.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const { v4: uuidv4 } = require('uuid');

exports.handler = async(event) => {
    console.log('Got new event');
    console.log(event.body);
    console.log(event.requestContext.authorizer.jwt);

    const username = event.requestContext.authorizer.jwt.claims.email;

    try {

        const req = JSON.parse(event.body);
        const t = new Date().toISOString();
        const params = {
            TableName: process.env.DDB_TABLE_NAME,
            Item: {
                pk: 'user#' + username,
                sk: 'item#' + uuidv4(),
                title: req.title,
                timeCreated: t
            }
        };

        const res = await ddb.put(params).promise();
        return {
            statusCode: 200,
            isBase64Encoded: false,
            body: JSON.stringify(res),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
    catch (err) {
        console.log(err);
    }
};
