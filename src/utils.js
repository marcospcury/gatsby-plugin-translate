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

const then = f => p => p.then(f)

const apply = f => firstArg => f(firstArg)

const exec = f => f()

const all = async promiseArray => await Promise.all(promiseArray)

const pipe = (...fns) => value => fns.reduce((previousValue, fn) => fn(previousValue), value)

module.exports = { log, clearSlugSlashes, then, all, apply, pipe, exec }
