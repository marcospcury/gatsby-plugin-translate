const React = require('react')

const { TranslateProvider } = require('./contexts/translate-context')
const { TranslatedRoutesProvider } = require('./contexts/translated-routes-context')

exports.wrapPageElement = ({ element, props }) => {
  const translateState = {
    language: props.pageContext.language,
    isSourceLanguage: props.pageContext.isSourceLanguage,
    staticTranslations: props.pageContext.staticTranslations,
    originalPath: props.pageContext.originalPath,
    currentPath: props.pageContext.currentPath,
  }

  return <TranslateProvider translateState={translateState}>{element}</TranslateProvider>
}

exports.wrapRootElement = ({ element }) => {
  const translatedRoutes = require(`${__dirname}/translatedRoutes.json`)

  return (
    <TranslatedRoutesProvider translatedRoutes={translatedRoutes}>
      {element}
    </TranslatedRoutesProvider>
  )
}
