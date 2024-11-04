// repositories/UserRepository.js
import IUserRepository from "../interfaces/IUserRepository.js";
import userModel from "../model/userModel.js";

class UserRepository extends IUserRepository {
  async create(user) {
    return await userModel.create(user);
  }

  async findByEmail(email) {
    return await userModel.findOne({ email });
  }

  async findById(id) {
    return await userModel.findById(id);
  }

  async update(id, updatedFields) {
    return await userModel.findByIdAndUpdate(id, updatedFields, { new: true });
  }

  async delete(id) {
    return await userModel.findByIdAndDelete(id);
  }

  async getAll() {
    return await userModel.find(); // This will return all users
  }
}

export default UserRepository;
