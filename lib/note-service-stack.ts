import * as path from 'path'
import { Construct } from 'constructs'
import { Duration, Stack, StackProps } from 'aws-cdk-lib'
import { CfnOutput, RemovalPolicy, aws_lambda as lambda } from 'aws-cdk-lib'
import {
  Code,
  Definition,
  FieldLogLevel,
  FunctionRuntime,
  GraphqlApi,
  Resolver,
} from 'aws-cdk-lib/aws-appsync'
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb'
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { RetentionDays } from 'aws-cdk-lib/aws-logs'

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

    // Create
    const createLambda = this.createAppSyncLambda({
      lambdaId: 'CreateLambda',
      functionName: 'create-lambda',
      entry: 'dist/src/functions/create.js',
      environment: {
        ['TABLE_NAME']: notesTable.tableName,
      },
    })

    this.createResolverMappings({
      api,
      dataSourceName: 'createDatasource',
      resolverName: 'createResolver',
      lambdaFunction: createLambda,
      typeName: 'Mutation',
      fieldName: 'createNote',
    })

    notesTable.grantWriteData(createLambda)

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
    const deleteLambda = this.createAppSyncLambda({
      lambdaId: 'DeleteLambda',
      functionName: 'delete-lambda',
      entry: 'dist/src/functions/delete.js',
      environment: {
        ['TABLE_NAME']: notesTable.tableName,
      },
    })

    this.createResolverMappings({
      api,
      dataSourceName: 'deleteDatasource',
      resolverName: 'deleteResolver',
      lambdaFunction: deleteLambda,
      typeName: 'Mutation',
      fieldName: 'deleteNote',
    })

    notesTable.grantWriteData(deleteLambda)

    // Update
    const updateLambda = this.createAppSyncLambda({
      lambdaId: 'UpdateLambda',
      functionName: 'update-lambda',
      entry: 'dist/src/functions/update.js',
      environment: {
        ['TABLE_NAME']: notesTable.tableName,
      },
    })

    this.createResolverMappings({
      api,
      dataSourceName: 'updateDatasource',
      resolverName: 'updateResolver',
      lambdaFunction: updateLambda,
      typeName: 'Mutation',
      fieldName: 'updateNote',
    })
    // TODO: could probably have a more restrictive IAM policy
    notesTable.grantReadWriteData(updateLambda)

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

  private createAppSyncLambda(params: {
    lambdaId: string
    functionName: string
    entry: string
    environment: {
      [key: string]: string
    }
  }): lambda.Function {
    const { lambdaId, functionName, entry, environment } = params

    return new NodejsFunction(this, lambdaId, {
      functionName,
      runtime: Runtime.NODEJS_18_X,
      entry,
      logRetention: RetentionDays.ONE_WEEK,
      architecture: Architecture.ARM_64,
      timeout: Duration.seconds(15),
      memorySize: 3008,
      environment,
    })
  }

  private createResolverMappings(params: {
    api: GraphqlApi
    dataSourceName: string
    resolverName: string
    lambdaFunction: lambda.Function
    typeName: string
    fieldName: string
  }): void {
    const {
      api,
      dataSourceName,
      resolverName,
      lambdaFunction,
      typeName,
      fieldName,
    } = params

    const dataSource = api.addLambdaDataSource(dataSourceName, lambdaFunction)

    dataSource.createResolver(resolverName, {
      typeName,
      fieldName,
    })
  }
}
