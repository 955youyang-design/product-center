import type { CustomerStatus } from './data';

type Guard = {
  allowed: boolean;
  reason: string;
};

export function getCustomerUserCreateGuard(customerStatus: CustomerStatus): Guard {
  if (customerStatus === 'disabled') {
    return {
      allowed: false,
      reason: '当前客户已停用，不能新增中台用户端用户。',
    };
  }

  return {
    allowed: true,
    reason: '',
  };
}

export function getAdminDisableGuard({
  currentAdminUserId,
  targetAdminUserId,
}: {
  currentAdminUserId: string;
  targetAdminUserId: string;
}): Guard {
  if (currentAdminUserId === targetAdminUserId) {
    return {
      allowed: false,
      reason: '不能停用当前登录账号。',
    };
  }

  return {
    allowed: true,
    reason: '',
  };
}

export function getCategoryMappingConflictGuard({
  candidateChannel,
  candidateChannelCategoryId,
  currentMappingId,
  mappings,
}: {
  candidateChannel: string;
  candidateChannelCategoryId: string;
  currentMappingId?: string;
  mappings: Array<{
    channel: string;
    channelCategoryId: string;
    id: string;
    status: 'active' | 'inactive';
  }>;
}): Guard {
  const hasConflict = mappings.some((mapping) => {
    if (currentMappingId && mapping.id === currentMappingId) return false;
    return (
      mapping.status === 'active' &&
      mapping.channel === candidateChannel &&
      mapping.channelCategoryId === candidateChannelCategoryId
    );
  });

  if (hasConflict) {
    return {
      allowed: false,
      reason: '同一渠道类目已存在生效中的全局类目映射，不能重复新增 active 记录。',
    };
  }

  return {
    allowed: true,
    reason: '',
  };
}

export function getAttributeMappingActivateGuard({
  parentCategoryMappingStatus,
  targetMappingStatus,
}: {
  parentCategoryMappingStatus: 'active' | 'inactive';
  targetMappingStatus: 'active' | 'inactive';
}): Guard {
  if (parentCategoryMappingStatus === 'inactive' && targetMappingStatus === 'active') {
    return {
      allowed: false,
      reason: '类目映射已停用，不能新增或保存 active 属性值映射。',
    };
  }

  return {
    allowed: true,
    reason: '',
  };
}

export function getAttributeMappingConflictGuard({
  candidateChannelAttributeName,
  candidateChannelAttributeValue,
  candidateCustomerId,
  candidateMappingId,
  currentMappingId,
  mappings,
}: {
  candidateChannelAttributeName: string;
  candidateChannelAttributeValue: string;
  candidateCustomerId: string;
  candidateMappingId: string;
  currentMappingId?: string;
  mappings: Array<{
    channelAttributeName: string;
    channelAttributeValue: string;
    customerId: string;
    id: string;
    mappingId: string;
    status: 'active' | 'inactive';
  }>;
}): Guard {
  const hasConflict = mappings.some((mapping) => {
    if (currentMappingId && mapping.id === currentMappingId) return false;
    return (
      mapping.status === 'active' &&
      mapping.customerId === candidateCustomerId &&
      mapping.mappingId === candidateMappingId &&
      mapping.channelAttributeName === candidateChannelAttributeName &&
      mapping.channelAttributeValue === candidateChannelAttributeValue
    );
  });

  if (hasConflict) {
    return {
      allowed: false,
      reason: '同一客户和类目映射下已存在生效中的渠道属性值映射，不能重复新增 active 记录。',
    };
  }

  return {
    allowed: true,
    reason: '',
  };
}

export function getCustomerCodeConflictGuard({
  candidateCode,
  currentCustomerId,
  customers,
}: {
  candidateCode: string;
  currentCustomerId?: string;
  customers: Array<{
    code: string;
    id: string;
  }>;
}): Guard {
  const normalizedCode = candidateCode.trim().toLowerCase();
  const hasConflict = customers.some((customer) => {
    if (currentCustomerId && customer.id === currentCustomerId) return false;
    return customer.code.trim().toLowerCase() === normalizedCode;
  });

  if (hasConflict) {
    return {
      allowed: false,
      reason: '客户编码已存在，不能重复创建或保存。',
    };
  }

  return {
    allowed: true,
    reason: '',
  };
}

export function getCustomerUserUsernameConflictGuard({
  candidateCustomerId,
  candidateUsername,
  currentCustomerUserId,
  users,
}: {
  candidateCustomerId: string;
  candidateUsername: string;
  currentCustomerUserId?: string;
  users: Array<{
    customerId: string;
    id: string;
    username: string;
  }>;
}): Guard {
  const normalizedUsername = candidateUsername.trim().toLowerCase();
  const hasConflict = users.some((user) => {
    if (currentCustomerUserId && user.id === currentCustomerUserId) return false;
    return user.customerId === candidateCustomerId && user.username.trim().toLowerCase() === normalizedUsername;
  });

  if (hasConflict) {
    return {
      allowed: false,
      reason: '同一客户下登录账号已存在，不能重复创建或保存。',
    };
  }

  return {
    allowed: true,
    reason: '',
  };
}

export function getAdminUsernameConflictGuard({
  candidateUsername,
  currentAdminUserId,
  users,
}: {
  candidateUsername: string;
  currentAdminUserId?: string;
  users: Array<{
    id: string;
    username: string;
  }>;
}): Guard {
  const normalizedUsername = candidateUsername.trim().toLowerCase();
  const hasConflict = users.some((user) => {
    if (currentAdminUserId && user.id === currentAdminUserId) return false;
    return user.username.trim().toLowerCase() === normalizedUsername;
  });

  if (hasConflict) {
    return {
      allowed: false,
      reason: '管理端登录账号已存在，不能重复创建或保存。',
    };
  }

  return {
    allowed: true,
    reason: '',
  };
}
