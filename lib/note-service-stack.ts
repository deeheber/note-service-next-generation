import { CfnOutput, Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { FieldLogLevel, GraphqlApi, Schema } from '@aws-cdk/aws-appsync';
import { AttributeType, BillingMode, Table } from '@aws-cdk/aws-dynamodb';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';

export class NoteServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new GraphqlApi(this, 'NotesApi', {
      name: 'notes-api',
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
      },
      schema: Schema.fromAsset('./graphql/schema.graphql')
    });

    const notesTable = new Table(this, 'NotesTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'id', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      tableName: 'notes-table'
    });

    // create
    const createLambda = new Function(this, 'CreateLambda', {
      functionName: 'create-lambda',
      // TODO update to node 14
      runtime: Runtime.NODEJS_12_X,
      handler: 'create.handler',
      code: Code.fromAsset('lambda'),
      memorySize: 3008
    });

    const createDs = api.addLambdaDataSource('createDatasource', createLambda);

    createDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'createNote'
    });

    createLambda.addEnvironment('POST_TABLE', notesTable.tableName);
    notesTable.grantWriteData(createLambda);

    // TODO other queries/mutations
    // get
    // list
    // delete
    // update

    new CfnOutput(this, 'apiURL', {
      value: api.graphqlUrl
    })
  }
}
