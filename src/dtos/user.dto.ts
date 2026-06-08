export interface RegisterDTO {
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  password: string;
  confirmPassword: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}