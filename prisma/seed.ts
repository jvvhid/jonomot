import { PrismaClient } from "@prisma/client";
import { CATEGORIES, INSTITUTIONS, INITIAL_REPORTS } from "../lib/mockData";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PostgreSQL database with Bangladeshi civic institutions and reports...");

  // Seed Categories
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: {
        id: cat.id,
        name: cat.name,
        icon: cat.iconName,
        count: cat.count,
      },
    });
  }

  // Seed Institutions
  for (const inst of INSTITUTIONS) {
    const createdInst = await prisma.institution.upsert({
      where: { id: inst.id },
      update: {},
      create: {
        id: inst.id,
        name: inst.name,
        nameBn: inst.nameBn,
        address: inst.address,
        category: inst.category,
        division: inst.division,
        district: inst.district,
        trustScore: inst.trustScore,
        hours: inst.hours,
        contact: inst.contact,
        imageUrl: inst.imageUrl,
      },
    });

    // Seed Reports for this institution
    const reportsForInst = INITIAL_REPORTS.filter((r) => r.institutionId === inst.id);
    for (const rep of reportsForInst) {
      await prisma.report.upsert({
        where: { id: rep.id },
        update: {},
        create: {
          id: rep.id,
          title: rep.title,
          description: rep.description,
          visitDate: rep.visitDate,
          rating: rep.rating,
          status: rep.status,
          upvotes: rep.upvotes,
          institutionId: createdInst.id,
        },
      });
    }
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
