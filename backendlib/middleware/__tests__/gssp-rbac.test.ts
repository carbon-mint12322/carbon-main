import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import mockAdapter from '../adapters/MockAdapter';
import { useAdapter } from '../with-auth-api';
import { withPermittedRolesGssp } from '~/backendlib/middleware/rbac';
const coreService = (context: any) => ({
  some: {
    data: {
      is: {
        provided: 'yeah',
      },
    },
  },
});

const permittedRoles = ['AGENT', 'VIEWER'];
const roleCheckWrapper = withPermittedRolesGssp(permittedRoles);
const withRolesGssp = roleCheckWrapper(coreService as any);

describe('GSSP + RBAC', () => {
  beforeEach(() => useAdapter(mockAdapter));

  it('no auth, no service', () => {});
  it('yes auth, yes service', () => {});

  it('no role, no service', () => {});

  it('yes role, yes service', () => {});
});
