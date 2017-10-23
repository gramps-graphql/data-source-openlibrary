import { GraphQLConnector } from '@gramps/gramps-express';
import Connector from '../src/connector';

const DATA_SOURCE_NAME = 'openlibrary';
const connector = new Connector();

describe(`${DATA_SOURCE_NAME}Connector`, () => {
  it('inherits the GraphQLConnector class', () => {
    expect(connector).toBeInstanceOf(GraphQLConnector);
  });

  it('uses the appropriate URL', () => {
    expect(connector.apiBaseUri).toBe(`https://openlibrary.org`);
  });
});
