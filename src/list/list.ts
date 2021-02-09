// @ts-ignore: Cannot redeclare block-scoped variable
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
}

interface NotesList {
  total: number;
  items: Note[];
}

exports.handler = async (event: any): Promise<NotesList | Error> => {
  console.log(JSON.stringify(event, undefined, 2));

  const params = {
    TableName: process.env.TABLE_NAME,
    Select: 'ALL_ATTRIBUTES'
  };

  try {
    const dbclient = new DynamoDBClient({ region: process.env.AWS_REGION });
    // Scaning an entire table can be slow and expensive on larger tables
    // This is just a sandbox experiment with a smaller table
    // If you have a larger table, use Query and paginate the responses
    const { Count, Items } = await dbclient.send(new ScanCommand(params));
    const response: NotesList = {
      total: Count,
      items: Items.map((item:object) => unmarshall(item))
    };
    
    return response;
  } catch (err) {
    console.error(`SOMETHING WENT WRONG: ${JSON.stringify(err, undefined, 2)}`);
    throw new Error(`${err.message}`);
  }
};
