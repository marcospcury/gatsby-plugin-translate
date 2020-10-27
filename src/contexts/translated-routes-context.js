const React = require('react')

const TranslatedRoutesContext = React.createContext({})

const TranslatedRoutesProvider = ({ translatedRoutes, children }) => {
  return (
    <TranslatedRoutesContext.Provider value={translatedRoutes}>
      {children}
    </TranslatedRoutesContext.Provider>
  )
}

const useTranslatedRoutesContext = () => React.useContext(TranslatedRoutesContext)

module.exports = { TranslatedRoutesProvider, useTranslatedRoutesContext }
