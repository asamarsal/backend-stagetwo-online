// src/routes/auth.route.ts
import express, { Request, Response, NextFunction } from "express";
import { handleRegister, handleLogin, handleLoginSuppliers, addProduct, handleRegisterSuppliers, updateProduct } from "../controllers/auth";

import { authenticate, authenticateSuppliers , authorizeSupplier} from "../middlewares/auth";
import { productSchema } from "../validation/auth";

import { prisma } from "../prisma/client";
import { uploadProfile } from "../utils/multerProfile";
import { uploadProduct } from "../utils/multerProducts";

import {handleUploadError} from "../middlewares/error-fileupload";

import limiter from '../middlewares/rate-limiter';

const router = express.Router();

router.post("/register", limiter, uploadProfile.single("profile"),(req: Request, res: Response, next: NextFunction): void => {handleRegister(req, res).catch(next);});
router.post("/login", handleLogin);

router.post("/suppliers/register", handleRegisterSuppliers);
router.post("/suppliers/login", handleLoginSuppliers);
router.get("/me", authenticate, async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        profile: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      message: "Get user profile success",
      user 
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/suppliers/products", authenticateSuppliers, async (req, res) => {
  try {
    const supplier = (req as any).user;
    
    const products = await prisma.product.findMany({
      where: {
        supplierId: supplier.id
      },
      include: {
        supplier: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        id: 'asc'
      }
    });
    
    res.json({ 
      message: "Get products success",
      products 
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});


// router.post("/products/add", authenticateSuppliers, addProduct);
router.post("/products/add", limiter, authenticateSuppliers, uploadProduct.single("photo"), addProduct, handleUploadError);

router.patch("/products/update/:id", authenticateSuppliers, authorizeSupplier, updateProduct);

export default router;