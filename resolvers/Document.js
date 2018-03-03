'use strict';
const slugify = require('slugg');

exports.title = doc => doc.frontmatter.title;
exports.slug = doc => slugify(doc.frontmatter.title);
exports.category = doc => doc.frontmatter.category;
exports.body = doc => doc.body.trim();
