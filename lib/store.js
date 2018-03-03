'use strict';
const pify = require('pify'); // eslint-disable-line import/order
const path = require('path');
const fs = pify(require('fs'));
const frontmatter = require('front-matter');
const sortBy = require('sort-by');
const map = require('p-map');
const mem = require('mem');

const stripFrontmatter = (body, fm) => {
	return body.replace(`---\n${fm.frontmatter}\n---\n\n`, '');
};

class Store {
	constructor(documentsPath) {
		this.documentsPath = documentsPath;

		this.getDocuments = mem(this.getDocuments.bind(this));
	}

	async getDocuments() {
		const dir = await fs.readdir(this.documentsPath);
		const files = dir.map(file => path.join(this.documentsPath, file));

		const docs = await map(files, async filePath => {
			const [body, stat] = await Promise.all([
				fs.readFile(filePath, 'utf8'),
				fs.stat(filePath)
			]);

			const fm = frontmatter(body);

			return {
				frontmatter: fm.attributes,
				body: stripFrontmatter(body, fm),
				createdAt: stat.birthtime,
				updatedAt: stat.mtime
			};
		});

		return docs.sort(sortBy('-createdAt'));
	}
}

module.exports = Store;
