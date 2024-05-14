type IVerificationStatus = 'pending' | 'verified' | 'failed'

export interface IReferenceStatusNew {
  verificationStatus: IVerificationStatus
  verificationDate?: string
  verificationDescriptions?: string
  deleted?: boolean
  reference: number
  verifiedBy: number
}

export interface IReferenceStatus
  extends IReferenceStatusNew {
  id: number
  createdAt: string
}

export type IReferenceStatusUpdate =
  Partial<IReferenceStatusNew>

export interface IReferenceNew {
  referenceCompanyName: string
  referenceCompanyNumber: string
  referenceContactName: string
  referenceContactNumber: string
  yearsTrading: number
  referenceCreditLimit: string
  deleted: boolean
  customer: number[]
}

export interface IReference extends IReferenceNew {
  id: number
  createdAt: string
}

export type IReferenceUpdate = Partial<IReferenceNew>
