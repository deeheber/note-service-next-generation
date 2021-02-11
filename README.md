# Note Service (Next Generation)

Rewriting [note-service](https://github.com/deeheber/note-service) using CDK, TypeScript, and GraphQL. It's a CRUD app for storing notes.

## Instructions to run

### Prerequisite Setup

1. Sign up for an AWS account if you don't already have one.
2. Follow the [instructions to install and configure the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) on your computer.
3. Install [NodeJS](https://nodejs.org/en/) on your computer. I recommend v14 or above.

### Running this Application

1. Clone this repo and `npm i` in all folders that have a `package.json` (currently it's just the project root and the folders in `/src`).
2. From the root run `npm run deploy`. This will deploy the application using the `cdk` to your default AWS account/region.
3. Get the `apiId` and `apiURL` from the output in your console. You will need these values later to make requets to the API.
4. Send requests to the application using a third party client or login to the AWS AppSync console and make requests from `Queries`. I personally like to use Postman, but [here's some other suggestions](https://www.apollographql.com/blog/4-simple-ways-to-call-a-graphql-api-a6807bcdb355/) if you don't have a preferred way to send requests to an API.

### Authorization

Currently this application is using the default authorization setting which is auth via API key. You can obtain the API key by logging into the AWS AppSync console after a successful deploy. Alternatively, you can run this command using the AWS CLI and the `apiId` that printed out to your console after a successfuly deploy to obtain your key:

```
aws appsync list-api-keys --api-id <api id here>
```

This is key is good for 7 days then refreshes.

If you're using Postman or making API calls through a client make sure to set a header `x-api-key` to the value of your API key.

### Available Queries

1. List notes
```
query ListNotes {
  listNotes {
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

2. Get note by id
```
query GetNote($id: ID = "Note id goes here") {
  getNote(id: $id) {
    author
    content
    createdAt
    id
    updatedAt
  }
}
```

### Available Mutations

1. Create note
```
mutation CreateNote($author: String = "Author goes here", $content: String = "Content goes here") {
  createNote(note: {author: $author, content: $content}) {
    author
    content
    createdAt
    id
    updatedAt
  }
}
```

2. Delete note
```
mutation DeleteNote($id: ID = "ID to delete goes here") {
  deleteNote(id: $id)
}
```

3. Update note
```
mutation UpdateNote($content: String = "add note content here") {
  updateNote(content: $content, id: "add note id here") {
    updatedAt
    id
    createdAt
    content
    author
  }
}
```

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run deploy`  run typescript compiler then deploy to your default AWS account/region via the cdk
 * `npm run test`    perform the jest unit tests
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

 The `cdk.json` file tells the CDK Toolkit how to execute the app.
