import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as NoteServiceNextGeneration from '../lib/note-service-next-generation-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new NoteServiceNextGeneration.NoteServiceNextGenerationStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
