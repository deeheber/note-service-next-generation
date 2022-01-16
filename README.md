# Note Service (Next Generation)

*Note*: this branch corresponds with the demo in [this blog post](https://www.danielleheberling.xyz/blog/appsync-cdk/). For the most update to date code check out the [main branch](https://github.com/deeheber/note-service-next-generation).

Rewriting [note-service](https://github.com/deeheber/note-service) using CDK, TypeScript, and GraphQL. It's a CRUD app for storing notes.

## Getting Started

### Prerequisite Setup

1. Sign up for an [AWS account](https://aws.amazon.com/console/).
2. Follow the [instructions to install and configure the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) on your computer.
3. [Bootstrap](https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html) your AWS account ("environment") with the CDK.
3. Install [NodeJS](https://nodejs.org/en/) on your computer. We recommend version 14 or above.

### Run the Application

1. Clone this repo and run `npm install` from the project root.
2. From the project root run `npm run deploy`. This will deploy this application using the `cdk` to your bootstrapped AWS account/region.
3. Get the `apiId` and `apiURL` from the output in your console. You will need these values later to make requets to the API.
4. Send requests to the application using a third party client or login to the AWS AppSync console and make requests from `Queries`. I personally like to use Postman, but [here's some other suggestions](https://www.apollographql.com/blog/graphql/examples/4-simple-ways-to-call-a-graphql-api/) if you don't have a preferred way to send requests to an API.

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

 * `npm run build`      compile typescript to js
 * `npm run watch`      watch for changes and compile
 * `npm run deploy`     run typescript compiler then deploy to your default AWS account/region via the cdk
 * `npm install`        installs all dependencies including the `postinstall` script
 * `npm run test`       perform the jest unit tests
 * `npm run cdk diff`   compare deployed stack with current state
 * `npm run cdk synth`  emits the synthesized CloudFormation template

 The `cdk.json` file tells the CDK Toolkit how to execute the app.

 ## Contributing
 See [CONTRIBUTING.md](https://github.com/deeheber/note-service-next-generation/blob/main/CONTRIBUTING.md) for more info on our guildelines.
