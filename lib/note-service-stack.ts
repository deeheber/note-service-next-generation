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

    // Create GQL AppSync API
    const api = new GraphqlApi(this, 'NotesApi', {
      name: 'notes-api',
      logConfig: {
        fieldLogLevel: FieldLogLevel.ERROR,
      },
      definition: Definition.fromFile(
        path.join(__dirname, '../src/graphql/schema.graphql')
      ),
    })

    // Create DynamoDB table
    const notesTable = new Table(this, 'NotesTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'id', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      tableName: 'notes-table',
    })

    // DynamoDB table data source
    const notesDS = api.addDynamoDbDataSource('NotesDataSource', notesTable)

    notesTable.grantReadWriteData(notesDS)

    // Resolvers
    // Create
    new Resolver(this, 'createResolver', {
      api,
      typeName: 'Mutation',
      fieldName: 'createNote',
      dataSource: notesDS,
      code: Code.fromAsset('lib/gql-functions/create.js'),
      runtime: FunctionRuntime.JS_1_0_0,
    })

    // List
    new Resolver(this, 'listResolver', {
      api,
      typeName: 'Query',
      fieldName: 'listNotes',
      dataSource: notesDS,
      code: Code.fromAsset('lib/gql-functions/list.js'),
      runtime: FunctionRuntime.JS_1_0_0,
    })

    // Get
    new Resolver(this, 'getResolver', {
      api,
      typeName: 'Query',
      fieldName: 'getNote',
      dataSource: notesDS,
      code: Code.fromAsset('lib/gql-functions/get.js'),
      runtime: FunctionRuntime.JS_1_0_0,
    })

    // Delete
    new Resolver(this, 'deleteResolver', {
      api,
      typeName: 'Mutation',
      fieldName: 'deleteNote',
      dataSource: notesDS,
      code: Code.fromAsset('lib/gql-functions/delete.js'),
      runtime: FunctionRuntime.JS_1_0_0,
    })

    // Update
    new Resolver(this, 'updateResolver', {
      api,
      typeName: 'Mutation',
      fieldName: 'updateNote',
      dataSource: notesDS,
      code: Code.fromAsset('lib/gql-functions/update.js'),
      runtime: FunctionRuntime.JS_1_0_0,
    })

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
