# Movie upload

## Repo Summary:

In the repository you can find the api responsible for uploading and playing videos for the **Movie upload** project.\
It is done using Express.js and it is using the Cloudinary CDN.\

## Get Started:
To get started:
- run **npm install**\
- create an `.env` file with the following content:\
  ```bash
  CLOUDINARY_CLOUD_NAME=
  CLOUDINARY_API_KEY=
  CLOUDINARY_API_SECRET=
  MONGODB_USERNAME=
  MONGODB_USER_PASSWORD=
  ```
- run **npm run dev**\
- to get more info about the api check the project documentation: https://github.com/andrei-filip912/movie-upload-documentation/blob/main/Project%20Plan%20%2B%20Architectural%20choices.docx\


## Available Scripts

In the project directory besides the basic commands, you can run:

### `npm run test`

Launches the test runner in the interactive watch mode. Any change made to the files will rerun the tests.\

### `npm run ciTest`
Launches the test runner in ci mode. It closes after running all the tests.

See the jest [documentation](https://jestjs.io/ro/docs/getting-started), for more information.


## Badge

[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)



## License

Movie upload is  [MIT licensed](https://github.com/andrei-filip912/upload/blob/main/LICENSE).
