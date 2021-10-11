import { v4 as uuidV4 } from "uuid";

class User {
  id: string;
  name: string;
  admin: boolean;
  email: string;
  created_at: Date;
  updated_at: Date;

  constructor({
    id,
    name,
    email,
    admin,
    created_at,
    updated_at,
  }: Partial<User>) {
    if (!id) id = uuidV4();
    if (!name) name = "";
    if (!email) email = "";
    if (!admin) admin = false;
    if (!created_at) created_at = new Date();
    if (!updated_at) updated_at = new Date();

    Object.assign(this, {
      id,
      name,
      admin,
      email,
      created_at,
      updated_at,
    });
  }
}

export { User };
