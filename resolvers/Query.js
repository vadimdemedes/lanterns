'use strict';
const slugify = require('slugg');

const DEFAULT_LIMIT = 10;

exports.documents = async (root, {skip, limit, category}, {store}) => {
	let docs = await store.getDocuments();
	if (category) {
		docs = docs.filter(doc => doc.frontmatter.category === category);
	}

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
