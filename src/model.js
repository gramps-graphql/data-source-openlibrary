import { GraphQLModel, GrampsError } from '@gramps/gramps-express';

/*
 * For more information on data source models, see
 * https://ibm.biz/graphql-data-source-model
 */

export default class OpenLibraryModel extends GraphQLModel {
  /**
   * Search for books
   * @param  {String}  title  the title of the thing to load
   * @return {Promise}     resolves with the loaded user data
   */
  searchBooksByTitle(title) {
    return this.connector.get(`/search.json?q=${title}`).catch(res =>
      this.throwError(res, {
        description: 'Error querying OpenLibrary.',
      }),
    );
  }

  /**
   * Throws a custom GrAMPS error.
   * @param  {Object}  error            the API error
   * @param  {Object?} customErrorData  additional error data to display
   * @return {void}
   */
  throwError(error, customErrorData = {}) {
    // TODO Edit these defaults to be helpful for people using your data source.
    const defaults = {
      statusCode: error.statusCode || 500,
      errorCode: `${this.constructor.name}_Error`,
      description: error.message || 'Something went wrong.',
      targetEndpoint: error.options ? error.options.uri : null,
      graphqlModel: this.constructor.name,
      docsLink: null,
    };

    throw GrampsError({
      ...defaults,
      ...customErrorData,
    });
  }
}
