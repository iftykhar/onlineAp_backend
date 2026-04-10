import { StatusCodes } from "http-status-codes";
import config from "../../config";
import AppError from "../../errors/AppError";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudinary";
import { createToken } from "../../utils/tokenGenerate";
import { IUser } from "./user.interface";
import { User } from "./user.model";

const registerUser = async (payload: IUser) => {
  const existingUser = await User.isUserExistByEmail(payload.email);
  if (existingUser) {
    throw new AppError("User already exists with this email", StatusCodes.CONFLICT);
  }

  if (payload.password.length < 6) {
    throw new AppError(
      "Password must be at least 6 characters long",
      StatusCodes.BAD_REQUEST
    );
  }

  // Direct registration — no OTP email verification needed
  const result = await User.create({
    ...payload,
    isVerified: true,
  });

  const tokenPayload = {
    id: result._id,
    email: result.email,
    role: result.role,
  };

  const accessToken = createToken(
    tokenPayload,
    config.JWT_SECRET as string,
    config.JWT_EXPIRES_IN as string
  );

  const refreshToken = createToken(
    tokenPayload,
    config.refreshTokenSecret as string,
    config.jwtRefreshTokenExpiresIn as string
  );

  return {
    accessToken,
    refreshToken,
    user: {
      _id: result._id,
      fullName: result.fullName,
      email: result.email,
      role: result.role,
    },
  };
};

const getAllUsers = async () => {
  const result = await User.find().select("fullName email role");
  return result;
};

const getAdminId = async () => {
  const admin = await User.findOne({ role: "admin" }).select("_id");
  return admin;
};

const getMyProfile = async (email: string) => {
  const existingUser = await User.findOne({ email });
  if (!existingUser)
    throw new AppError(
      "No account found with the provided credentials.",
      StatusCodes.NOT_FOUND
    );

  const result = await User.findOne({ email }).select(
    "-password -otp -otpExpires -resetPasswordOtp -resetPasswordOtpExpires"
  );

  return result;
};

const updateUserProfile = async (payload: any, email: string, file: any) => {
  const user = await User.findOne({ email }).select("image");
  if (!user)
    throw new AppError(
      "No account found with the provided credentials.",
      StatusCodes.NOT_FOUND
    );

  // eslint-disable-next-line prefer-const
  let updateData: any = { ...payload };
  let oldImagePublicId: string | undefined;

  if (file) {
    const uploadResult = await uploadToCloudinary(file.path, "users");
    oldImagePublicId = user.image?.public_id;

    updateData.image = {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
    };
  }

  const result = await User.findOneAndUpdate({ email }, updateData, {
    new: true,
  }).select("-password -otp -otpExpires -resetPasswordOtp -resetPasswordOtpExpires");

  if (file && oldImagePublicId) {
    await deleteFromCloudinary(oldImagePublicId);
  }

  return result;
};

const userService = {
  registerUser,
  getAllUsers,
  getMyProfile,
  updateUserProfile,
  getAdminId,
};

export default userService;
