export interface IRole {
  title: string
  desc: string
}

export const roles: IRole[] = [
  {
    title: 'Administrator',
    desc: 'Best for business owners and companiy administrators.',
  },
  {
    title: 'Managers',
    desc: 'Best for users who have permission to apptove store transactions and have employee perfomance',
  },
  {
    title: 'Salesperson',
    desc: 'Best for employees who work at the trade counter',
  },
  {
    title: 'Logistics',
    desc: 'Best for employees that need to access stock and delivery information',
  },
  {
    title: 'Analyst',
    desc: "Best for people who need full access to analytics data but don't need to update business settings",
  },
  {
    title: 'Trial',
    desc: "Best for people who need to preview content data, but don't need to make any updates",
  },
]
