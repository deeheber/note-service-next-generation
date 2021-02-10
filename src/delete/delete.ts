// @ts-ignore: Cannot redeclare block-scoped variable
const { DynamoDBClient, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
// @ts-ignore: Cannot redeclare block-scoped variable
const { marshall } = require("@aws-sdk/util-dynamodb");

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
      Key: marshall({ id })
    };
    
    const dbclient = new DynamoDBClient({ region: process.env.AWS_REGION });
    await dbclient.send(new DeleteItemCommand(params));

    return id;
  } catch (err) {
    console.error(`SOMETHING WENT WRONG: ${JSON.stringify(err, undefined, 2)}`);
    throw new Error(`${err.message}`);
  }
};
