import { describe, expect, it } from 'vitest';
import {
  getAttributeMappingActivateGuard,
  getAttributeMappingConflictGuard,
  getAdminDisableGuard,
  getAdminUsernameConflictGuard,
  getCategoryMappingConflictGuard,
  getCustomerCodeConflictGuard,
  getCustomerUserCreateGuard,
  getCustomerUserUsernameConflictGuard,
} from './management-guards';

describe('management-side guard rules', () => {
  it('blocks customer-user creation when customer is disabled', () => {
    expect(getCustomerUserCreateGuard('enabled')).toEqual({
      allowed: true,
      reason: '',
    });
    expect(getCustomerUserCreateGuard('disabled')).toEqual({
      allowed: false,
      reason: '当前客户已停用，不能新增中台用户端用户。',
    });
  });

  it('blocks disabling the current management admin account', () => {
    expect(getAdminDisableGuard({ currentAdminUserId: 'admin-1', targetAdminUserId: 'admin-2' })).toEqual({
      allowed: true,
      reason: '',
    });
    expect(getAdminDisableGuard({ currentAdminUserId: 'admin-1', targetAdminUserId: 'admin-1' })).toEqual({
      allowed: false,
      reason: '不能停用当前登录账号。',
    });
  });

  it('blocks duplicate active category mappings globally by channel category', () => {
    expect(
      getCategoryMappingConflictGuard({
        candidateChannel: '淘宝',
        candidateChannelCategoryId: '50025966',
        mappings: [
          { channel: '淘宝', channelCategoryId: '50025966', id: 'cat-1', status: 'active' },
        ],
      }),
    ).toEqual({
      allowed: false,
      reason: '同一渠道类目已存在生效中的全局类目映射，不能重复新增 active 记录。',
    });
    expect(
      getCategoryMappingConflictGuard({
        candidateChannel: '淘宝',
        candidateChannelCategoryId: '50025966',
        mappings: [
          { channel: '拼多多', channelCategoryId: '50025966', id: 'cat-1', status: 'active' },
        ],
      }),
    ).toEqual({
      allowed: true,
      reason: '',
    });
  });

  it('blocks activating attribute mappings when the parent category mapping is inactive', () => {
    expect(getAttributeMappingActivateGuard({ parentCategoryMappingStatus: 'active', targetMappingStatus: 'active' })).toEqual({
      allowed: true,
      reason: '',
    });
    expect(getAttributeMappingActivateGuard({ parentCategoryMappingStatus: 'inactive', targetMappingStatus: 'active' })).toEqual({
      allowed: false,
      reason: '类目映射已停用，不能新增或保存 active 属性值映射。',
    });
  });

  it('blocks duplicate active attribute mappings inside the same customer and category mapping', () => {
    expect(
      getAttributeMappingConflictGuard({
        candidateChannelAttributeName: '装帧',
        candidateChannelAttributeValue: '精装',
        candidateCustomerId: 'customer-1',
        candidateMappingId: 'cat-map-1',
        mappings: [
          {
            channelAttributeName: '装帧',
            channelAttributeValue: '精装',
            customerId: 'customer-1',
            id: 'attr-1',
            mappingId: 'cat-map-1',
            status: 'active',
          },
        ],
      }),
    ).toEqual({
      allowed: false,
      reason: '同一客户和类目映射下已存在生效中的渠道属性值映射，不能重复新增 active 记录。',
    });

    expect(
      getAttributeMappingConflictGuard({
        candidateChannelAttributeName: '装帧',
        candidateChannelAttributeValue: '平装',
        candidateCustomerId: 'customer-1',
        candidateMappingId: 'cat-map-1',
        mappings: [
          {
            channelAttributeName: '装帧',
            channelAttributeValue: '精装',
            customerId: 'customer-1',
            id: 'attr-1',
            mappingId: 'cat-map-1',
            status: 'active',
          },
        ],
      }),
    ).toEqual({
      allowed: true,
      reason: '',
    });
  });

  it('blocks duplicate customer codes during customer creation or editing', () => {
    expect(
      getCustomerCodeConflictGuard({
        candidateCode: 'CUS-001',
        customers: [
          { code: 'CUS-001', id: 'customer-1' },
          { code: 'CUS-002', id: 'customer-2' },
        ],
      }),
    ).toEqual({
      allowed: false,
      reason: '客户编码已存在，不能重复创建或保存。',
    });

    expect(
      getCustomerCodeConflictGuard({
        candidateCode: 'CUS-001',
        currentCustomerId: 'customer-1',
        customers: [
          { code: 'CUS-001', id: 'customer-1' },
          { code: 'CUS-002', id: 'customer-2' },
        ],
      }),
    ).toEqual({
      allowed: true,
      reason: '',
    });
  });

  it('blocks duplicate management usernames during admin-user creation or editing', () => {
    expect(
      getAdminUsernameConflictGuard({
        candidateUsername: 'zhoujing',
        users: [
          { id: 'admin-1', username: 'zhoujing' },
          { id: 'admin-2', username: 'xutao' },
        ],
      }),
    ).toEqual({
      allowed: false,
      reason: '管理端登录账号已存在，不能重复创建或保存。',
    });

    expect(
      getAdminUsernameConflictGuard({
        candidateUsername: 'zhoujing',
        currentAdminUserId: 'admin-1',
        users: [
          { id: 'admin-1', username: 'zhoujing' },
          { id: 'admin-2', username: 'xutao' },
        ],
      }),
    ).toEqual({
      allowed: true,
      reason: '',
    });
  });

  it('blocks duplicate customer usernames only within the same customer', () => {
    expect(
      getCustomerUserUsernameConflictGuard({
        candidateCustomerId: 'customer-1',
        candidateUsername: 'zhaoyu',
        users: [
          { customerId: 'customer-1', id: 'cust-user-1', username: 'zhaoyu' },
          { customerId: 'customer-2', id: 'cust-user-2', username: 'zhaoyu' },
        ],
      }),
    ).toEqual({
      allowed: false,
      reason: '同一客户下登录账号已存在，不能重复创建或保存。',
    });

    expect(
      getCustomerUserUsernameConflictGuard({
        candidateCustomerId: 'customer-2',
        candidateUsername: 'zhaoyu',
        currentCustomerUserId: 'cust-user-2',
        users: [
          { customerId: 'customer-1', id: 'cust-user-1', username: 'zhaoyu' },
          { customerId: 'customer-2', id: 'cust-user-2', username: 'zhaoyu' },
        ],
      }),
    ).toEqual({
      allowed: true,
      reason: '',
    });
  });
});
