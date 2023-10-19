#!/usr/bin/env node
import { App } from 'aws-cdk-lib'
import { NoteServiceStack } from '../lib/note-service-stack'

const app = new App()
new NoteServiceStack(app, 'NoteServiceStack', {
  description: 'This is a sample CRUD API for notes using GQL',
})
