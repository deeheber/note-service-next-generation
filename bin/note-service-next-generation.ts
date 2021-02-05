#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { NoteServiceNextGenerationStack } from '../lib/note-service-next-generation-stack';

const app = new cdk.App();
new NoteServiceNextGenerationStack(app, 'NoteServiceNextGenerationStack');
