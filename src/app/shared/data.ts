export interface User {
  id: number;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
}

export const USERS: User[] = [
  { id: 1, name: 'Asha', role: 'admin' },
  { id: 2, name: 'Ravi', role: 'editor' },
  { id: 3, name: 'Meera', role: 'viewer' },
];

