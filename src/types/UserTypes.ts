export const UserType = {
  SUPER_ADMIN: 1,

  // ADMINISTRATOR: 3,
  MANAGER: 2,

  // ANALYST: 4,
  // TRIAL: 5,
  // LOGISTICS: 6,
  SALESPERSON: 7,
} as const

export type IUserType =
  (typeof UserType)[keyof typeof UserType]
