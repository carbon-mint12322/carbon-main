import { expect } from 'chai';
import { findPropertyByKeyInJsonSchema as findPropertyByKey } from '~/backendlib/util/findPropertyByKeyInJsonSchema';

import IrrigationJsonSchema from '~/gen/jsonschemas/irrigationEvent.json';

describe('findPropertyByKeyInJsonSchema', () => {
  it('should find a property by key in a simple schema', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'integer' },
      },
    };
    const keyToFind = 'age';
    const result = findPropertyByKey(schema, keyToFind);
    expect(result).to.deep.equal({ type: 'integer' });
  });

  it('should handle a property defined within a nested object', () => {
    const schema = {
      type: 'object',
      properties: {
        address: {
          type: 'object',
          properties: {
            street: { type: 'string' },
            city: { type: 'string' },
          },
        },
      },
    };
    const keyToFind = 'city';
    const result = findPropertyByKey(schema, keyToFind);
    expect(result).to.deep.equal({ type: 'string' });
  });

  it('should handle conditional properties', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        country: {
          type: 'string',
          if: { properties: { name: { type: 'string' } } },
          then: { const: 'USA' },
          else: { const: 'Unknown' },
        },
      },
    };
    const keyToFind = 'country';
    const result = findPropertyByKey(schema, keyToFind);
    expect(result).to.deep.equal({
      type: 'string',
      if: { properties: { name: { type: 'string' } } },
      then: { const: 'USA' },
      else: { const: 'Unknown' },
    });
  });

  it("should handle conditional properties with 'if' and 'then', but no 'else'", () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        country: {
          type: 'string',
          if: { properties: { name: { type: 'string' } } },
          then: { const: 'USA' },
        },
      },
    };
    const keyToFind = 'country';
    const result = findPropertyByKey(schema, keyToFind);
    expect(result).to.deep.equal({
      type: 'string',
      if: { properties: { name: { type: 'string' } } },
      then: { const: 'USA' },
    });
  });

  it("should handle conditional properties with 'if' and 'else', but no 'then'", () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        country: {
          type: 'string',
          if: { properties: { state: { type: 'string', test: 'check' } } },
          else: { const: 'Unknown' },
        },
      },
    };
    const keyToFind = 'state';
    const result = findPropertyByKey(schema, keyToFind);
    expect(result).to.deep.equal({ type: 'string', test: 'check' });
  });

  it('should find a property in a 4-level nested object', () => {
    const schema = {
      type: 'object',
      properties: {
        level1: {
          type: 'object',
          properties: {
            level2: {
              type: 'object',
              properties: {
                level3: {
                  type: 'object',
                  properties: {
                    level4: {
                      type: 'object',
                      properties: {
                        value: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
    const keyToFind = 'value';
    const result = findPropertyByKey(schema, keyToFind);
    expect(result).to.deep.equal({ type: 'string' });
  });

  it("should find a property in a 4-level deep 'ref' object", () => {
    const schema = {
      type: 'object',
      properties: {
        level1: {
          $ref: '#/definitions/level1',
        },
      },
      definitions: {
        level1: {
          type: 'object',
          properties: {
            level2: {
              $ref: '#/definitions/level2',
            },
          },
        },
        level2: {
          type: 'object',
          properties: {
            level3: {
              $ref: '#/definitions/level3',
            },
          },
        },
        level3: {
          type: 'object',
          properties: {
            level4: {
              $ref: '#/definitions/level4',
            },
          },
        },
        level4: {
          type: 'object',
          properties: {
            value: { type: 'string' },
          },
        },
      },
    };
    const keyToFind = 'value';
    const result = findPropertyByKey(schema, keyToFind);
    expect(result).to.deep.equal({ type: 'string' });
  });

  it('should return undefined if the property is not found', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
    };
    const keyToFind = 'age';
    const result = findPropertyByKey(schema, keyToFind);
    expect(result).to.be.undefined;
  });

  it('should handle empty schema', () => {
    const schema = {};
    const keyToFind = 'name';
    const result = findPropertyByKey(schema, keyToFind);
    expect(result).to.be.undefined;
  });

  it('Irrigation Json Schema: should find a property by key', () => {
    const keyToFind = 'criticalCropGrowthStage';
    const result = findPropertyByKey(IrrigationJsonSchema, keyToFind);
    expect(result).to.deep.equal({
      title: 'Irrigated in critical crop growth stages',
      type: 'string',
      enum: [
        'Panicle initiation',
        'Booting',
        'Heading',
        'Flowering',
        'Milky & dough stages',
        'Others',
        'None of the above',
      ],
      default: 'Panicle initiation',
    });
  });

  it('Irrigation Json Schema: should find a property by key in conditional', () => {
    const keyToFind = 'othercriticalCropGrowthStage';
    const result = findPropertyByKey(IrrigationJsonSchema, keyToFind);
    expect(result).to.deep.equal({
      type: 'string',
      title: 'Other critical crop growth stages observed',
    });
  });

  it('Irrigation Json Schema: should find a property by key in nested $ref', () => {
    const keyToFind = 'startDate';
    const result = findPropertyByKey(IrrigationJsonSchema, keyToFind);
    expect(result).to.deep.equal({
      type: 'string',
      format: 'date',
      title: 'Start date',
    });
  });

  it('Irrigation Json Schema: should find a property by key in conditional - nested $ref', () => {
    const keyToFind = 'reservoirIrrigationData';
    const result = findPropertyByKey(IrrigationJsonSchema, keyToFind);
    expect(result).to.deep.equal({
      $ref: '#/irrigationData',
      title: '',
    });
  });
});
