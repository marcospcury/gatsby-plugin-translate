require(`@babel/register`)({
  presets: ['@babel/preset-react'],
})

const React = require('react')

const { useTranslateContext } = require('../contexts/translate-context')

const useTranslations = () => {
  const { staticTranslations } = useTranslateContext()

  const t = strings => {
    const index = strings.raw[0]

    const translation =
      staticTranslations && staticTranslations.hasOwnProperty(index)
        ? staticTranslations[index]
        : index

    return translation
  }

  return t
}

module.exports = useTranslations
