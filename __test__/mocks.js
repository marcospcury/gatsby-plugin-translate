const basicNodeStructure = {
  prop1: true,
}

const objectNodeStructure = {
  prop1: true,
  prop2: {
    prop2InProp2: true,
  },
}

const simpleArrayNodeStructure = {
  prop2: true,
}

const objectArrayNodeStructure = {
  prop2: {
    p1: true,
  },
}

const simpleNode = {
  prop1: 'value of prop 1',
  prop2: 'value of prop 2',
}

const objectNode = {
  prop1: 'value of prop 1',
  prop2: {
    propInProp2: 'value inside prop 2',
    prop2InProp2: 'value 2 inside prop 2',
  },
}

const simpleArrayNode = {
  prop1: 'value of prop 1',
  prop2: ['item 1', 'item 2', 'item 3'],
}

const objectArrayNode = {
  prop1: 'value of prop 1',
  prop2: [
    {
      p1: 'item 1',
      p2: 'item 2',
    },
  ],
}

const emptyArrayNode = {
  prop1: 'value of prop 1',
  prop2: [],
}

const nullNode = {
  prop1: 'value of prop 1',
  prop2: null,
}

const undefinedNode = {
  prop1: 'value of prop 1',
  prop2: undefined,
}

function createTranslation(spec) {
  return {
    selector: 'nodeSelector',
    nodeStructure: spec,
  }
}

function createBasicTranslation() {
  return createTranslation(basicNodeStructure)
}

function createObjectTranslation() {
  return createTranslation(objectNodeStructure)
}

function createSimpleArrayTranslation() {
  return createTranslation(simpleArrayNodeStructure)
}

function createObjectArrayTranslation() {
  return createTranslation(objectArrayNodeStructure)
}

function createCompleteSpec(translation) {
  return {
    sourceLanguage: 'en',
    targetLanguages: ['es'],
    googleApiKey: 'lorem',
    translations: [translation],
  }
}

function createSimpleSpec() {
  return {
    sourceLanguage: 'en',
    targetLanguages: ['es'],
  }
}

module.exports = {
  createBasicTranslation,
  createObjectTranslation,
  createSimpleArrayTranslation,
  createObjectArrayTranslation,
  createCompleteSpec,
  createSimpleSpec,
  simpleNode,
  objectNode,
  simpleArrayNode,
  objectArrayNode,
  emptyArrayNode,
  nullNode,
  undefinedNode,
}
