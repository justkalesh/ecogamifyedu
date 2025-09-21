import { LessonRunner } from "./LessonRunner";

export default function LessonPage({ params }: { params: { lessonKey: string } }) {
  return <LessonRunner lessonKey={params.lessonKey} />;
}