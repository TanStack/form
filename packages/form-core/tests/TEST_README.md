The test structure is as follows:

|--FieldApi
|--FormApi
|--Regressions
|{granular util tests}
|test-setup

The naming scheme follows:

{fileName}.test.ts
// for testing individual parts of utils and functionality, good for separate logic that is compartmentalized and abstracted away from the public api.

{fileName}.spec.ts
// for testing the api contract, the intentions is to test what the user expects and interacts with when using the api.

{fileName}.regressions.ts
// a file specifically for regressions, all test here belong to specific raised issues and must contain a link to the issue or pr.
