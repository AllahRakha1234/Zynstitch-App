import { apiClient, getErrorMessage } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { mockProfile, mockUsers } from '@/api/mock/data';
import { mockDelay } from '@/api/mock/delay';
import { env } from '@/config/env';
import type { ServiceResponse } from '@/types/serviceResponse.types';
import type {
  IUser,
  IUserFormValues,
  IUserProfile,
  UpdateProfilePayload,
  UserResponse,
} from '@/types/users.types';

export async function fetchAllAdminUsers(
  page = 0,
  limit = 20,
  filters?: Record<string, string>,
): Promise<UserResponse<{ users: IUser[]; total: number }>> {
  if (env.useMockApi) {
    await mockDelay();
    const search = filters?.search?.toLowerCase().trim();
    let users = [...mockUsers];
    if (search) {
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          u.companyName?.toLowerCase().includes(search),
      );
    }
    const total = users.length;
    const sliced = limit > 0 ? users.slice(page * limit, page * limit + limit) : users;
    return {
      success: true,
      data: { users: sliced, total },
      message: 'serviceMessages.fetchSuccess',
    };
  }

  try {
    const { data } = await apiClient.get<UserResponse<{ users: IUser[]; total: number }>>(
      endpoints.users.list,
      { params: { page, limit, ...filters } },
    );
    return data;
  } catch (error) {
    return {
      success: false,
      data: { users: [], total: 0 },
      message: getErrorMessage(error, 'serviceMessages.fetchFail'),
    };
  }
}

export async function saveAdminUser(
  user: IUserFormValues & { _id?: string },
): Promise<UserResponse<IUser>> {
  if (env.useMockApi) {
    await mockDelay();
    const now = new Date().toISOString();
    if (user._id) {
      const index = mockUsers.findIndex((u) => u._id === user._id);
      if (index >= 0) {
        mockUsers[index] = {
          ...mockUsers[index],
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          companyName: user.companyName,
          updatedAt: now,
        };
        return {
          success: true,
          data: mockUsers[index],
          message: 'serviceMessages.updateSuccess',
        };
      }
    }
    const created: IUser = {
      _id: `user-${Date.now()}`,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      companyName: user.companyName,
      createdAt: now,
      updatedAt: now,
    };
    mockUsers.unshift(created);
    return {
      success: true,
      data: created,
      message: 'serviceMessages.createSuccess',
    };
  }

  try {
    const { data } = await apiClient.post<UserResponse<IUser>>(endpoints.users.list, user);
    return data;
  } catch (error) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, 'serviceMessages.saveFail'),
    };
  }
}

export async function deleteAdminUser(id: string): Promise<UserResponse<null>> {
  if (env.useMockApi) {
    await mockDelay();
    const index = mockUsers.findIndex((u) => u._id === id);
    if (index >= 0) mockUsers.splice(index, 1);
    return { success: true, data: null, message: 'serviceMessages.deleteSuccess' };
  }

  try {
    const { data } = await apiClient.delete<UserResponse<null>>(endpoints.users.detail(id));
    return data;
  } catch (error) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, 'serviceMessages.deleteFail'),
    };
  }
}

export async function updateUserProfile(
  userId: string,
  payload: UpdateProfilePayload,
): Promise<ServiceResponse<IUserProfile>> {
  if (env.useMockApi) {
    await mockDelay();
    Object.assign(mockProfile, payload);
    const index = mockUsers.findIndex((u) => u._id === userId);
    if (index >= 0) {
      mockUsers[index] = {
        ...mockUsers[index],
        ...payload,
        updatedAt: new Date().toISOString(),
      };
    }
    return {
      success: true,
      message: 'profile.updateSuccess',
      data: { ...mockProfile },
    };
  }

  try {
    const { data } = await apiClient.put<ServiceResponse<IUserProfile>>(
      endpoints.users.profile,
      { userId, ...payload },
    );
    return data;
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, 'profile.updateError'),
      data: null,
    };
  }
}
