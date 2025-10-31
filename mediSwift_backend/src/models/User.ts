import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  role: "User" | "Rider";
  ambulanceName?: string;
  ambulanceNumber?: string;
  hasMedicalTraining?: boolean;
  imageUrl?: string;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["User", "Rider"],
      default: "User",
      required: true,
    },

    // Rider-specific fields
    ambulanceName: {
      type: String,
      required: function (this: IUser) {
        return this.role === "Rider";
      },
    },
    ambulanceNumber: {
      type: String,
      required: function (this: IUser) {
        return this.role === "Rider";
      },
    },
    hasMedicalTraining: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);
