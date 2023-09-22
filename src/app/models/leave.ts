export interface Leave {
  uid: string;
  leaveId: string;
  employeeId: string;
  fromDate: number;
  toDate: number;
  reason: string;
  type: string;
  status: string;
  isDeleted: boolean;
}
