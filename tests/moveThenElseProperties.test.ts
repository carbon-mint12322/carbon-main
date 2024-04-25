import { moveThenElseProperties } from '~/backendlib/util/moveThenElseProperties';

const assert = require('assert');

describe('moveThenElseProperties', () => {
  it('should move both "then" and "else" properties into "properties" object when root level properties have different properties', () => {
    const jsonSchema = {
      title: '',
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      then: {
        properties: {
          age: { type: 'number' },
        },
      },
      else: {
        properties: {
          city: { type: 'string' },
        },
      },
    };

    const expectedSchema = {
      title: '',
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
        city: { type: 'string' },
      },
    };

    const modifiedSchema = moveThenElseProperties(jsonSchema);

    assert.deepStrictEqual(modifiedSchema, expectedSchema);
  });

  it('should move both "then" and "else" properties into "properties" object when root level properties have different properties', () => {
    const jsonSchema = {
      title: '',
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
        address: {
          type: 'object',
          properties: {
            city: {
              type: 'string',
            },
          },
          then: {
            properties: {
              state: { type: 'string' },
            },
          },
          else: {
            properties: {
              country: { type: 'string' },
            },
          },
        },
      },
    };

    const expectedSchema = {
      title: '',
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
        address: {
          type: 'object',
          properties: {
            city: {
              type: 'string',
            },
            state: { type: 'string' },
            country: { type: 'string' },
          },
        },
      },
    };

    const modifiedSchema = moveThenElseProperties(jsonSchema);

    assert.deepStrictEqual(modifiedSchema, expectedSchema);
  });

  it('should return input as-is when given null', () => {
    const jsonSchema = null;
    const modifiedSchema = moveThenElseProperties(jsonSchema as any);
    assert.strictEqual(modifiedSchema, null);
  });

  it('should return input as-is when given undefined', () => {
    const jsonSchema = undefined;
    const modifiedSchema = moveThenElseProperties(jsonSchema as any);
    assert.strictEqual(modifiedSchema, undefined);
  });

  it('should return input as-is when given a non-object', () => {
    const jsonSchema = 'not an object';
    const modifiedSchema = moveThenElseProperties(jsonSchema as any);
    assert.strictEqual(modifiedSchema, jsonSchema);
  });
});
