export type InquiryStatus = "Pending" | "Quotation Submitted" | "Active" | "Confirmed" | "Rejected"
export type UserRole = "Management" | "Purchasing Team Head" | "PIC"
export type Category = "Bonded" | "Provisions" | "Deck/Engine" | "Miscellaneous"

export interface Inquiry {
  id: string
  referenceNumber: string
  vesselName: string
  agent: string
  eta: string
  port: string
  categories: Category[]
  status: InquiryStatus
  picAssigned?: string
  receivedDate: string
  estimatedQuotationDate: string
  quotationSubmittedDate?: string
  confirmedDate?: string
  rejectedDate?: string
  createdAt: string
  updatedAt: string
}

export interface Remark {
  id: string
  inquiryId: string
  text: string
  author: string
  timestamp: string
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface DashboardStats {
  totalInquiries: number
  pendingCount: number
  activeCount: number
  confirmedCount: number
  rejectedCount: number
}
