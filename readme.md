<p align="center">
	<br>
	<img width="300" src="media/logo.png" alt="Lanterns">
	<br>
	<br>
	<br>
</p>

# Lanterns [![Build Status](https://travis-ci.org/vadimdemedes/lanterns.svg?branch=master)](https://travis-ci.org/vadimdemedes/lanterns)

> Write Markdown and get a GraphQL API for querying them for free

[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/vadimdemedes/lanterns)


## Install

```
$ npm install --global lanterns
```


## Usage

Create a folder for storing your Markdown files and name it `documents`:

```bash
mkdir documents
```

Create a file and name it according to `[year]-[month]-[day]-[slug]` format, then write the contents:

```markdown
---
title: Hello World
category: News
---

This is my first post!
```

Run Lanterns:

```bash
$ lanterns
❯ Server is listening at port 3000
```

Execute GraphQL queries at `http://localhost:3000/graphql`:

```graphql
{
	query {
		documents {
			title
			slug
			category
			body
		}
	}
}
```

### Schema

#### Document

Document represents a single Markdown file in the file system.

```graphql
type Document {
	# Title extracted from frontmatter's `title`
	title: String!
	# Title converted to a slug
	slug: String!
	# Category extracted from frontmatter's `category`
	category: String
	# All frontmatter fields
	frontmatter: JSON!
	# Document body without frontmatter
	body: String!
	# Date when a document was created
	createdAt: Date!
	# Date when a document was last updated
	updatedAt: Date!
}
```

#### documents(skip: Int, limit: Int, category: String)

Query documents with optional pagination parameters `skip` and `limit`.
There's an optional `category` parameter to filter posts by their category.

Example:

```graphql
{
	query {
		documents {
			title
			slug
			category
			frontmatter
			body
			createdAt
			updatedAt
		}
	}
}
```

#### document(slug: String!)

Query a single document by its slug.

Example:

```graphql
{
	query {
		document(slug: "hello-world") {
			title
			slug
			category
			frontmatter
			body
			createdAt
			updatedAt
		}
	}
}
```

#### categories

Query all categories. This resolver scans all documents looking for `category` field
in frontmatter, removes duplicates and returns the list.


## License

MIT © [Vadim Demedes](https://github.com/vadimdemedes)
