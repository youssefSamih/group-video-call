## Install

- `yarn`
- `yarn husky install`
- `yarn husky add .husky/pre-commit "yarn lint-staged"`

## Env variables

create a .env file in root directory of the project with variable like this example

```
REACT_APP_APP_ID=agora-app-id
```

of course don't activate the token authentication of agora app i used just simple agora app id on test case

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn lint`

Runs eslint with --fix flag

### `yarn format`

Runs prettier with --write flag
