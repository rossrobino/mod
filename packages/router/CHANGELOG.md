# @robino/router

## 0.4.0

### Minor Changes

- 0405af9: update to use middleware and a `next` function to be more composable

## 0.3.0

### Minor Changes

- 2bf5ce9: fix: stop processing handlers when a `Response` is returned

## 0.2.1

### Patch Changes

- df2d554: allow access to `state` in not found handler

## 0.2.0

### Minor Changes

- bc8055b: feat: add `Router.create` - create typed handler helper function
- 2b7296b: feat: apply handlers to multiple patterns at once with type safe parameters.

  ```ts
  router.get(["/multi/:param", "/pattern/:another"], ({ param }) => {
  	param; // { param: string } | { another: string }
  });
  ```

- 5eb28ce: breaking: rename config.state to config.start

## 0.1.2

### Patch Changes

- 66dd9b6: add git links to package.json

## 0.1.1

### Patch Changes

- d35a856: clean up/performance improvements
- 3473566: better notFound and error context types

## 0.1.0

### Minor Changes

- 062846d: trie router

## 0.0.5

### Patch Changes

- f1feeb6: trailing slash only redirect on not found

## 0.0.4

### Patch Changes

- aacbce1: export types

## 0.0.3

### Patch Changes

- 4fbe14c: fix ci

## 0.0.2

### Patch Changes

- 0116860: update notFound and error types

## 0.0.1

### Patch Changes

- 466903e: create `@robino/router` package with Fetch API based HTTP router
