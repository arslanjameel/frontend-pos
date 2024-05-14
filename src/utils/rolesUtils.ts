import { IUserType } from 'src/models/IUser'
import { UserType } from 'src/types/UserTypes'

// Currently we only have three roles
// SuperAdmin, Manager and Salesperson

const useGetAvailableRoles = (roles: IUserType[]) => {
  const {
    // ADMINISTRATOR,
    // ANALYST,
    // LOGISTICS,
    // TRIAL,
    MANAGER,
    SALESPERSON,
    SUPER_ADMIN,
  } = UserType

  // Define role hierarchy
  const roleHierarchy: { [key: number]: number[] } = {
    [SUPER_ADMIN]: [
      // ADMINISTRATOR,
      // ANALYST,
      // LOGISTICS,
      // TRIAL,
      MANAGER,
      SALESPERSON,
    ],

    // [ADMINISTRATOR]: [
    //   // ANALYST,
    //   // LOGISTICS,
    //   MANAGER,
    //   SALESPERSON,
    //   // TRIAL,
    // ],
    [MANAGER]: [
      // ANALYST,LOGISTICS, TRIAL
      SALESPERSON,
    ],

    // [ANALYST]: [LOGISTICS, SALESPERSON, TRIAL],
    // [TRIAL]: [LOGISTICS, SALESPERSON],
    // [LOGISTICS]: [SALESPERSON],
    [SALESPERSON]: [],
  }

  const getRole = (id: number) => {
    return roles.find(_r => _r.id === id)
  }

  const getRoles = (role: string) => {
    const _role = roles.find(
      _r => _r.type.toLowerCase() === role.toLowerCase(),
    )

    let res: any[] = []

    if (!_role && role === 'superadmin') {
      res = roleHierarchy[SUPER_ADMIN].map(_r =>
        getRole(_r),
      )
    } else {
      res = _role
        ? roleHierarchy[_role.id].map(_r => getRole(_r))
        : []
    }

    const filteredRes: IUserType[] = res.filter(
      (item): item is IUserType => item !== undefined,
    )

    return filteredRes
  }

  return { getRoles }
}

export default useGetAvailableRoles

export const isUserAManager = (user: any) => {
  try {
    if (Object.keys(user).includes('user_type')) {
      return (
        user.user_type === 'manager' ||
        user.user_type === UserType.MANAGER
      )
    }

    return false
  } catch (e) {
    return false
  }
}

export const isUserASalesPerson = (user: any) => {
  try {
    if (Object.keys(user).includes('user_type')) {
      return (
        user.user_type === 'salesperson' ||
        user.user_type === UserType.SALESPERSON
      )
    }

    return false
  } catch (e) {
    return false
  }
}

export const isUserAnAdmin = (user: any) => {
  try {
    if (Object.keys(user).includes('user_type')) {
      return (
        user.user_type === 'superadmin' ||
        user.user_type === UserType.SUPER_ADMIN
      )
    }

    return false
  } catch (e) {
    return false
  }
}
