import * as path from 'path'
import { Construct } from 'constructs'
import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib'
import {
  Code,
  Definition,
  FieldLogLevel,
  FunctionRuntime,
  GraphqlApi,
  Resolver,
} from 'aws-cdk-lib/aws-appsync'
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb'

export class NoteServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // GQL AppSync API
    const api = new GraphqlApi(this, 'NotesApi', {
      name: 'notes-api',
      logConfig: {
        fieldLogLevel: FieldLogLevel.ERROR,
      },
      definition: Definition.fromFile(
        path.join(__dirname, '../src/schema.graphql')
      ),
    })

    // DynamoDB table
    const notesTable = new Table(this, 'NotesTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'id', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      tableName: 'notes-table',
    })

    // DynamoDB table data source
    const notesDS = api.addDynamoDbDataSource('NotesDataSource', notesTable)

    notesTable.grantReadWriteData(notesDS)

    // GQL resolvers
    const resolvers = [
      {
        typeName: 'Query',
        fieldName: 'getNote',
        codePath: 'lib/gql/get.js',
      },
      {
        typeName: 'Query',
        fieldName: 'listNotes',
        codePath: 'lib/gql/list.js',
      },
      {
        typeName: 'Mutation',
        fieldName: 'createNote',
        codePath: 'lib/gql/create.js',
      },
      {
        typeName: 'Mutation',
        fieldName: 'updateNote',
        codePath: 'lib/gql/update.js',
      },
      {
        typeName: 'Mutation',
        fieldName: 'deleteNote',
        codePath: 'lib/gql/delete.js',
      },
    ]

    for (const resolver of resolvers) {
      const { typeName, fieldName, codePath } = resolver

      new Resolver(this, `${fieldName}Resolver`, {
        api,
        typeName: typeName,
        fieldName: fieldName,
        dataSource: notesDS,
        code: Code.fromAsset(codePath),
        runtime: FunctionRuntime.JS_1_0_0,
      })
    }

    // Output Stack Variables
    new CfnOutput(this, 'apiURL', {
      value: api.graphqlUrl,
    })

    new CfnOutput(this, 'apiId', {
      value: api.apiId,
    })

    /**
     * Quick hack to quickly get the GQL API key
     * This will print out the API key to the console, so you probably don't want to do this for security reasons.
     */
    // if (api.apiKey) {
    //   new CfnOutput(this, 'apiKey', {
    //     value: api.apiKey
    //   });
    // }
  }
}
