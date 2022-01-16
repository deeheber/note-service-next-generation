import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

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

export const handler = async (event: GetEvent): Promise<Note | Error> => {
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
    // TODO fix this casting
    return response as Note;
  } catch (err: any) {
    console.error(`SOMETHING WENT WRONG: ${JSON.stringify(err, undefined, 2)}`);
    throw new Error(`${err.message}`);
  }
};
