const axios = require('axios')

async function translate(source, target, apiKey, term) {
  const translateData = JSON.stringify({
    q: term,
    source: source,
    target: target,
    format: 'text',
  })

  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`
  const translateResponse = await axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
    data: translateData,
  })

  return translateResponse.data.data.translations[0].translatedText
}

function getTranslator(source, target, apiKey) {
  return translate.bind(translate, source, target, apiKey)
}

module.exports = { getTranslator }
