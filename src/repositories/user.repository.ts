import { User, IUser } from "../models/user.model";

export class UserMongoRepository {
  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async create(user: IUser): Promise<IUser> {
    return await User.create(user);
  }

  async findAll(): Promise<IUser[]> {
    return await User.find();
  }

  async updateById(
    id: string,
    data: Partial<IUser>
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }
}