// @ts-ignore: Cannot redeclare block-scoped variable
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
// @ts-ignore: Cannot redeclare block-scoped variable
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

interface UpdateEvent {
  arguments: {
    id: string;
    content: string;
  }
}

interface UpdatedNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

exports.handler = async (event: UpdateEvent): Promise<UpdatedNote | Error>=> {
  console.log(JSON.stringify(event, undefined, 2));

  try {  
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: { id: event.arguments.id },
      UpdateExpression: 'SET content = :content, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':content': event.arguments.content,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };

    const dbclient = new DynamoDBClient({ region: process.env.AWS_REGION });
    const { Attributes } = await dbclient.send(new UpdateCommand(params));

    return Attributes;
  } catch (err) {
    console.error(`SOMETHING WENT WRONG: ${JSON.stringify(err, undefined, 2)}`);
    throw new Error(`${err.message}`);
  }
};