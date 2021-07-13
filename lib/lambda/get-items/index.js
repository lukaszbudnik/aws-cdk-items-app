const aws = require('aws-sdk');
const ddb = new aws.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

exports.handler = async(event) => {
    try {

        const params = {
            TableName: process.env.DDB_TABLE_NAME
        };

        let scanResults = [];
        let items;

        do {
            items = await ddb.scan(params).promise();
            items.Items.forEach((item) => scanResults.push(item));
            params.ExclusiveStartKey = items.LastEvaluatedKey;
        } while (typeof items.LastEvaluatedKey != "undefined");

        return {
            statusCode: 200,
            isBase64Encoded: false,
            body: JSON.stringify(scanResults),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
    catch (err) {
        console.log(err);
    }
};
