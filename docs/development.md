# Development Scripts

The `package.json` file contains various scripts that can be used during project development. Below are the most important ones:

## Running in Development Mode

To run the project in development mode, you can use the following commands:

- `npm run start:init` or `yarn start:init` - runs the initialization script in watch mode
- `npm run start:update` or `yarn start:update` - runs the update script in watch mode
- `npm run start:build` or `yarn start:build` - runs the build script in watch mode
- `npm run start:template` or `yarn start:template` - runs the template preparation script in watch mode

All of the above commands use `cross-env` to set the `SDEBUG=true` environment variable and `tsx watch` to run TypeScript scripts in watch mode.

### Debug Mode (SDEBUG)

When the `SDEBUG` environment variable is set to `true`, the project fetches default argument values from the `src/feature/args/const.ts` file. Here's the data that can be edited in debug mode:

- `isDebug`: set to 'true'
- `projectCatalog`: path to the project directory (default './mock/mockProject')
- `remoteRepository`: URL to the remote repository with the template map
- `sumCatalog`: path to the .sum directory (default './mock/mockProject/.sum')

For templates:

- `projectCatalog`: path to the template directory (default './')

You can adjust these values in the `const.ts` file to facilitate testing and debugging.

## Building the Project

- `npm run build` or `yarn build` - cleans the `lib/` directory and builds the project using Rollup
- `npm run build:prod` or `yarn build:prod` - cleans the `lib/` directory and builds the project in production version

## Linting and Formatting Code

- `npm run lint` or `yarn lint` - runs the linter and formatter for the entire project
- `npm run lint:fix` or `yarn lint:fix` - automatically fixes formatting and linting issues

## Testing

- `npm run test:check` or `yarn test:check` - runs tests with code coverage
- `npm run test:watch` or `yarn test:watch` - runs tests in watch mode

Remember that before running development scripts, you should install all project dependencies using the `npm install` or `yarn install` command.
