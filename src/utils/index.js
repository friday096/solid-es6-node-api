import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';

export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
  
  export async function comparePasswords(plainTextPassword, hashedPassword) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }
  
  export function generateObjectId() {
    return new mongoose.Types.ObjectId().toString();
  }
  
  export function addYearInDate(date) {
    date.setFullYear(date.getFullYear() + 1);
    return date;
  }
  
  export function convertBytesToMb(bytes) {
    return bytes / 1000000;
  }
  
  export function convertMbToGb(mb) {
    return mb / 1000;
  }

  export function addMinutesInDate(minutes) {
    return new Date(new Date().getTime() + minutes * 60000);
  }
  
  export function generateOrderNumber() {
    const timestamp = new Date().getTime();
    return `CM${timestamp}`;
  }