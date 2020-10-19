# Gatsby plugin translate

>
> Feel free to open issues for any questions or ideas
>

You can add translations to your GraphQL nodes automatically using Google's translation API. Translations are made during node creation stage.

A valid API key must be provided in order to work.

## Install

```shell
  yarn add gatsby-plugin-translate

  # OR

  npm install --save gatsby-plugin-translate
```

## How to use

A basic setup to your gatsby-config.js:

```js
// gatsby-config.js

{
  resolve: `gatsby-plugin-translate`,
  options: {
    googleApiKey: '<your_key>',
    // Add as many translations as you want
    translations: [
      {
        // the selector must match an existing graphQL node already available
        selector: 'wordpressWpPost',
        // language codes provided by Google API
        originLanguage: 'en',
        targetLanguage: 'es',
        // the fields of the node you want to translate
        nodeStructure: {
          acf: {
            category: true,
            title: true,
          },
        },
      },
    ],
  }

```

### Node structure

You must provide the structure of what fields should be translated by setting them to 'true'. All other properties will be copied with the exactly value of the original node.

Translations will be available under the new node with the language suffix:

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

// translated to spanish node:
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

# Feedback
This is the very first version of our plugin and any contribution is welcome :)