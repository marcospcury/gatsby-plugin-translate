require(`@babel/register`)({
  presets: ['@babel/preset-react'],
})

const React = require('react')
const { Link } = require('gatsby')

const { useTranslatedRoutesContext } = require('../contexts/translated-routes-context')
const { useTranslateContext } = require('../contexts/translate-context')

const Translate = require('./translate')

const { clearSlugSlashes } = require('../utils')

const TranslateLink = props => {
  const translatedRoutes = useTranslatedRoutesContext()
  const { language, isSourceLanguage } = useTranslateContext()

  const { to: originalRoute, ...rest } = props

  const translatedRoute = translatedRoutes.find(
    route =>
      route.originalPath === clearSlugSlashes(originalRoute) &&
      route.language === language
  )

  const currentRoute = isSourceLanguage ? originalRoute : translatedRoute.translatedPath

  return (
    <Link to={currentRoute} {...rest}>
      <Translate>{rest.children}</Translate>
    </Link>
  )
}

module.exports = TranslateLink
