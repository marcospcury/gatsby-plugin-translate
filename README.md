# Gatsby plugin translate

![NPM](https://img.shields.io/npm/v/gatsby-plugin-translate.svg)
![build](https://github.com/marcospcury/gatsby-plugin-translate/workflows/Node.js%20Package/badge.svg)

>
> Feel free to open issues for any questions or ideas
>

A complete multilingual support to your Gatsby site. Automatically creates page versions for each language you want, with custom link components, static translations and GraphQL / Google API integration, all orchestrated by React context.

A valid API key must be provided for Google automatic translation to work.

## Install

```shell
  yarn add gatsby-plugin-translate

  # OR

  npm install --save gatsby-plugin-translate
```

## How to use

A basic Gatsby config setup:

```js

// gatsby-config.js

{
  resolve: `gatsby-plugin-translate`,
  options: {
    googleApiKey: '<your_key>', // OPTIONAL: only when Google's translation are set
    sourceLanguage: 'en',
    targetLanguages: ['es', 'de'],
    translateSlug: true, // OPTIONAL: requires Google API key
  }
}

```

### Automatic page generation
All pages created by you Gatsby project will get a target language version under `/language/slug`. By default, the original slug will be used to create all versions of your pages, but you can set `translageSlug` option to `true` in order to translate the slug accordingly to the current target language.

To select between available languages use the `LanguageSelector` component. It works like a regular Gatsby `Link`, so you can put a text, image, or any html structure inside it to create your own language selector button:

```jsx

import { LanguageSelector } from 'gatsby-plugin-translate'

const MyComponent = () => {
  return (
    <>
       <LanguageSelector sourceLanguage={true}>English</LanguageSelector>
       <LanguageSelector language="es">Español</LanguageSelector>
       <LanguageSelector language="de">Deutsch</LanguageSelector>
    </>
  )
}

```

You don't have to specify a url, just the language / source language. The component will redirect you to the equivalent page of the selected language.

To keep navigating in the same language pages, use the `TranslateLink` component. It's created upon the Gatsby `Link` and accepts the same properties. You should use the original url, and it will be automatically updated when the language changes. Link text will also be automatically translated if it has a static translation available.

```jsx

import { TranslateLink } from 'gatsby-plugin-translate'

const MyComponent = () => {
  return (
    <>
       <TranslateLink to="/original-path-to-page">My link</TranslateLink>
    </>
  )
}

```

### Static translations
You should create a `translations` folder inside your project's `src` to add all of the static text used by your site. A `<language>.json` file must be provided with the desired translations, using either the original text as index or an actual index (in this case, you should create a json file for the source language also).

``` js

// src/translations/es.json

{
  "Your site title": "Título de su sítio",
  "Your page label": "Etiqueta de tu página"
}


```

Alternatively, using an index:

``` js

// src/translations/es.json

{
  "site.title": "Título de su sítio",
  "page.label": "Etiqueta de tu página"
}

// src/translations/en.json

{
  "site.title": "Your site title",
  "page.label": "Your page label"
}


```

There are two options to use the static translations: by using the `Translate` component or the `useTranslations` hook:

```jsx

import { Translate } from 'gatsby-plugin-translate'

const MyComponent = () => {
  return (
    <>
        <Translate>Your page label</Translate>
        <Translate id="page.label" />
    </>
  )
}

```

The `useTranslations` hook gives you a `t` tag function:

```jsx

import { useTranslations } from 'gatsby-plugin-translate'

const MyComponent = () => {

  const t = useTranslations()

  const myLabelText = t`Your page label`

  return (
   ...
  )
}

```

## GraphQL automatic translation
You can add GraphQL nodes to be automatically translated using Google's API:

```js

// gatsby-config.js

{
  resolve: `gatsby-plugin-translate`,
  options: {
    // ... other options

    translations: [
      {
        // the selector must match an existing graphQL node already available
        selector: 'wordpressWpPost',
        // the fields of the node you want to translate
        nodeStructure: {
          acf: {
            category: true,
            title: true,
          },
        },
      },
    ]
  }
}

```

### Node structure

You must provide the structure of what fields should be translated by setting them to 'true'. All other properties will be copied with the exactly value of the original node.

Translations will be available on a new node with the language suffix:

```js

// original graphQL node:
wordpressWpPost {
  acf {
    category
    title
    content
    tags
  }
}

// translated to spanish node (content and tags are same as the original):
wordpressWpPostEs {
  acf {
    category
    title
    content
    tags
  }
}

```

Arrays and object properties will be translated recursivelly, as long as they are set to 'true'. Arrays of objects must have the object structure set in the options. Undefined and null nodes or properties will be copied as-is to the translated structure.

To choose between the two query results you can use the `useTranslateContext` hook to check the current language of your page/component (a custom static query smart hook will be available soon):

```jsx

import { useTranslateContext } from 'gatsby-plugin-translate'

const MyComponent = () => {

  const { language } = useTranslateContext()

  return (
   ...
  )
}

```


# Feedback

This is the very first version of our plugin and any contribution is welcome :)
