const { v4: uuidv4 } = require('uuid');
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

interface AppSyncEvent {
  arguments: {
    note: {
      author: string;
      content: string;
    }
  }
}

interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

exports.handler = async (event: AppSyncEvent): Promise<Note | Error> => {
  console.log(JSON.stringify(event, undefined, 2));

  try {
    const input: Note = {
      id: uuidv4(),
      content: event.arguments.note.content,
      author: event.arguments.note.author,
      createdAt: new Date().getTime().toString(),
    };
    const params = {
      TableName: process.env.TABLE_NAME,
      Item: marshall(input)
    };
  
    const dbclient = new DynamoDBClient({ region: process.env.AWS_REGION });
    await dbclient.send(new PutItemCommand(params));

    return input;
  } catch (err) {
    console.error(`SOMETHING WENT WRONG: ${JSON.stringify(err, undefined, 2)}`);
    throw new Error(`${err.message}`);
  }
}