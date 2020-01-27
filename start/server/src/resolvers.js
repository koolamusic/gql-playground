const { paginateResults } = require('./utils');

module.exports = {
	Query: {
		// launches: (_, __, { dataSources }) => dataSources.launchAPI.getAllLaunches(),
		launch: (_, { id }, { dataSources }) => dataSources.launchAPI.getLaunchById({ launchId: id }),
		me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser(),
		launches: async (_, { pageSize = 20, after }, { dataSources }) => {
			const allLaunches = await dataSources.launchAPI.getAllLaunches();
			// we want these in reverse chronological order
			allLaunches.reverse();
			const launches = paginateResults({ after, pageSize, results: allLaunches });
			return {
				launches,
				cursor: launches.length ? launches[launches.length - 1].cursor : null,
				// if the cursor of the end of the paginated results is the same as the
				// last item in _all_ results, then there are no more results after this
				hasMore: launches.length
					? launches[launches.length - 1].cursor !== allLaunches[allLaunches.length - 1].cursor
					: false
			};
		}
	}
};

// From this, resolvers are function declarations that execute a GQL Query using functions that have been defined in a datasource.
// By default it takes in 3 parameters as arguments
