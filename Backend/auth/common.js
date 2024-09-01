export const REG_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
export const REG_USERNAME = /^[a-zA-Z0-9_-]{3,16}$/;
export const REG_EMAIL = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const REG_PHONE = /^\+91\s[6789]\d{9}$/;
