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

  template.hasResourceProperties('AWS::AppSync::DataSource', {
    Type: 'AMAZON_DYNAMODB',
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
  template.hasResourceProperties('AWS::AppSync::Resolver', {
    FieldName: 'deleteNote',
    TypeName: 'Mutation',
    DataSourceName: 'NotesDataSource',
  })
  template.hasResourceProperties('AWS::AppSync::Resolver', {
    FieldName: 'updateNote',
    TypeName: 'Mutation',
    DataSourceName: 'NotesDataSource',
  })
})
