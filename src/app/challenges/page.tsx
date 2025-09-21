"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const challenges = [
  {
    key: "tree-planting",
    title: "Tree Planting Drive",
    description: "Plant 1000 trees in your community and track contributions.",
    progress: 48,
  },
  {
    key: "energy-saving",
    title: "Energy Saving Competition",
    description: "Reduce electricity usage by 20% over 30 days.",
    progress: 62,
  },
  {
    key: "plastic-reduction",
    title: "Plastic Usage Reduction",
    description: "Eliminate single-use plastics from campus events.",
    progress: 35,
  },
];

export default function ChallengesPage() {
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
        <h1 className="text-3xl sm:text-4xl font-bold">Challenges</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">Join real-world, digitally trackable activities and see progress in real time.</p>

        <div className="grid gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((c) => (
            <Card key={c.key} className="bg-card/85 border-border text-foreground">
              <CardHeader>
                <CardTitle>{c.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{c.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">{c.progress}%</span>
                </div>
                <Progress value={c.progress} />
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">Track Activity</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}