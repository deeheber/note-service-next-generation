import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb'

interface DeleteEvent {
  arguments: {
    id: string
  }
}

export const handler = async (event: DeleteEvent): Promise<string | Error> => {
  console.log(JSON.stringify(event, undefined, 2))

  try {
    const id = event.arguments.id
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: { id },
    }

    const client = new DynamoDBClient({ region: process.env.AWS_REGION })
    const ddbDocClient = DynamoDBDocumentClient.from(client)
    await ddbDocClient.send(new DeleteCommand(params))

    return id
  } catch (err: any) {
    console.error(`SOMETHING WENT WRONG: ${JSON.stringify(err, undefined, 2)}`)
    throw new Error(`${err.message}`)
  }
}
