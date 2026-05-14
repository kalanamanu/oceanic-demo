export interface DashboardCards {
  totalInquiries: number;
  activeVendors: number;
  pendingInquiries: number;
  confirmedInquiries: number;
}

export interface RecentInquiry {
  title: string;
  agent: string;
  eta: string;
  port: string;
  received_date: string;
  received_time: string;
  createdAt: string;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  cards: DashboardCards;
  recentInquiries: RecentInquiry[];
}