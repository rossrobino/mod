# @robino/md

## 3.1.1

### Patch Changes

- ffc1dc3: add jsdoc comments

## 3.1.0

### Minor Changes

- c23ed31: feat: add `renderStream` method to easily render/highlight and stream the output from an LLM on the server

  ```ts
  import { OpenAI } from "openai";

  const openai = new OpenAI({
  	apiKey: OPENAI_API_KEY,
  });

  const stream = await openai.chat.completions.create({
  	messages: [
  		{
  			role: "user",
  			content: "write some sample prose, a list, js code, table, etc.",
  		},
  	],
  	model: "gpt-4o-mini",
  	stream: true,
  });

  const mdStream = new ReadableStream<string>({
  	async start(c) {
  		for await (const chunk of stream) {
  			const content = chunk.choices[0]?.delta.content;
  			if (content) c.enqueue(content);
  		}
  		c.close();
  	},
  });

  const htmlStream = processor.renderStream(mdStream);
  ```

  The result will come in chunks of elements instead of by word since the entire element needs to be present to render and highlight correctly.

### Patch Changes

- debe3c4: qol: extend markdown to expose all of it's methods on the `Processor`

## 3.0.0

### Major Changes

- 0613189: Breaking changes

  - Renamed
    - `MarkdownProcessor` => `Processor`
    - type `MdHeading` => `Heading`
    - type `MdData` => `Result`
    - type `MarkdownProcessorOptions` => `Options`
  - Adds `<div style="overflow-x: auto;">` around each table element to prevent overflow
  - Skips highlighting if there are no `highlighter.langs` provided

  Patch changes

  - improve `getHeadings` performance

### Patch Changes

- 66dd9b6: add git links to package.json
- 0613189: update dependencies

## 2.0.0

### Major Changes

- d32d250: feat: update to use [Standard Schema](https://github.com/standard-schema/standard-schema) instead of Zod

  This enables a variety of validation libraries to be used in addition to Zod.

  BREAKING - this also requires the `process` method to now be async.

## 1.0.4

### Patch Changes

- 97a19fd: update dependencies

## 1.0.3

### Patch Changes

- f2e4111: update to shiki v2

## 1.0.2

### Patch Changes

- f8cf9e7: update dependencies
- f8cf9e7: fix: make MarkdownProcessor `options` optional

## 1.0.1

### Patch Changes

- 5477333: make zod a peer dependency since only types are used in the package, user supplies the frontmatterSchema

## 1.0.0

### Major Changes

- e28349e: v1.0.0

  - This package follows semantic versioning, so it will no longer have breaking changes on minor releases.

## 0.2.2

### Patch Changes

- 17d1a1e: update dependencies

## 0.2.1

### Patch Changes

- cf7594b: remove some langs - replace with aliases

## 0.2.0

### Minor Changes

- 47aada0: make `processMarkdown` sync

## 0.1.3

### Patch Changes

- a3ae427: remove top level await

## 0.1.2

### Patch Changes

- 5c2e681: create fine-grained bundle so it doesn't load all langs/themes

## 0.1.1

### Patch Changes

- 7aabe69: Remove site specific error message

## 0.1.0

### Minor Changes

- 5cd9507: Splits `robino` into a monorepo with separate packages.
