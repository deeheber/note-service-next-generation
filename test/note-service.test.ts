import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as NoteService from '../lib/note-service-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new NoteService.NoteServiceStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
