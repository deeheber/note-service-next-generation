import { App } from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'

import { NoteServiceStack } from '../lib/note-service-stack'

test('Verify resources are created', () => {
  const app = new App()
  const stack = new NoteServiceStack(app, 'MyTestStack')
  const template = Template.fromStack(stack)

  template.resourceCountIs('AWS::DynamoDB::Table', 1)
  template.resourceCountIs('AWS::AppSync::GraphQLApi', 1)
  template.resourceCountIs('AWS::AppSync::GraphQLSchema', 1)
  template.resourceCountIs('AWS::AppSync::Resolver', 5)

  template.hasResourceProperties('AWS::Lambda::Function', {
    FunctionName: 'update-lambda',
    Runtime: 'nodejs18.x',
  })
  template.hasResourceProperties('AWS::Lambda::Function', {
    FunctionName: 'delete-lambda',
    Runtime: 'nodejs18.x',
  })
  template.hasResourceProperties('AWS::AppSync::Resolver', {
    FieldName: 'getNote',
    TypeName: 'Query',
    DataSourceName: 'NotesDataSource',
  })
  template.hasResourceProperties('AWS::AppSync::Resolver', {
    FieldName: 'listNotes',
    TypeName: 'Query',
    DataSourceName: 'NotesDataSource',
  })
  template.hasResourceProperties('AWS::AppSync::Resolver', {
    FieldName: 'createNote',
    TypeName: 'Mutation',
    DataSourceName: 'NotesDataSource',
  })
})
