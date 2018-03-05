'use strict';
const slugify = require('slugg');

const DEFAULT_LIMIT = 10;

exports.documents = async (root, {skip, limit}, {store}) => {
	const docs = await store.getDocuments();

	if (typeof skip === 'number') {
		return docs.slice(skip, limit || DEFAULT_LIMIT);
	} else if (typeof limit === 'number') {
		return docs.slice(0, limit);
	}

	return docs;
};

exports.document = async (root, {slug}, {store}) => {
	const docs = await store.getDocuments();

	return docs.find(doc => slug === slugify(doc.frontmatter.title));
};

exports.categories = async (root, params, {store}) => {
	const docs = await store.getDocuments();
	const categories = docs
		.map(doc => doc.frontmatter.category)
		.filter(Boolean);

	const uniqueCategories = new Set([...categories]);

	return [...uniqueCategories];
};

exports.category = async (root, {name}, {store}) => {
	const docs = await store.getDocuments();
	return docs.filter(doc => doc.frontmatter.category === name);
};
