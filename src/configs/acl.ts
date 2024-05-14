import { AbilityBuilder, Ability } from '@casl/ability'

export type Subjects = string
export type Actions =
  | 'manage'
  | 'create'
  | 'read'
  | 'update'
  | 'delete'

export type AppAbility =
  | Ability<[Actions, Subjects]>
  | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Actions
  subject: string
}

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defineRulesFor = (role: string, subject: string) => {
  const { can, cannot, rules } = new AbilityBuilder(
    AppAbility,
  )

  if (role === 'admin' || role === 'superadmin') {
    /**
     * What an admin or superadmin can and cannot do
     *
     */
    can('manage', 'all')

    /**
     */
  } else if (role === 'manager') {
    /**
     * What a manager can and cannot do
     *
     */
    can(['read'], 'pages-section')
    can(['read', 'create', 'update'], 'customer')
    can(['read'], 'customer-monthly')
    can(['read', 'create', 'update'], 'product')

    can(['read'], 'sales-section')

    can(['read', 'create', 'update'], 'invoice')
    can(['read', 'create', 'update', 'delete'], 'quote')
    can(['read', 'create', 'update', 'delete'], 'order')
    can(['read', 'create', 'update'], 'receipt')
    can(
      ['read', 'create', 'update', 'delete'],
      'credit-note',
    )

    can('read', 'products-section')
    can('manage', 'merge-products')
    can(['read', 'create', 'update'], 'stock-transfer')
    can(['read', 'create', 'update'], 'category')
    can(['read', 'create', 'update'], 'brand')

    can('read', 'accounts-section')
    can(['read', 'create'], 'supplier')

    /**
     */
  } else if (role === 'salesperson') {
    /**
     * What a salesperson can and cannot do
     *
     */
    can(['read'], 'pages-section')
    can(['read', 'create', 'update'], 'customer')
    can(['read'], 'product')

    can(['read'], 'sales-section')

    can(['read', 'create', 'update'], 'invoice')
    can(['read', 'create', 'update'], 'quote')
    can(['read', 'create', 'update'], 'order')
    can(['read', 'create', 'update'], 'receipt')
    can(['read', 'create', 'update'], 'credit-note')
  }

  // everyone's rules
  can('manage', 'home')
  cannot('manage', 'roles')

  return rules
}

export const buildAbilityFor = (
  role: string,
  subject: string,
): AppAbility => {
  return new AppAbility(defineRulesFor(role, subject), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type,
  })
}

export const defaultACLObj: ACLObj = {
  action: 'read',
  subject: 'all',
}

export default defineRulesFor
