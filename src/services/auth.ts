// src/services/auth.service.ts
import bcrypt from "bcrypt";
import { prisma } from "../prisma/client";
import { signToken } from "../utils/jwt";
import { loginSchema } from "../validation/auth";

// Add profile parameter to registerUser function
export async function registerUser(email: string, password: string, profile: string, role: any) {
  if (!email.match(/@/) || password.length < 6) {
    throw new Error("Invalid email or password");
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { 
      email, 
      password: hashed,
      profile: 'user',
      role,
    }
  });

  return { 
    id: user.id, 
    email: user.email,
    profile: user.profile,
  };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Wrong password");

  const token = signToken({ id: user.id, role: user.role });
  return { token };
}

export async function registerSupplier(email: string, password: string, profile: string, role: any) {
  const hashed = await bcrypt.hash(password, 10);

  const supplier = await prisma.supplier.create({
    data: { email, password: hashed },
  });

  return { id: supplier.id, email: supplier.email };
}

export async function loginSupplier(email: string, password: string) {
  
  const { error } = loginSchema.validate({ email, password });
  if (error) {
    throw new Error(error.message);
  }

  const supplier = await prisma.supplier.findUnique({ where: { email } });
  if (!supplier) throw new Error("Supplier not found");

  const isMatch = await bcrypt.compare(password, supplier.password);
  if (!isMatch) throw new Error("Wrong password");

  const token = signToken({ id: supplier.id, role: supplier.role });
  return { token };
}