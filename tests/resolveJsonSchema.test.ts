const assert = require('assert');

import { resolveJsonSchema } from '~/backendlib/util/resolveJsonSchema';

describe('resolveJsonSchema', () => {
  it('should resolve simple $ref property', () => {
    const schema = {
      type: 'object',
      properties: {
        person: {
          $ref: '#/definitions/personSchema',
        },
      },
      definitions: {
        personSchema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'number' },
          },
        },
      },
    };

    const resolvedSchema = resolveJsonSchema(schema);

    assert.deepStrictEqual(resolvedSchema, {
      type: 'object',
      properties: {
        person: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'number' },
          },
        },
      },
      definitions: {
        personSchema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'number' },
          },
        },
      },
    });
  });

  it('should resolve nested $ref properties', () => {
    const schema = {
      type: 'object',
      properties: {
        person: {
          $ref: '#/definitions/personSchema',
        },
        address: {
          $ref: '#/definitions/addressSchema',
        },
      },
      definitions: {
        personSchema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'number' },
          },
        },
        addressSchema: {
          type: 'object',
          properties: {
            street: { type: 'string' },
            city: { type: 'string' },
          },
        },
      },
    };

    const resolvedSchema = resolveJsonSchema(schema);
    assert.deepStrictEqual(resolvedSchema, {
      type: 'object',
      properties: {
        person: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'number' },
          },
        },
        address: {
          type: 'object',
          properties: {
            street: { type: 'string' },
            city: { type: 'string' },
          },
        },
      },
      definitions: {
        personSchema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'number' },
          },
        },
        addressSchema: {
          type: 'object',
          properties: {
            street: { type: 'string' },
            city: { type: 'string' },
          },
        },
      },
    });
  });

  it('should throw an error for missing referenced schema', () => {
    const schema = {
      type: 'object',
      properties: {
        person: {
          $ref: '#/definitions/personSchema',
        },
      },
      definitions: {},
    };

    assert.throws(() => {
      resolveJsonSchema(schema);
    }, Error);
  });

  it('should resolve $ref at root level', () => {
    const schema = {
      $ref: '#/definitions/personSchema',
      definitions: {
        personSchema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'number' },
          },
        },
      },
    };

    const resolvedSchema = resolveJsonSchema(schema);
    assert.deepStrictEqual(resolvedSchema, {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
      },
    });
  });

  it('should resolve $ref & definition at root level', () => {
    const schema = {
      $ref: '#/personSchema',
      personSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
        },
      },
      definitions: {},
    };

    const resolvedSchema = resolveJsonSchema(schema);

    assert.deepStrictEqual(resolvedSchema, {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
      },
    });
  });
});
