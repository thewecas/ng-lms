export interface User {
  uid: string;
  idToken?: string;
  refreshToken?: string;
  employeeId: string;
  name: string;
  email: string;
  role: string;
  designation: string;
  isDeleted: boolean;
}
