require(`@babel/register`)({
  presets: ['@babel/preset-react'],
})

const React = require('react')

const { useTranslateContext } = require('../contexts/translate-context')

const Translate = ({ id, children }) => {
  const { staticTranslations } = useTranslateContext()
  const index = id ? id : children

  const translation =
    staticTranslations && staticTranslations.hasOwnProperty(index)
      ? staticTranslations[index]
      : children

  return <>{translation}</>
}

module.exports = Translate
