import { DynamoDBClient, Select } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

interface Note {
  id: string
  content: string
  author: string
  createdAt: string
  updatedAt?: string
}

interface NotesList {
  total: number | undefined
  items: Note[]
}

export const handler = async (event: any): Promise<NotesList | Error> => {
  console.log(JSON.stringify(event, undefined, 2))

  try {
    const params = {
      TableName: process.env.TABLE_NAME,
      Select: 'ALL_ATTRIBUTES' as Select,
    }
    const client = new DynamoDBClient({ region: process.env.AWS_REGION })
    const ddbDocClient = DynamoDBDocumentClient.from(client)
    // Scaning an entire table can be slow and expensive on larger tables
    // This is just a sandbox experiment with a smaller table
    // If you have a larger table, use Query and paginate the responses
    const { Count, Items } = await ddbDocClient.send(new ScanCommand(params))
    const response: NotesList = {
      total: Count,
      // TODO fix this casting
      items: Items as Note[],
    }

    return response
  } catch (err: any) {
    console.error(`SOMETHING WENT WRONG: ${JSON.stringify(err, undefined, 2)}`)
    throw new Error(`${err.message}`)
  }
}
