// @ts-ignore: Cannot redeclare block-scoped variable
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
// @ts-ignore: Cannot redeclare block-scoped variable
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");

interface GetEvent {
  arguments: {
    id: string;
  }
}

interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
}

exports.handler = async (event: GetEvent): Promise<Note | Error> => {
  console.log(JSON.stringify(event, undefined, 2));

  try {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: { id: event.arguments.id }
    };
    const client = new DynamoDBClient({ region: process.env.AWS_REGION });
    const ddbDocClient = DynamoDBDocumentClient.from(client);

    const { Item } = await ddbDocClient.send(new GetCommand(params));
    const response = Item;
    return response;
  } catch (err) {
    console.error(`SOMETHING WENT WRONG: ${JSON.stringify(err, undefined, 2)}`);
    throw new Error(`${err.message}`);
  }
};
