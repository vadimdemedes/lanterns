'use strict';
const pify = require('pify'); // eslint-disable-line import/order
const path = require('path');
const fs = pify(require('fs'));
const frontmatter = require('front-matter');
const moment = require('moment');
const sortBy = require('sort-by');
const map = require('p-map');
const mem = require('mem');

const getDateFromFilename = filename => {
	const [year, month, day] = filename.split('-');

	return moment()
		.date(Number(day))
		.month(Number(month))
		.year(Number(year))
		.startOf('day')
		.toDate();
};

const stripFrontmatter = (body, fm) => {
	return body.replace(`---\n${fm.frontmatter}\n---\n\n`, '');
};

const isMarkdownFile = file => {
	const ext = path.extname(file).toLowerCase();
	return ext === '.md' || ext === '.markdown';
};

class Store {
	constructor(documentsPath) {
		this.documentsPath = documentsPath;

		this.getDocuments = mem(this.getDocuments.bind(this));
	}

	async getDocuments() {
		const dir = await fs.readdir(this.documentsPath);
		const files = dir.filter(isMarkdownFile).map(file => path.join(this.documentsPath, file));

		const docs = await map(files, async filePath => {
			const filename = path.basename(filePath);
			const body = await fs.readFile(filePath, 'utf8');
			const fm = frontmatter(body);

			return {
				filename,
				frontmatter: fm.attributes,
				body: stripFrontmatter(body, fm),
				createdAt: getDateFromFilename(filename)
			};
		});

		return docs.sort(sortBy('-filename'));
	}
}

module.exports = Store;
