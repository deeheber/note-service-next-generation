# Note Service (Next Generation)

Rewriting [note-service](https://github.com/deeheber/note-service) using CDK, TypeScript, and GraphQL

## Queries

1. List notes
```
query ListQuery {
  listNote {
    items {
      author
      content
      createdAt
      updatedAt
      id
    }
    total
  }
}
```

2. Get note by id (coming soon)

## Mutations

1. Create note
```
mutation createNote($createInput: CreateInput!) {
  createNote(note: $createInput) {
    id,
    content,
    author,
    createdAt
  }
}
```

2. Update note (coming soon)

3. Delete note (coming soon)

## Authorization

Currently it is using the default setting which is auth via API key. You can obtain the API key from the AppSync console after a successful deploy. Alternatively, you can run this command using the AWS CLI and the api id that printed out to your console after a successfuly deploy:

```
aws appsync list-api-keys --api-id <api id here>
```

This is key is good for 7 days then refreshes.

If you're using Postman or making API calls through a client make sure to set a header `x-api-key` to the value of your API key.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run deploy`  run typescript compiler then deploy to AWS via the cdk
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

 The `cdk.json` file tells the CDK Toolkit how to execute the app.
