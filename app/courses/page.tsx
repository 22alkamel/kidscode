'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CoursesHero from "./CoursesHero";
import CoursesFilter from "./CoursesFilter";
import CoursesList from "./CoursesList";
import { useState } from "react";

export default function CoursesPage() {
  const [selectedAge, setSelectedAge] = useState(8);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <CoursesHero />
        <CoursesFilter
          selectedAge={selectedAge}
          onAgeChange={setSelectedAge}
        />
        <CoursesList selectedAge={selectedAge} />
      </main>
      <Footer />
    </div>
  );
}
