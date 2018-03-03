'use strict';
const path = require('path');
const fs = require('fs');
const {makeExecutableSchema} = require('graphql-tools');
const {microGraphql} = require('apollo-server-micro');
const JSONScalar = require('graphql-type-json');
const micro = require('micro');
const Document = require('./resolvers/Document');
const Query = require('./resolvers/Query');
const DateScalar = require('./scalars/Date');
const Store = require('./lib/store');

const schemaSource = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');

const schema = makeExecutableSchema({
	typeDefs: schemaSource,
	resolvers: {
		Query,
		Document,
		Date: DateScalar,
		JSON: JSONScalar
	}
});

module.exports = documentsPath => {
	const store = new Store(documentsPath);
	const context = {store};

	return micro(microGraphql({schema, context}));
};
