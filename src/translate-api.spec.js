const axios = require('axios')

const { getTranslator } = require('./translate-api')

const mockedAxiosRequest = {
  method: 'post',
  url: 'https://translation.googleapis.com/language/translate/v2?key=12345',
  headers: {
    'Content-Type': 'application/json',
  },
  data: JSON.stringify({
    q: 'term',
    source: 'source',
    target: 'target',
    format: 'text',
  }),
}

const hash = '1dc030de5dfd562a554c7665b331ba54'

describe('translate api', () => {
  describe('getTranslator', () => {
    beforeEach(() => {
      axios.mockClear()
      axios.mockResolvedValue({
        data: {
          data: {
            translations: [{ translatedText: 'term translated' }],
          },
        },
      })
    })

    it('Calls Google translate api with all parameters set', async () => {
      const translate = getTranslator(undefined, 'source', 'target', '12345')

      const translated = await translate('term')

      expect(translated).toEqual('term translated')
      expect(axios).toHaveBeenCalledWith(mockedAxiosRequest)
    })

    it('Calls cache resolver without cached data', async () => {
      const get = jest.fn()
      const set = jest.fn()

      const translate = getTranslator({ get, set }, 'source', 'target', '12345')
      const translated = await translate('term')

      expect(translated).toEqual('term translated')
      expect(get).toHaveBeenCalledWith(hash)
      expect(set).toHaveBeenCalledWith(hash, 'term translated')
    })

    it('Calls cache resolver with cached data', async () => {
      const get = jest.fn(() => 'term cached')
      const set = jest.fn()

      const translate = getTranslator({ get, set }, 'source', 'target', '12345')
      const translated = await translate('term')

      expect(translated).toEqual('term cached')
      expect(get).toHaveBeenCalledWith(hash)
      expect(set).not.toHaveBeenCalled()
      expect(axios).not.toHaveBeenCalled()
    })
  })
})
