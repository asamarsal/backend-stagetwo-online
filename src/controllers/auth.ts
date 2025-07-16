import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser , loginSupplier, registerSupplier} from "../services/auth";
import { prisma } from "../prisma/client";
import { loginSchema, registerSchema } from "../validation/auth";
import { productSchema } from "../validation/auth";

export async function handleRegister(req: Request, res: Response) {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "Harus menggunakan foto" });
    }

    const { error } = registerSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    const { email, password, role} = req.body;
    const profile = req.file?.filename;
    const user = await registerUser(email, password, profile, role);

    res.status(201).json({ message: "User registered", user });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function handleLogin(req: Request, res: Response) {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    const { email, password } = req.body;

    const result = await loginUser(email, password);
    res.json({ message: "Login success", ...result });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
}

export async function handleLoginSuppliers(req: Request, res: Response) {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    const { email, password } = req.body;

    const result = await loginSupplier(email, password);
    res.json({ message: "Login success", ...result });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
}

export async function addProduct(req: Request, res: Response): Promise<void> {
  try {
    const user = (req as any).user;

    if (!req.file) {
      res.status(400).json({ message: "Harus menggunakan foto produk" });
      return;
    }

    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        price: parseFloat(req.body.price),
        stock: parseInt(req.body.stock) || 0,
        photo: req.file?.filename,
        supplierId: user.id // Gunakan user.id sebagai supplierId
      }
    });

    res.status(201).json({ 
      message: "Product add success", 
      product 
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function handleRegisterSuppliers(req: Request, res: Response) {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    const { email, password } = req.body;
    const supplier = await registerSupplier(email, password);
    res.status(201).json({ message: "Supplier registered", supplier });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  try {
    const productId = parseInt(req.params.id);
    const supplier = (req as any).user;

    const { error } = productSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    const product = await prisma.product.update({
      where: { 
        id: productId,
      },
      data: req.body,
    });

    res.json({ 
      message: "Product updated success", 
      product 
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}