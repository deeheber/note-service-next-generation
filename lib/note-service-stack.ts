import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import { CfnOutput, RemovalPolicy, aws_lambda as lambda } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { FieldLogLevel, GraphqlApi, Schema } from '@aws-cdk/aws-appsync-alpha';

export class NoteServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create GQL AppSync API
    const api = new GraphqlApi(this, 'NotesApi', {
      name: 'notes-api',
      logConfig: {
        fieldLogLevel: FieldLogLevel.ERROR,
      },
      schema: Schema.fromAsset('src/graphql/schema.graphql'),
    });

    // Create DynamoDB table
    const notesTable = new Table(this, 'NotesTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'id', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      tableName: 'notes-table',
    });

    // Create
    const createLambda = this.createAppSyncLambda({
      lambdaId: 'CreateLambda',
      functionName: 'create-lambda',
      entry: 'dist/src/functions/create.js',
      environment: {
        ['TABLE_NAME']: notesTable.tableName,
      },
    });

    this.createResolverMappings({
      api,
      dataSourceName: 'createDatasource',
      lambdaFunction: createLambda,
      typeName: 'Mutation',
      fieldName: 'createNote',
    });

    notesTable.grantWriteData(createLambda);

    // List
    const listLambda = this.createAppSyncLambda({
      lambdaId: 'ListLambda',
      functionName: 'list-lambda',
      entry: 'dist/src/functions/list.js',
      environment: {
        ['TABLE_NAME']: notesTable.tableName,
      },
    });

    this.createResolverMappings({
      api,
      dataSourceName: 'listDatasource',
      lambdaFunction: listLambda,
      typeName: 'Query',
      fieldName: 'listNotes',
    });

    notesTable.grantReadData(listLambda);

    // Get
    const getLambda = this.createAppSyncLambda({
      lambdaId: 'GetLambda',
      functionName: 'get-lambda',
      entry: 'dist/src/functions/get.js',
      environment: {
        ['TABLE_NAME']: notesTable.tableName,
      },
    });

    this.createResolverMappings({
      api,
      dataSourceName: 'getDatasource',
      lambdaFunction: getLambda,
      typeName: 'Query',
      fieldName: 'getNote',
    });

    notesTable.grantReadData(getLambda);

    // Delete
    const deleteLambda = this.createAppSyncLambda({
      lambdaId: 'DeleteLambda',
      functionName: 'delete-lambda',
      entry: 'dist/src/functions/delete.js',
      environment: {
        ['TABLE_NAME']: notesTable.tableName,
      },
    });

    this.createResolverMappings({
      api,
      dataSourceName: 'deleteDatasource',
      lambdaFunction: deleteLambda,
      typeName: 'Mutation',
      fieldName: 'deleteNote',
    });

    notesTable.grantWriteData(deleteLambda);

    // Update
    const updateLambda = this.createAppSyncLambda({
      lambdaId: 'UpdateLambda',
      functionName: 'update-lambda',
      entry: 'dist/src/functions/update.js',
      environment: {
        ['TABLE_NAME']: notesTable.tableName,
      },
    });

    this.createResolverMappings({
      api,
      dataSourceName: 'updateDatasource',
      lambdaFunction: updateLambda,
      typeName: 'Mutation',
      fieldName: 'updateNote',
    });

    notesTable.grantWriteData(updateLambda);

    // Output Stack Variables
    new CfnOutput(this, 'apiURL', {
      value: api.graphqlUrl,
    });

    new CfnOutput(this, 'apiId', {
      value: api.apiId,
    });

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

  private createAppSyncLambda(params: {
    lambdaId: string;
    functionName: string;
    entry: string;
    environment: {
      [key: string]: string;
    };
  }): lambda.Function {
    const { lambdaId, functionName, entry, environment } = params;

    return new NodejsFunction(this, `${lambdaId}`, {
      functionName,
      runtime: Runtime.NODEJS_16_X,
      entry,
      logRetention: RetentionDays.ONE_WEEK,
      architecture: Architecture.ARM_64,
      memorySize: 3008,
      environment,
    });
  }

  private createResolverMappings(params: {
    api: GraphqlApi;
    dataSourceName: string;
    lambdaFunction: lambda.Function;
    typeName: string;
    fieldName: string;
  }): void {
    const { api, dataSourceName, lambdaFunction, typeName, fieldName } = params;

    const dataSource = api.addLambdaDataSource(
      `${dataSourceName}`,
      lambdaFunction
    );

    dataSource.createResolver({
      typeName,
      fieldName,
    });
  }
}
