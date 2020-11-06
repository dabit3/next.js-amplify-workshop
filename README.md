# Next.js Amplify Workshop

![]()

In this workshop we'll learn how to build a full stack cloud application with Next.js, GraphQL, & [Amplify](https://docs.amplify.aws/).

### Overview

We'll start from scratch, creating a new Next.js app. We'll then, step by step, use the [Amplify CLI](https://github.com/aws-amplify/amplify-cli) to build out and configure our cloud infrastructure and then use the [Amplify JS Libraries](https://github.com/aws-amplify/amplify-js) to connect the React client application to the APIs we create using the CLI.

The app will be a blogging app with a markdown editor. When you think of many types of applications like Instagram, Twitter, or Facebook, they consist of a list of items and often the ability to drill down into a single item view. The app we will be building will be very similar to this, displaying a list of posts with images and data like the name, location, and description of the post. You will also be able to see only a view containing only a list of your own posts.

This workshop should take you anywhere between 2 to 5 hours to complete.

### Environment

Before we begin, make sure you have the following installed:

- Node.js v10.x or later
- npm v5.x or later
- git v2.14.1 or later

We will be working from a terminal using a [Bash shell](https://en.wikipedia.org/wiki/Bash_(Unix_shell)) to run Amplify CLI commands to provision infrastructure and also to run a local version of the React web app and test it in a web browser.

### Background needed / level

This workshop is intended for intermediate to advanced front end & back end developers wanting to learn more about full stack serverless development.

While some level of React and GraphQL is helpful, this workshop requires zero previous knowledge about React or GraphQL.

### Topics we'll be covering:

- GraphQL API with AWS AppSync
- Authentication
- Object (image) storage
- Authorization
- Hosting
- Deleting the resources

## Getting Started - Creating the Next.js Application

To get started, we first need to create a new React project using the [Create React App CLI](https://github.com/facebook/create-react-app).

```bash
$ npx create-next-app amplify-next
```

Now change into the new app directory & install AWS Amplify, & AWS Amplify UI React:

```bash
$ cd amplify-next
$ npm install aws-amplify @aws-amplify/ui-react
```

## Installing the CLI & Initializing a new AWS Amplify Project

### Installing the CLI

Next, we'll install the AWS Amplify CLI:

```bash
$ npm install -g @aws-amplify/cli
```

Now we need to configure the CLI with our credentials.

> If you'd like to see a video walkthrough of this configuration process, click [here](https://www.youtube.com/watch?v=fWbM5DLh25U).

```sh
$ amplify configure

- Specify the AWS Region: us-east-1 || us-west-2 || eu-central-1
- Specify the username of the new IAM user: amplify-cli-user
> In the AWS Console, click Next: Permissions, Next: Tags, Next: Review, & Create User to create the new IAM user. Then return to the command line & press Enter.
- Enter the access key of the newly created user:   
? accessKeyId: (<YOUR_ACCESS_KEY_ID>)  
? secretAccessKey: (<YOUR_SECRET_ACCESS_KEY>)
- Profile Name: amplify-cli-user
```

### Initializing A New Project

```bash
$ amplify init

- Enter a name for the project: amplifynext
- Enter a name for the environment: dev
- Choose your default editor: Visual Studio Code (or your default editor)
- Please choose the type of app that youre building: javascript
- What javascript framework are you using: react
- Source Directory Path: src
- Distribution Directory Path: build
- Build Command: npm run-script build
- Start Command: npm run-script start
- Do you want to use an AWS profile? Y
- Please choose the profile you want to use: amplify-cli-user
```

The Amplify CLI has initialized a new project & you will see a new folder: __amplify__ & a new file called `aws-exports.js` in the __src__ directory. These files hold your project configuration.

To view the status of the amplify project at any time, you can run the Amplify `status` command:

```sh
$ amplify status
```

To view the amplify project in the Amplify console at any time, run the `console` command:

```sh
$ amplify console
```

## Adding an AWS AppSync GraphQL API

To add a GraphQL API, we can use the following command:

```sh
$ amplify add api

? Please select from one of the above mentioned services: GraphQL
? Provide API name: Postagram
? Choose the default authorization type for the API: API key
? Enter a description for the API key: public
? After how many days from now the API key should expire (1-365): 365 (or your preferred expiration)
? Do you want to configure advanced settings for the GraphQL API: No
? Do you have an annotated GraphQL schema? N 
? Choose a schema template: Single object with fields
? Do you want to edit the schema now? (Y/n) Y
```

The CLI should open this GraphQL schema in your text editor.

__amplify/backend/api/Postagram/schema.graphql__

Update the schema to the following:   

```graphql
type Post @model {
  id: ID!
  name: String!
  location: String!
  description: String!
  image: String
}
```

After saving the schema, go back to the CLI and press enter.

### Deploying the API

To deploy the API, run the push command:

```
$ amplify push

? Are you sure you want to continue? Y

# You will be walked through the following questions for GraphQL code generation
? Do you want to generate code for your newly created GraphQL API? Y
? Choose the code generation language target: javascript
? Enter the file name pattern of graphql queries, mutations and subscriptions: src/graphql/**/*.js
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions? Yes
? Enter maximum statement depth [increase from default if your schema is deeply nested]: 2
```

> Alternately, you can run `amplify push -y` to answer __Yes__ to all questions.

Now the API is live and you can start interacting with it!


### Testing the API

To test it out we can use the GraphiQL editor in the AppSync dashboard. To open the AppSync dashboard, run the following command:

```sh
$ amplify console api

> Choose GraphQL
```

In the AppSync dashboard, click on __Queries__ to open the GraphiQL editor. In the editor, create a new post with the following mutation:

```graphql
mutation createPost {
  createPost(input: {
    name: "My first post"
    location: "New York"
    description: "Best burgers in NYC - Jackson Hole"
  }) {
    id
    name
    location
    description
  }
}
```

Then, query for the posts:

```graphql
query listPosts {
  listPosts {
    items {
      id
      name
      location
      description
    }
  }
}
```

### Configuring the React applicaion

Now, our API is created & we can test it out in our app!

The first thing we need to do is to configure our React application to be aware of our Amplify project. We can do this by referencing the auto-generated `aws-exports.js` file that is now in our src folder.

To configure the app, open __src/index.js__ and add the following code below the last import:

```js
import Amplify from 'aws-amplify'
import config from './aws-exports'
Amplify.configure(config)
```

Now, our app is ready to start using our AWS services.

### Interacting with the GraphQL API from our client application - Querying for data

Now that the GraphQL API is running we can begin interacting with it. The first thing we'll do is perform a query to fetch data from our API.

To do so, we need to define the query, execute the query, store the data in our state, then list the items in our UI.

The main thing to notice in this component is the API call. Take a look at this piece of code:

```js
/* Call API.graphql, passing in the query that we'd like to execute. */
const postData = await API.graphql({ query: listPosts });
```