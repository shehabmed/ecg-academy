import "dotenv/config";
import { PrismaClient } from "./app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const course = await prisma.course.upsert({
    where: { slug: "basic-principles-of-ecg" },
    update: {
      titleEn: "Basic Principles of ECG",
      titleRu: "Основные принципы ЭКГ",
      descriptionEn:
        "A comprehensive introduction to ECG, from electrode placement and electrical vectors to the interpretation of a standard 12-lead ECG.",
      descriptionRu:
        "Полное введение в электрокардиографию: расположение электродов, электрические векторы и основы интерпретации стандартной ЭКГ в 12 отведениях.",
      price: 0,
      isFree: true,
      status: "PUBLISHED",
    },
    create: {
      slug: "basic-principles-of-ecg",
      titleEn: "Basic Principles of ECG",
      titleRu: "Основные принципы ЭКГ",
      descriptionEn:
        "A comprehensive introduction to ECG, from electrode placement and electrical vectors to the interpretation of a standard 12-lead ECG.",
      descriptionRu:
        "Полное введение в электрокардиографию: расположение электродов, электрические векторы и основы интерпретации стандартной ЭКГ в 12 отведениях.",
      price: 0,
      isFree: true,
      status: "PUBLISHED",
    },
  });

  console.log("Курс успешно добавлен:");
  console.log(course.titleEn);
  console.log(course.titleRu);
}

main()
  .catch((error) => {
    console.error("Ошибка:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
