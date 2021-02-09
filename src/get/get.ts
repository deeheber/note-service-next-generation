// @ts-ignore: Cannot redeclare block-scoped variable
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
// @ts-ignore: Cannot redeclare block-scoped variable
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

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

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: marshall({
      id: event.arguments.id
    })
  };

  try {
    const dbclient = new DynamoDBClient({ region: process.env.AWS_REGION });
    const { Item } = await dbclient.send(new GetItemCommand(params));

    const response = unmarshall(Item);
    return response;
  } catch (err) {
    console.log(`SOMETHING WENT WRONG: ${JSON.stringify(err, undefined, 2)}`);
    throw new Error(`${err.message}`);
  }
};
