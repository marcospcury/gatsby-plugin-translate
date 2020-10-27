require(`@babel/register`)({
  presets: ['@babel/preset-react'],
})

const React = require('react')

const TranslateContext = React.createContext({})

const TranslateProvider = ({ translateState, children }) => {
  return (
    <TranslateContext.Provider value={translateState}>
      {children}
    </TranslateContext.Provider>
  )
}

const useTranslateContext = () => React.useContext(TranslateContext)

module.exports = { TranslateProvider, useTranslateContext }
