// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

// pages section
const pagesSection: VerticalNavItemsType = [
  {
    action: 'read',
    subject: 'pages-section',
    sectionTitle: 'PAGES',
  },
  {
    action: 'read',
    subject: 'pages-section',
    title: 'Products',
    path: '/products',
    icon: 'tabler:box-seam',
  },
  {
    action: 'read',
    subject: 'pages-section',
    title: 'Customers',
    path: '/customers',
    icon: 'tabler:users',
  },
]

// sales section
const salesSectionB2B: VerticalNavItemsType = [
  {
    action: 'read',
    subject: 'sales-section',
    sectionTitle: 'SALES',
  },
  {
    action: 'read',
    subject: 'sales-section',
    title: 'Invoices',
    path: '/invoices',
    icon: 'tabler:file-dollar',
  },
  {
    action: 'read',
    subject: 'sales-section',
    title: 'Quotes',
    path: '/quotes',
    icon: 'tabler:circle-letter-q',
  },
  {
    action: 'read',
    subject: 'sales-section',
    title: 'Orders',
    path: '/orders',
    icon: 'tabler:shopping-cart',
  },
  {
    action: 'read',
    subject: 'sales-section',
    title: 'Credit Notes',
    path: '/credit-notes',
    icon: 'tabler:receipt',
  },
  {
    action: 'read',
    subject: 'sales-section',
    title: 'Receipts',
    path: '/receipts',
    icon: 'tabler:cash',
  },
]

const salesSectionB2C: VerticalNavItemsType = [
  {
    action: 'read',
    subject: 'sales-section',
    sectionTitle: 'SALES',
  },
  {
    action: 'read',
    subject: 'sales-section',
    title: 'Invoices',
    path: '/invoices',
    icon: 'tabler:file-dollar',
  },
  {
    action: 'read',
    subject: 'sales-section',
    title: 'Quotes',
    path: '/quotes',
    icon: 'tabler:circle-letter-q',
  },
  {
    action: 'read',
    subject: 'sales-section',
    title: 'Credit Notes',
    path: '/credit-notes',
    icon: 'tabler:receipt',
  },
  {
    action: 'read',
    subject: 'sales-section',
    title: 'Receipts',
    path: '/receipts',
    icon: 'tabler:cash',
  },
]

const managementSection: VerticalNavItemsType = [
  {
    action: 'read',
    subject: 'management-section',
    sectionTitle: 'MANAGEMENT',
  },
  {
    action: 'read',
    subject: 'management-section',
    title: 'User Accounts',
    path: '/userAccounts',
    icon: 'tabler:user-circle',
  },

  // {
  //   title: 'Edit Requests',
  //   path: '/edit-requests',
  //   icon: 'tabler:edit',
  // },
]

const productManagementSection: VerticalNavItemsType = [
  {
    action: 'read',
    subject: 'products-section',
    sectionTitle: 'PRODUCT MANAGEMENT',
  },
  {
    action: 'read',
    subject: 'products-section',
    title: 'Raw Products',
    path: '/products/raw-products',
    icon: 'tabler:box-seam',
  },

  // {
  //   action: 'read',
  //   subject: 'products-section',
  //   title: 'Stock Transfer',
  //   path: '/stock-transfer',
  //   icon: 'tabler:switch-horizontal',
  // },
  {
    action: 'read',
    subject: 'products-section',
    title: 'Categories',
    path: '/categories',
    icon: 'tabler:list-details',
  },
  {
    action: 'read',
    subject: 'products-section',
    title: 'Brands',
    path: '/brands',
    icon: 'tabler:crown',
  },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const purchasesSection: VerticalNavItemsType = [
  { sectionTitle: 'PURCHASES' },
  {
    title: 'Stock Management',
    path: '/stock-management',
    icon: 'tabler:truck-delivery',
  },
  {
    title: 'Purchase Orders',
    path: '/purchase-orders',
    icon: 'tabler:devices-pc',
  },
  {
    title: 'Purchase Invoices',
    path: '/purchase-invoices',
    icon: 'tabler:file-dollar',
  },
  {
    title: 'Purchase Credit Notes',
    path: '/purchase-credit-notes',
    icon: 'tabler:user-circle',
  },
  {
    title: 'Supplier Payments',
    path: '/supplier-payments',
    icon: 'tabler:cash',
  },
]

const accountsSection: VerticalNavItemsType = [
  {
    action: 'read',
    subject: 'accounts-section',
    sectionTitle: 'ACCOUNTS',
  },
  {
    action: 'read',
    subject: 'report',
    title: 'Reports',
    path: '/reports',
    icon: 'tabler:clipboard-data',
  },
  {
    action: 'read',
    subject: 'supplier',
    title: 'Suppliers',
    path: '/suppliers',
    icon: 'tabler:user-circle',
  },
]

const adminSection: VerticalNavItemsType = [
  {
    action: 'read',
    subject: 'admin-section',
    sectionTitle: 'ADMIN',
  },
  {
    action: 'read',
    subject: 'stores',
    title: 'Stores',
    path: '/stores',
    icon: 'tabler:building-store',
  },
  {
    action: 'read',
    subject: 'roles',
    title: 'Roles and Permissions',
    path: '/roles-permissions',
    icon: 'tabler:settings',
  },
]

const navigation = (
  isB2CStore: boolean,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  role?: string,
): VerticalNavItemsType => {
  if (isB2CStore) {
    return [
      ...pagesSection,

      ...salesSectionB2C,

      ...managementSection,

      ...productManagementSection,

      ...accountsSection,

      ...adminSection,
    ]
  }

  return [
    ...pagesSection,

    ...salesSectionB2B,

    ...managementSection,

    ...productManagementSection,

    ...accountsSection,

    ...adminSection,
  ]
}

export default navigation
