const Translate = require('./components/translate')
const TranslateLink = require('./components/translate-link')
const LanguageSelector = require('./components/language-selector')
const useTranslations = require('./hooks/useTranslations')
const { useTranslateContext } = require('./contexts/translate-context')

module.exports = {
  Translate,
  useTranslations,
  TranslateLink,
  useTranslateContext,
  LanguageSelector,
}
