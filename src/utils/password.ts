import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10); // salt - add randomness to the password - 10 is cost factor
  return await bcrypt.hash(password, salt); // takes password and salt and returns hashed password
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};
