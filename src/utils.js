function log(message, type = 'info') {
  const colors = {
    info: '\x1b[34m%s\x1b[0m',
    warn: '\x1b[33m%s\x1b[0m',
    error: '\x1b[41m%s\x1b[0m',
  }
  console.log(colors[type], type, ' [gatsby-plugin-translate] ', message)
}

function clearSlugSlashes(slug) {
  let cleanSlug

  if (slug && slug[0] === '/') {
    cleanSlug = slug.slice(1)
  }

  if (cleanSlug && cleanSlug[cleanSlug.length - 1] === '/') {
    cleanSlug = cleanSlug.slice(0, -1)
  }

  return cleanSlug
}

module.exports = { log, clearSlugSlashes }
