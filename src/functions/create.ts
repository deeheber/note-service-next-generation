import { randomUUID } from 'crypto'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

interface CreateEvent {
  arguments: {
    note: {
      author: string
      content: string
    }
  }
}

interface Note {
  id: string
  content: string
  author: string
  createdAt: string
}

export const handler = async (event: CreateEvent): Promise<Note | Error> => {
  console.log(JSON.stringify(event, undefined, 2))

  try {
    const input: Note = {
      id: randomUUID(),
      content: event.arguments.note.content,
      author: event.arguments.note.author,
      createdAt: new Date().toISOString(),
    }
    const params = {
      TableName: process.env.TABLE_NAME,
      Item: input,
    }

    const client = new DynamoDBClient({ region: process.env.AWS_REGION })
    const ddbDocClient = DynamoDBDocumentClient.from(client)
    await ddbDocClient.send(new PutCommand(params))

    return input
  } catch (err: any) {
    console.error(`SOMETHING WENT WRONG: ${JSON.stringify(err, undefined, 2)}`)
    throw new Error(`${err.message}`)
  }
}
