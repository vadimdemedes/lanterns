import originalFs from 'fs';
import path from 'path';
import test from 'ava';
import graphqlGot from 'graphql-got';
import listen from 'test-listen';
import pify from 'pify';
import createServer from '..';

const fs = pify(originalFs);
const documentsPath = path.join(__dirname, 'fixtures');

test('fetch all documents', async t => {
	const server = await listen(createServer(documentsPath));
	const {body} = await graphqlGot(server, {
		query: `
			query {
				documents {
					title
					slug
					category
					frontmatter
					body
				}
			}
		`
	});

	t.deepEqual(body.documents, [
		{
			title: 'Second',
			slug: 'second',
			category: 'Announcements',
			frontmatter: {
				title: 'Second',
				category: 'Announcements'
			},
			body: 'Second body'
		},
		{
			title: 'First',
			slug: 'first',
			category: 'News',
			frontmatter: {
				title: 'First',
				category: 'News'
			},
			body: 'First body'
		}
	]);
});

test('fetch documents with limit', async t => {
	const server = await listen(createServer(documentsPath));
	const {body} = await graphqlGot(server, {
		query: `
			query {
				documents(limit: 1) {
					title
					slug
					category
					frontmatter
					body
				}
			}
		`
	});

	t.deepEqual(body.documents, [
		{
			title: 'Second',
			slug: 'second',
			category: 'Announcements',
			frontmatter: {
				title: 'Second',
				category: 'Announcements'
			},
			body: 'Second body'
		}
	]);
});

test('fetch documents with skip', async t => {
	const server = await listen(createServer(documentsPath));
	const {body} = await graphqlGot(server, {
		query: `
			query {
				documents(skip: 1) {
					title
					slug
					category
					frontmatter
					body
				}
			}
		`
	});

	t.deepEqual(body.documents, [
		{
			title: 'First',
			slug: 'first',
			category: 'News',
			frontmatter: {
				title: 'First',
				category: 'News'
			},
			body: 'First body'
		}
	]);
});

test('fail when trying to find a document without slug', async t => {
	const server = await listen(createServer(documentsPath));
	const req = graphqlGot(server, {
		query: `
			query {
				document {
					title
					slug
					category
					frontmatter
					body
				}
			}
		`
	});

	await t.throws(req);
});

test('fetch document by slug', async t => {
	const stat = await fs.stat(path.join(documentsPath, 'second.md'));

	const server = await listen(createServer(documentsPath));
	const {body} = await graphqlGot(server, {
		query: `
			query {
				document(slug: "second") {
					title
					slug
					category
					frontmatter
					body
					createdAt
					updatedAt
				}
			}
		`
	});

	t.deepEqual(body.document, {
		title: 'Second',
		slug: 'second',
		category: 'Announcements',
		frontmatter: {
			title: 'Second',
			category: 'Announcements'
		},
		body: 'Second body',
		createdAt: stat.birthtime.toISOString(),
		updatedAt: stat.mtime.toISOString()
	});
});

test('fetch categories', async t => {
	const server = await listen(createServer(documentsPath));
	const {body} = await graphqlGot(server, {
		query: `
			query {
				categories
			}
		`
	});

	t.deepEqual(body.categories, ['Announcements', 'News']);
});
