// types/Employee.ts
export interface Employee {
  id: string;
  name: string;
  department: string;
  salary: number;
  startDate: string;
  endDate: string;
  addedByUid?: string;
  addedByName?: string;
  addedByEmail?: string;
}
