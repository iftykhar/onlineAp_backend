import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const examSchema = new mongoose.Schema({
  title: String,
  status: String,
  startTime: Date,
  endTime: Date,
  questions: [Object]
});

const Exam = mongoose.models.Exam || mongoose.model('Exam', examSchema);

async function checkExams() {
  try {
    // Note: the backend env uses MONGODB_URL
    const url = process.env.MONGODB_URL;
    if (!url) {
        throw new Error("MONGODB_URL not found in .env");
    }
    await mongoose.connect(url);
    const exams = await Exam.find({});
    console.log(JSON.stringify(exams.map(e => ({
        title: e.title,
        status: e.status,
        startTime: e.startTime,
        endTime: e.endTime,
        questionCount: e.questions.length
    })), null, 2));
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkExams();
