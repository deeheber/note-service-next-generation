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
        fieldLogLevel: FieldLogLevel.ERROR,
      },
      schema: Schema.fromAsset('src/graphql/schema.graphql')
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
      runtime: Runtime.NODEJS_14_X,
      handler: 'create.handler',
      code: Code.fromAsset('src/create'),
      memorySize: 3008
    });

    const createDs = api.addLambdaDataSource('createDatasource', createLambda);

    createDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'createNote'
    });

    createLambda.addEnvironment('TABLE_NAME', notesTable.tableName);
    notesTable.grantWriteData(createLambda);

    // list
    const listLambda = new Function(this, 'ListLambda', {
      functionName: 'list-lambda',
      runtime: Runtime.NODEJS_14_X,
      handler: 'list.handler',
      code: Code.fromAsset('src/list'),
      memorySize: 3008
    });

    const listDs = api.addLambdaDataSource('listDatasource', listLambda);

    listDs.createResolver({
      typeName: 'Query',
      fieldName: 'listNote'
    });

    listLambda.addEnvironment('TABLE_NAME', notesTable.tableName);
    notesTable.grantReadData(listLambda);

    // get
    const getLambda = new Function(this, 'GetLambda', {
      functionName: 'get-lambda',
      runtime: Runtime.NODEJS_14_X,
      handler: 'get.handler',
      code: Code.fromAsset('src/get'),
      memorySize: 3008
    });

    const getDs = api.addLambdaDataSource('getDatasource', getLambda);

    getDs.createResolver({
      typeName: 'Query',
      fieldName: 'getNote'
    });

    getLambda.addEnvironment('TABLE_NAME', notesTable.tableName);
    notesTable.grantReadData(getLambda);

    // TODO other queries/mutations
    // delete
    // update

    new CfnOutput(this, 'apiURL', {
      value: api.graphqlUrl
    });

    new CfnOutput(this, 'apiId', {
      value: api.apiId
    });
  }
}
