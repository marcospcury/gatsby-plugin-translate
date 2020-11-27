const axios = require('axios')
const crypto = require('crypto')
const Agent = require('agentkeepalive')

const keepAliveAgent = new Agent({
  maxSockets: 100,
  maxFreeSockets: 10,
  timeout: 60000,
  freeSocketTimeout: 30000,
})

const axiosInstance = axios.create({ httpAgent: keepAliveAgent })

const MAX_REQUESTS_COUNT = 20
const INTERVAL_MS = 10
let PENDING_REQUESTS = 0

axiosInstance.interceptors.request.use(function (config) {
  return new Promise((resolve, reject) => {
    let interval = setInterval(() => {
      if (PENDING_REQUESTS < MAX_REQUESTS_COUNT) {
        PENDING_REQUESTS++
        clearInterval(interval)
        resolve(config)
      }
    }, INTERVAL_MS)
  })
})

axiosInstance.interceptors.response.use(
  function (response) {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1)
    return Promise.resolve(response)
  },
  function (error) {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1)
    return Promise.reject(error)
  }
)

async function googleTranslate(source, target, apiKey, term) {
  const translateData = JSON.stringify({
    q: term,
    source: source,
    target: target,
    format: 'text',
  })

  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`
  const translateResponse = await axiosInstance({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
    data: translateData,
  })

  return translateResponse.data.data.translations[0].translatedText
}

function getTranslator(cacheResolver, source, target, apiKey) {
  return translate.bind(translate, cacheResolver, source, target, apiKey)
}

async function translate(cacheResolver, source, target, apiKey, term) {
  if (term === null || typeof term === 'undefined') return undefined
  
  if (cacheResolver) {
    const hash = createCacheHash(source, target, term)

    let translation = await cacheResolver.get(hash)

    if (translation) return translation

    translation = await googleTranslate(source, target, apiKey, term)

    await cacheResolver.set(hash, translation)

    return translation
  }

  return await googleTranslate(source, target, apiKey, term)
}

function createCacheHash(source, target, term) {
  return crypto.createHash(`md5`).update(`${source}_${target}_${term}`).digest(`hex`)
}

module.exports = { getTranslator }
