const Translate = require('./src/components/translate')
const TranslateLink = require('./src/components/translate-link')
const LanguageSelector = require('./src/components/language-selector')
const useTranslations = require('./src/hooks/useTranslations')
const { useTranslateContext } = require('./src/contexts/translate-context')

module.exports = {
  Translate,
  useTranslations,
  TranslateLink,
  useTranslateContext,
  LanguageSelector,
}
