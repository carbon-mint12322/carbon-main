import { movePropertiesToRootLevel } from '~/backendlib/util/movePropertiesToRootLevel';

const assert = require('assert');

describe('movePropertiesToRootLevel', () => {
  it('should move properties inside "then" to the root level', () => {
    const schema = {
      type: 'object',
      title: 'Irrigation Event',
      properties: {
        irrigation: {
          type: 'object',
          title: 'Irrigation',
        },
      },
      allOf: [
        {
          if: {
            properties: {
              sourceOfIrrigation: {
                const: 'Others',
              },
            },
          },
          then: {
            properties: {
              otherSourceOfIrrigation: {
                type: 'string',
                title: 'Other source of irrigation',
              },
            },
          },
        },
      ],
    };

    const expectedSchema = {
      type: 'object',
      title: 'Irrigation Event',
      properties: {
        irrigation: {
          type: 'object',
          title: 'Irrigation',
        },
        otherSourceOfIrrigation: {
          type: 'string',
          title: 'Other source of irrigation',
        },
      },
    };

    const updatedSchema = movePropertiesToRootLevel(schema);
    assert.deepStrictEqual(updatedSchema, expectedSchema);
  });

  it('should move properties inside "else" to the root level', () => {
    const schema = {
      type: 'object',
      title: 'Irrigation Event',
      properties: {
        irrigation: {
          type: 'object',
          title: 'Irrigation',
        },
      },
      allOf: [
        {
          if: {
            properties: {
              sourceOfIrrigation: {
                const: 'Others',
              },
            },
          },
          else: {
            properties: {
              defaultSourceOfIrrigation: {
                type: 'string',
                title: 'Default source of irrigation',
              },
            },
          },
        },
      ],
    };

    const expectedSchema = {
      type: 'object',
      title: 'Irrigation Event',
      properties: {
        irrigation: {
          type: 'object',
          title: 'Irrigation',
        },
        defaultSourceOfIrrigation: {
          type: 'string',
          title: 'Default source of irrigation',
        },
      },
    };

    const updatedSchema = movePropertiesToRootLevel(schema);
    assert.deepStrictEqual(updatedSchema, expectedSchema);
  });

  it('should not modify the schema if "allOf" is not present', () => {
    const schema = {
      type: 'object',
      title: 'Irrigation Event',
      properties: {
        irrigation: {
          type: 'object',
          title: 'Irrigation',
        },
      },
    };

    const updatedSchema = movePropertiesToRootLevel(schema);
    assert.deepStrictEqual(updatedSchema, schema);
  });

  it('should not modify the schema if "then" and "else" are not present in "allOf"', () => {
    const schema = {
      type: 'object',
      title: 'Irrigation Event',
      properties: {
        irrigation: {
          type: 'object',
          title: 'Irrigation',
        },
      },
      allOf: [
        {
          if: {
            properties: {
              sourceOfIrrigation: {
                const: 'Others',
              },
            },
          },
        },
      ],
    };

    const updatedSchema = movePropertiesToRootLevel(schema);
    assert.deepStrictEqual(updatedSchema, schema);
  });

  it('should move properties inside "then" and "else" to the root level', () => {
    const schema = {
      type: 'object',
      title: 'Irrigation Event',
      properties: {
        irrigation: {
          type: 'object',
          title: 'Irrigation',
        },
      },
      allOf: [
        {
          if: {
            properties: {
              sourceOfIrrigation: {
                const: 'Others',
              },
            },
          },
          then: {
            properties: {
              otherSourceOfIrrigation: {
                type: 'string',
                title: 'Other source of irrigation',
              },
            },
          },
          else: {
            properties: {
              defaultSourceOfIrrigation: {
                type: 'string',
                title: 'Default source of irrigation',
              },
            },
          },
        },
      ],
    };

    const expectedSchema = {
      type: 'object',
      title: 'Irrigation Event',
      properties: {
        irrigation: {
          type: 'object',
          title: 'Irrigation',
        },
        otherSourceOfIrrigation: {
          type: 'string',
          title: 'Other source of irrigation',
        },
        defaultSourceOfIrrigation: {
          type: 'string',
          title: 'Default source of irrigation',
        },
      },
    };

    const updatedSchema = movePropertiesToRootLevel(schema);
    assert.deepStrictEqual(updatedSchema, expectedSchema);
  });

  it('should delete the "allOf" property after moving properties', () => {
    const schema = {
      type: 'object',
      title: 'Irrigation Event',
      properties: {
        irrigation: {
          type: 'object',
          title: 'Irrigation',
        },
      },
      allOf: [
        {
          if: {
            properties: {
              sourceOfIrrigation: {
                const: 'Others',
              },
            },
          },
          then: {
            properties: {
              otherSourceOfIrrigation: {
                type: 'string',
                title: 'Other source of irrigation',
              },
            },
          },
        },
      ],
    };

    const expectedSchema = {
      type: 'object',
      title: 'Irrigation Event',
      properties: {
        irrigation: {
          type: 'object',
          title: 'Irrigation',
        },
        otherSourceOfIrrigation: {
          type: 'string',
          title: 'Other source of irrigation',
        },
      },
    };

    const updatedSchema = movePropertiesToRootLevel(schema);
    assert.deepStrictEqual(updatedSchema, expectedSchema);
    assert.ok(!updatedSchema.allOf);
  });
});
