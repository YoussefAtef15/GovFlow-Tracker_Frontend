// src/app/interfaces/user.interface.ts
export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  nationalId?: string; // أضف هذه الخاصية لتكون متوفرة
}
