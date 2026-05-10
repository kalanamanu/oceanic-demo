export interface UserActivity {
  id: number;
  user_id: string;
  username: string;
  activity_description: string;
  activity_type: string;
  module: string | null;
  activity_time: string;
  activity_date: string;
  createdAt: string;
  updatedAt: string;
}

/* ==============================
   GET ALL ACTIVITIES RESPONSE
============================== */
export interface ActivityListResponse {
  success: boolean;
  message: string;
  data: UserActivity[];
}