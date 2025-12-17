import { UserBase } from "./UserBase";

interface UserUpdationRequest extends UserBase {
  isActive: boolean;
  note: string;
}

export type { UserUpdationRequest };
