#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { NoteServiceStack } from '../lib/note-service-stack';

const app = new cdk.App();
new NoteServiceStack(app, 'NoteServiceStack');
