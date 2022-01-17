import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import { App } from 'aws-cdk-lib';

import * as NoteService from '../lib/note-service-stack';

// TODO actually write tests
// https://github.com/deeheber/note-service-next-generation/issues/6
test('Empty Stack', () => {
    const app = new App();
    // WHEN
    const stack = new NoteService.NoteServiceStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
