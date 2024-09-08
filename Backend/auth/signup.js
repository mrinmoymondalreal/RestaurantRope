import { hash } from "bcrypt";
import client from "../database/index.js";
import { REG_EMAIL, REG_PASSWORD, REG_PHONE } from "./common.js";

export async function signup({ name, email, password, phoneNumber }) {
  try {
    const h =
      [name, email, password, phoneNumber].filter(
        (e) => (e && e.trim().length <= 3) || !e
      ).length > 0;

    if (
      h ||
      !REG_PASSWORD.test(password) ||
      !REG_EMAIL.test(email) ||
      !REG_PHONE.test(phoneNumber)
    )
      return { err: "invalid", data: null };
    let passwordHash = await hash(password, 10);
    let result = await client.query(
      "INSERT INTO Users(Name, PasswordHash, Email, PhoneNumber) VALUES ($1, $2, $3, $4) RETURNING UserID",
      [name, passwordHash, email, phoneNumber]
    );
    if (result.rows.length) return { err: null, data: "success" };
  } catch (err) {
    if (err.routine == "_bt_check_unique") {
      return {
        err:
          err.constraint.replace("users_", "").replace("_key", "") + " exists",
        data: null,
      };
    }

    console.log(err);

    return { err: null, data: null };
  }
}
