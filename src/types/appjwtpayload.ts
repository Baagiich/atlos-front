import { JwtPayload } from "jwt-decode";
import { UserType } from "./usertype";

export interface AppJwtPayload extends JwtPayload {
  user_type: UserType;
  username: string;
  roles: string[];
  iri: string;
  deviceId: string;
}
