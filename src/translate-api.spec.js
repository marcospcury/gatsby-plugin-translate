const axios = require('axios')

const { getTranslator } = require('./translate-api')

jest.mock('axios')

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

describe('translate api', () => {
  describe('getTranslator', () => {
    it('Calls Google translate api with all parameters set', async () => {
      const translate = getTranslator('source', 'target', '12345')

      axios.mockResolvedValue({
        data: {
          data: {
            translations: [{ translatedText: 'term translated' }],
          },
        },
      })

      const translated = await translate('term')

      expect(translated).toEqual('term translated')
      expect(axios).toHaveBeenCalledWith(mockedAxiosRequest)
    })
  })
})
