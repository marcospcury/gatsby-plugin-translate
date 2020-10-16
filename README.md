# Gatsby plugin translate

> Feel free to open issues for any questions or ideas

You can add translations to your GraphQL nodes automatically using Google's translation API. Translations are made during node creation stage.

A valid API key must be provided in order to work.

Just add by npm or yarn:

```shell
  yarn add gatsby-plugin-translate

  // OR

  npm install --save gatsby-plugin-translate
```

## Setup

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
        // the structure of the node you want to translate
        nodeStructure: {
          acf: {
            category: true,
            title: true,
            content: false,
            tags: false,
          },
        },
      },
    ],
  }

```

### Node structure

You must provide the structure of the original node. Properties marked as 'true' will be translated, and those 'false' will just copy the original property to the new structure created, thus you can create faithful copies of your current queries that can be interchangable inside your components.

Translations will be created inside your original node, under 'fields.language', keeping the original structure:

```js
// original graphQL node:
node {
  acf {
    category
    title
    content
    tags
  }
}

// translated to spanish node:
node {
  acf {
    category
    title
    content
    tags
  }
  fields {
    es {
      acf {
        category
        title
        content
        tags
      }
    }
  }
}
```

Arrays and object properties will be translated recursivelly, as long as they are set to 'true'. Undefined and null nodes or properties will be copied as-is to the translated structure.

# Feedback
This is the very first version of our plugin and any contribution is welcome :)