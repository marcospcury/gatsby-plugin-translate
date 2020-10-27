require(`@babel/register`)({
  presets: ['@babel/preset-react'],
})

const React = require('react')
const { Link } = require('gatsby')

const { useTranslatedRoutesContext } = require('../contexts/translated-routes-context')
const { useTranslateContext } = require('../contexts/translate-context')

const { clearSlugSlashes } = require('../utils')

const LanguageSelector = props => {
  const translatedRoutes = useTranslatedRoutesContext()
  const { language, isSourceLanguage, originalPath, currentPath } = useTranslateContext()

  if ((props.sourceLanguage && isSourceLanguage) || props.language === language) {
    return <Link {...props}>{props.children}</Link>
  }

  let translatedRoute

  if (props.language && currentPath) {
    translatedRoute = translatedRoutes.find(
      route =>
        route.originalPath === clearSlugSlashes(currentPath) &&
        route.language === props.language
    )
  }

  const newPath =
    isSourceLanguage && translatedRoute ? translatedRoute.translatedPath : originalPath

  return (
    <Link to={newPath} {...props}>
      {props.children}
    </Link>
  )
}

module.exports = LanguageSelector
