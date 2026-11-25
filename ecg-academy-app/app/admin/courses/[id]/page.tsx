import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import EditCourseForm from "./edit-course-form";

export const instant = false;

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getCurrentUser();

  if (!admin || admin.role !== "ADMIN") {
    redirect("/login");
  }

  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
  });

  if (!course) notFound();

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <a href="/admin/courses" className="text-cyan-400">
          ← Назад к курсам
        </a>

        <h1 className="mt-8 text-3xl font-bold">Редактировать курс</h1>

        <EditCourseForm
          course={{
            id: course.id,
            titleRu: course.titleRu,
            titleEn: course.titleEn,
            descriptionRu: course.descriptionRu || "",
            descriptionEn: course.descriptionEn || "",
            isFree: course.isFree,
            price: course.price.toString(),
            status: course.status,
          }}
        />
      </div>
    </main>
  );
}