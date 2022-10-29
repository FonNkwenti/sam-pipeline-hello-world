"use strict";

const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const uuid = require("uuid");
const tableName = process.env.TABLE_NAME;

// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';

let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.lambdaHandler = async (event, context) => {
  try {
    const put_params = {
      // const ret = await axios(url);
      TableName: tableName,
      Item: {
        id: uuid.v1(),
        description: "added",
        timestamp: "now",
      },
    };

    // await dynamodb.putItem(put_params).promise();
    await dynamodb.put(put_params).promise();

    const get_params = {
      TableName: tableName,
      Select: "ALL_ATTRIBUTES",
    };

    const list_response = await dynamodb.scan(get_params).promise();

    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: "hello world SAM sync👋🏽 with SAM Pipeline for GitHub Actions",
        count: list_response.Items.length,
        // location: ret.data.trim()
      }),
    };
  } catch (err) {
    console.log(err);
    return err;
  }

  return response;
};
