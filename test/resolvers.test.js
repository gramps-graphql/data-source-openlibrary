import resolvers from '../src/resolvers';
import expectMockFields from './helpers/expectMockFields';
// import expectMockList from './helpers/expectMockList';
import expectNullable from './helpers/expectNullable';

const DATA_SOURCE_NAME = 'OpenLibrary';

describe(`${DATA_SOURCE_NAME} resolvers`, () => {
  it('returns valid resolvers', () => {
    expect(Object.keys(resolvers)).toEqual([
      'queryResolvers',
      'dataResolvers',
      'mockResolvers',
    ]);
  });

  const modelResult = {
    title_suggest: 'Fight Club',
    author_name: ['Chuck Palahniuk'],
    isbn: ['9782070422401'],
  };

  describe('queryResolvers', () => {
    describe(DATA_SOURCE_NAME, () => {
      it('searches for a book by title', () => {
        expect.assertions(1);

        const req = {};

        const args = { title: 'Fight Club' };

        const mockContext = {
          OpenLibrary: {
            searchBooksByTitle: () => Promise.resolve({ docs: [modelResult] }),
          },
        };

        return expect(
          resolvers.queryResolvers.SearchBooksByTitle(req, args, mockContext),
        ).resolves.toEqual(modelResult);
      });
    });
  });

  describe('dataResolvers', () => {
    describe('OL_SearchResult', () => {
      const resolver = resolvers.dataResolvers.OL_SearchResult;
      expect(resolver.title(modelResult)).toBe('Fight Club');
      expect(resolver.author(modelResult)).toBe('Chuck Palahniuk');
      expect(resolver.isbn(modelResult)).toBe('9782070422401');
      expectNullable(resolver, ['title', 'author', 'isbn']);
    });
  });

  describe('mockResolvers', () => {
    /*
     * So, basically mock resolvers just need to return values without
     * exploding. To that end, we’ll just check that the mock response returns
     * the proper fields.
     */
    describe('OL_SearchResult', () => {
      const mockResolvers = resolvers.mockResolvers.OL_SearchResult();

      expectMockFields(mockResolvers, ['title', 'author', 'isbn']);
    });
  });
});
