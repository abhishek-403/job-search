import { Request, Response } from "express";
import { errorResponse, successResponse } from "../lib/responseWrapper";
import prisma from "../lib/PrismaClient";
import { UpdateUserDto, updateUserSchema } from "../dto/user.dto";
// import { User } from '../models/userModel';

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    // const users = await User.find();
    res.status(200).send("Hello World!");
  } catch (error) {
    // res.status(500).json({ message: error.message });
  }
};

// // Get a single user by ID
export const getUserById = async (req: any, res: Response) => {
  try {
    const { uid } = req.user;
    if (!uid) {
      res.send(errorResponse(400, "Uid required"));
      return;
    }

    const user = await prisma.user.findUnique({
      where: { uid },
    });

    if (!user) {
      res.send(errorResponse(404, "Not found"));
      return;
    }

    res.send(successResponse(200, user ));
  } catch (error) {
    console.log(error);

    res.send(errorResponse(500, "Internal Error"));
    return;
  }
};
export const getUserImgById = async (req: any, res: Response) => {
  try {
    const u  = req.user;
    if (!u) {
      res.send(successResponse(200, {img:null,name:null,isLoggedIn:false}));
      return;
    }

    const user = await prisma.user.findUnique({
      where: { uid: u.uid },
    });

    if (!user) {
      res.send(errorResponse(404, "Not found"));
      return;
    }

    res.send(successResponse(200, {img:user.profileImage,name:user.name,isLoggedIn:true }));
  } catch (error) {
    console.log(error);

    res.send(errorResponse(500, "Internal Error"));
    return;
  }
};

// // Create a new user
export const createUser = async (req: any, res: Response) => {
  try {
    const uid = req.user.uid;
    if (!req.body.email || !uid) {
      res.send(errorResponse(400, "Bad Request"));
      return;
    }
    const isUser = await prisma.user.findFirst({
      where: { uid },
    });
    if (isUser) {
      res.send(successResponse(200, { user: isUser }));
      return;
    }
    const user = await prisma.user.create({
      data: { ...req.body, uid, authProvider: "email_password" },
    });

    res.send(successResponse(200, { user }));
  } catch (error) {
    res.send(errorResponse(500, "Internal Error"));
  }
};
export const googleLogin = async (req: any, res: Response) => {
  try {
    const uid = req.user.uid;
    if (!req.body.email || !uid) {
      res.send(errorResponse(400, "Bad Request"));
      return;
    }
    const isUser = await prisma.user.findFirst({
      where: { uid },
    });
    if (isUser) {
      res.send(successResponse(200, { user: isUser }));
      return;
    }
    const user = await prisma.user.create({
      data: { ...req.body, uid, authProvider: "google" },
    });

    res.send(successResponse(200, { user }));
  } catch (error) {
    res.send(errorResponse(500, "Internal Error"));
  }
};

export const updateUser = async (req: any, res: Response) => {
  const userId = req.user.uid;
  
  const parsedBody = updateUserSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.send(errorResponse(403, { error: parsedBody.error.errors }));
    return;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { uid: userId },
      data: parsedBody.data as UpdateUserDto,
    });

    res.send(
      successResponse(200, {
        user: updatedUser,
        msg: "Profile updated successfully",
      })
    );
  } catch (error) {
    res.send(errorResponse(500, "Internal Error"));
  }
};

// // Delete a user
// export const deleteUser = async (req: Request, res: Response) => {
//     try {
//         const deletedUser = await User.findByIdAndDelete(req.params.id);
//         if (!deletedUser) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.status(200).json({ message: 'User deleted' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
