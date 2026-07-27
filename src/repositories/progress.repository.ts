import Progress from "../models/progress.model";

export class ProgressRepository {
  async completeLesson(userId: string, lessonId: string) {
    const existing = await Progress.findOne({
      userId,
      lessonId,
    });

    if (existing) {
      return existing;
    }

    return await Progress.create({
      userId,
      lessonId,
      completed: true,
      completedAt: new Date(),
    });
  }

  async getUserProgress(userId: string) {
    return await Progress.find({ userId }).populate("lessonId");
  }
  async deleteProgressByLessonId(lessonId: string) {
  return await Progress.deleteMany({
    lessonId,
  });
}
}

export default new ProgressRepository();