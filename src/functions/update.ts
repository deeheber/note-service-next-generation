import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

interface UpdateEvent {
  arguments: {
    id: string;
    content: string;
  };
}

interface UpdatedNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export const handler = async (
  event: UpdateEvent
): Promise<UpdatedNote | Error> => {
  console.log(JSON.stringify(event, undefined, 2));

  try {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: { id: event.arguments.id },
      UpdateExpression: 'SET content = :content, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':content': event.arguments.content,
        ':updatedAt': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    };

    const client = new DynamoDBClient({ region: process.env.AWS_REGION });
    const ddbDocClient = DynamoDBDocumentClient.from(client);

    // Check if the item exists before update
    // Ensures data integrity of items in the table
    const { Item } = await ddbDocClient.send(new GetCommand(params));
    if (!Item) {
      throw new Error(`Item with id: ${event.arguments.id} not found.`);
    }

    const { Attributes } = await ddbDocClient.send(new UpdateCommand(params));
    return Attributes as UpdatedNote;
  } catch (err: any) {
    console.error(`SOMETHING WENT WRONG: ${JSON.stringify(err, undefined, 2)}`);
    throw new Error(`${err.message}`);
  }
};
