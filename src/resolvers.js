// import { MockList } from 'graphql-tools';
import casual from 'casual';

/*
 * For more information on data source resolvers, see
 * https://ibm.biz/graphql-data-source-resolvers
 */

export default {
  // Queries (where does the data come from?)
  queryResolvers: {
    SearchBooksByTitle: (rootValue, { title }, context) =>
      new Promise((resolve, reject) => {
        context.OpenLibrary
          .searchBooksByTitle(title)
          .then(data => resolve(data.docs[0]))
          .catch(reject);
      }),
  },

  // Data fields (which data from the response goes to which field?)
  dataResolvers: {
    OL_SearchResult: {
      title: data => data.title_suggest || null,
      author: data => {
        if (data.author_name && data.author_name.length) {
          return data.author_name[0];
        }
        return null;
      },
      isbn: data => {
        if (data.isbn && data.isbn.length) {
          return data.isbn[0];
        }
        return null;
      },
    },
  },

  // Mock data (How can I get real-feeling fake data while working offline?)
  mockResolvers: {
    OL_SearchResult: () => ({
      title: casual.title,
      author: casual.name,
      isbn: casual.uuid,
    }),
  },
};
