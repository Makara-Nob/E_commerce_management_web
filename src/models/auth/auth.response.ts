export interface UserAuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: string;
    active: boolean;
    position: string;
    status: string;
    userPermission: string;
    roles: string[];
  };
}
