// @ts-ignore: Cannot redeclare block-scoped variable
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
// @ts-ignore: Cannot redeclare block-scoped variable
const { DynamoDBDocumentClient, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

interface DeleteEvent {
  arguments: {
    id: string;
  }
}

exports.handler = async (event: DeleteEvent): Promise<string | Error> => {
  console.log(JSON.stringify(event, undefined, 2));

  try {
    const id = event.arguments.id;
    // TODO possibly add a condition expression that checks the item exists before deleting it
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: { id }
    };
    
    const client = new DynamoDBClient({ region: process.env.AWS_REGION });
    const ddbDocClient = DynamoDBDocumentClient.from(client);
    await ddbDocClient.send(new DeleteCommand(params));

    return id;
  } catch (err) {
    console.error(`SOMETHING WENT WRONG: ${JSON.stringify(err, undefined, 2)}`);
    throw new Error(`${err.message}`);
  }
};
