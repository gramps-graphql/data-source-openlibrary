import { GraphQLModel } from '@gramps/gramps-express';
import Model from '../src/model';
import Connector from '../src/connector';

// Mock the connector because we’re only testing the model here.
jest.mock('../src/connector', () =>
  jest.fn(() => ({
    get: jest.fn(() => Promise.resolve()),
    put: jest.fn(() => Promise.resolve()),
  })),
);

const DATA_SOURCE_NAME = 'OpenLibrary';

const connector = new Connector();
const model = new Model({ connector });

describe(`${DATA_SOURCE_NAME}Model`, () => {
  it('inherits the GraphQLModel class', () => {
    expect(model).toBeInstanceOf(GraphQLModel);
  });

  // TODO: Update this test to use your model’s method(s).
  describe('searchBooksByTitle()', () => {
    it('calls the correct endpoint with a given title', () => {
      const spy = jest.spyOn(connector, 'get');

      model.searchBooksByTitle('Fight Club');
      expect(spy).toHaveBeenCalledWith('/search.json?q=Fight Club');
    });

    it('throws a GrampsError if something goes wrong', async () => {
      expect.assertions(1);

      model.connector.get.mockImplementationOnce(() =>
        Promise.reject({ no: 'good' }),
      );

      try {
        await model.searchBooksByTitle('Fight Club');
      } catch (error) {
        expect(error.isBoom).toEqual(true);
      }
    });
  });

  describe('throwError()', () => {
    // TODO: Update this error to match the error format returned by your endpoint.
    const mockError = {
      statusCode: 401,
      options: {
        uri: 'https://openlibrary.org',
      },
    };

    it('converts an error from the endpoint into a GrampsError', async () => {
      expect.assertions(4);

      /*
       * To simulate a failed call, we tell Jest to return a rejected Promise
       * with our mock error.
       */
      model.connector.get.mockImplementationOnce(() =>
        Promise.reject(mockError),
      );

      try {
        await model.searchBooksByTitle('Fight Club');
      } catch (error) {
        // Check that GrampsError properly received the error detail.
        expect(error).toHaveProperty('isBoom', true);
        expect(error.output).toHaveProperty('statusCode', 401);
        expect(error.output.payload).toHaveProperty(
          'targetEndpoint',
          'https://openlibrary.org',
        );
        expect(error.output.payload).toHaveProperty(
          'graphqlModel',
          `${DATA_SOURCE_NAME}Model`,
        );
      }
    });

    it('creates a default GrampsError if no custom error data is supplied', async () => {
      try {
        await model.throwError({});
      } catch (error) {
        expect(error.output.statusCode).toBe(500);
        expect(error.output.payload.errorCode).toBe(
          `${DATA_SOURCE_NAME}Model_Error`,
        );
        expect(error.output.payload.description).toBe('Something went wrong.');
        expect(error.output.payload.graphqlModel).toBe(
          `${DATA_SOURCE_NAME}Model`,
        );
        expect(error.output.payload.targetEndpoint).toBeNull();
      }
    });
  });
});
