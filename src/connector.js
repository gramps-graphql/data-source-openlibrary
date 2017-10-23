import { GraphQLConnector } from '@gramps/gramps-express';

export default class OpenLibraryConnector extends GraphQLConnector {
  /**
   * Open Library URL
   * @member {string}
   */
  apiBaseUri = `https://openlibrary.org`;
}
