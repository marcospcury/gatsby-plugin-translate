const {
  createBasicTranslation,
  createObjectTranslation,
  createSimpleArrayTranslation,
  createObjectArrayTranslation,
  simpleNode,
  objectNode,
  simpleArrayNode,
  objectArrayNode,
  emptyArrayNode,
  nullNode,
  undefinedNode,
} = require('../__test__/mocks')

jest.mock('./translate-api', () => {
  const getTranslator = () => jest.fn(term => term.toUpperCase())
  return { getTranslator }
})

const { translateNode, translateSlug } = require('./translation')

describe('translation functions', () => {
  describe('translateNode', () => {
    it('Translate a simple node', async () => {
      const spec = createBasicTranslation()
      const translated = await translateNode(spec, simpleNode)

      expect(translated.prop1).toEqual('VALUE OF PROP 1')
      expect(translated.prop2).toEqual('value of prop 2')
    })

    it('Translate an object node', async () => {
      const spec = createObjectTranslation()
      const translated = await translateNode(spec, objectNode)

      expect(translated.prop1).toEqual('VALUE OF PROP 1')
      expect(translated.prop2.propInProp2).toEqual('value inside prop 2')
      expect(translated.prop2.prop2InProp2).toEqual('VALUE 2 INSIDE PROP 2')
    })

    it('Translate a simple array node', async () => {
      const spec = createSimpleArrayTranslation()
      const translated = await translateNode(spec, simpleArrayNode)

      expect(translated.prop1).toEqual('value of prop 1')
      expect(translated.prop2[0]).toEqual('ITEM 1')
      expect(translated.prop2[1]).toEqual('ITEM 2')
      expect(translated.prop2[2]).toEqual('ITEM 3')
    })

    it('Translate a object array node', async () => {
      const spec = createObjectArrayTranslation()
      const translated = await translateNode(spec, objectArrayNode)

      expect(translated.prop1).toEqual('value of prop 1')
      expect(translated.prop2[0].p1).toEqual('ITEM 1')
      expect(translated.prop2[0].p2).toEqual('item 2')
    })

    it('Expect a node with an empty array', async () => {
      const spec = createSimpleArrayTranslation()
      const translated = await translateNode(spec, emptyArrayNode)

      expect(translated.prop1).toEqual('value of prop 1')
      expect(translated.prop2.length).toEqual(0)
    })

    it('Expect a node with a null property', async () => {
      const spec = createBasicTranslation()
      const translated = await translateNode(spec, nullNode)

      expect(translated.prop1).toEqual('VALUE OF PROP 1')
      expect(translated.prop2).toBeNull()
    })

    it('Expect a node with an undefined property', async () => {
      const spec = createBasicTranslation()
      const translated = await translateNode(spec, undefinedNode)

      expect(translated.prop1).toEqual('VALUE OF PROP 1')
      expect(translated.prop2).not.toBeDefined()
    })

    it('Expect a null node', async () => {
      const spec = createBasicTranslation()
      const translated = await translateNode(spec, null)

      expect(translated).toBeNull()
    })

    it('Expect an undefined node', async () => {
      const spec = createBasicTranslation()
      const translated = await translateNode(spec, undefined)

      expect(translated).not.toBeDefined()
    })
  })

  describe('translateSlug', () => {
    it('Translate a given slug', async () => {
      const slug = await translateSlug({}, '', 'en', 'es', '/path-to-page')

      expect(slug).toEqual('/PATH-TO-PAGE')
    })

    it('Translate a slug with a trail slash', async () => {
      const slug = await translateSlug({}, '', 'en', 'es', '/path-to-page/')

      expect(slug).toEqual('/PATH-TO-PAGE')
    })

    it('Translate a slug with a blank space', async () => {
      const slug = await translateSlug({}, '', 'en', 'es', '/path-to-page /')

      expect(slug).toEqual('/PATH-TO-PAGE')
    })

    it('Translate a slug with two elements', async () => {
      const slug = await translateSlug({}, '', 'en', 'es', '/path-to-page /sub-path')

      expect(slug).toEqual('/PATH-TO-PAGE/SUB-PATH')
    })

    it('Translate a slug with three elements', async () => {
      const slug = await translateSlug({}, '', 'en', 'es', '/path-to-page /sub-path/ another-sub')

      expect(slug).toEqual('/PATH-TO-PAGE/SUB-PATH/ANOTHER-SUB')
    })
  })
})
