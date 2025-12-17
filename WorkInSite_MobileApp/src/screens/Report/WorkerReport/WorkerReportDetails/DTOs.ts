type AttendanceItem = {
  attendanceId: number;
  date: string;
  siteId: number;
  siteName: string;
  workerId: number;
  workerName: string;
  workerCategoryName: string;
  amount: string;
};

type WorkerReportResponse = {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  items: AttendanceItem[];
};

export {type AttendanceItem, type WorkerReportResponse};
