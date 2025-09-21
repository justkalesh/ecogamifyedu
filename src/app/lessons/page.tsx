import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllLessons } from "./data";
import { LessonProgress } from "./LessonProgress";

export default function LessonsPage() {
  const lessons = getAllLessons();
  return (
    <div className="min-h-screen w-full bg-background text-foreground relative pt-24 px-4 sm:px-6 lg:px-8 pb-10">
      <div
        className="absolute inset-0 -z-10 bg-center bg-cover"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop)",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/70" aria-hidden />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold">Lessons</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">Modular topics with quizzes and activities to turn learning into action.</p>

        <div className="grid gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-4">
          {lessons.map((l) => (
            <Card key={l.key} className="overflow-hidden bg-card/85 border-border text-foreground">
              <div className="h-28 w-full bg-cover bg-center" style={{ backgroundImage: `url(${l.cover})` }} />
              <CardHeader>
                <CardTitle>{l.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{l.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <LessonProgress lessonKey={l.key} totalChapters={l.chapters.length} />
                <Button asChild className="w-full mt-4 bg-green-600 hover:bg-green-700">
                  <Link href={`/lessons/${l.key}`}>Start Lesson</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}