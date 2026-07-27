import { Lesson, ILesson } from "../models/lesson.model";

export class LessonMongoRepository {
  async findById(id: string): Promise<ILesson | null> {
    return await Lesson.findById(id);
  }

  async create(lesson: ILesson): Promise<ILesson> {
    return await Lesson.create(lesson);
  }

  async findAll(): Promise<ILesson[]> {
    return await Lesson.find();
  }

  async updateById(
    id: string,
    data: Partial<ILesson>
  ): Promise<ILesson | null> {
    return await Lesson.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await Lesson.findByIdAndDelete(id);
    return !!result;
  }
}