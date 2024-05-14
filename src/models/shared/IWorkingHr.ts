import IDay from './IDay'

interface IWorkingHr {
  day: IDay
  startTime: string
  endTime: string
  isActive: boolean
  user?: number
}

export interface IWorkingHrWithID extends IWorkingHr {
  id: number
}

export default IWorkingHr
