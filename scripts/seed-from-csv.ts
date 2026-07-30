import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper to clean CSV quotes and commas inside quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function mapCategory(csvCat: string): string {
  if (csvCat.includes("পরিবহন") || csvCat.includes("Transport")) {
    return "Transportation & License";
  }
  if (csvCat.includes("পুলিশ") || csvCat.includes("Police")) {
    return "Police & Public Safety";
  }
  if (csvCat.includes("পাসপোর্ট") || csvCat.includes("Passport")) {
    return "Identity & Passport";
  }
  if (csvCat.includes("পরিচয়পত্র") || csvCat.includes("NID")) {
    return "Municipal & City Services";
  }
  if (csvCat.includes("হাসপাতাল") || csvCat.includes("Hospital")) {
    return "Healthcare & Hospitals";
  }
  return "Transportation & License";
}

function generateSlug(nameEn: string): string {
  return nameEn
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  const csvPath = path.join(process.cwd(), "jonomot_institutions_seed.csv");
  if (!fs.existsSync(csvPath)) {
    console.error("CSV file not found at:", csvPath);
    process.exit(1);
  }

  const content = fs.readFileSync(csvPath, "utf-8");
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  
  // Skip header
  const dataLines = lines.slice(1);
  const institutions = [];

  console.log(`Reading ${dataLines.length} institutions from CSV...`);

  for (const line of dataLines) {
    const cols = parseCSVLine(line);
    if (cols.length < 5) continue;

    const categoryRaw = cols[0];
    const nameEn = cols[1];
    const nameBn = cols[2];
    const address = cols[3];
    const googleMapsLink = cols[4];
    const hours = cols[5] || "9:00 AM - 5:00 PM";
    const googleRating = parseFloat(cols[6]) || 4.0;
    const ratingCount = parseInt(cols[7]) || 100;
    const phone = cols[8] || "+880 1700-000000";
    const aiSummary = cols[9] || "Citizens report structured services when documents are prepared.";

    const category = mapCategory(categoryRaw);
    const id = generateSlug(nameEn);

    // Calculate deterministic jonomotRating (0-100) based on google rating
    const jonomotRating = Math.min(
      98,
      Math.max(60, Math.round((googleRating / 5.0) * 85 + 10))
    );

    institutions.push({
      id,
      name: nameEn,
      nameBn: nameBn,
      address,
      category,
      division: "Dhaka",
      district: "Dhaka",
      trustScore: googleRating,
      jonomotRating,
      hours,
      contact: phone,
      imageUrl: "/prelilogin.png",
      reportCount: Math.max(12, Math.round(ratingCount / 10)),
      aiSummary,
      googleMapsLink,
    });
  }

  console.log(`Parsed ${institutions.length} institutions. Storing into SQLite dev.db...`);

  // Insert into SQLite database via Prisma
  for (const inst of institutions) {
    await prisma.institution.upsert({
      where: { id: inst.id },
      update: {
        name: inst.name,
        nameBn: inst.nameBn,
        address: inst.address,
        category: inst.category,
        trustScore: inst.trustScore,
        hours: inst.hours,
        contact: inst.contact,
      },
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
  }

  console.log("✅ All institutions successfully saved into SQLite permanent database!");
  
  // Now also output summary
  console.log(`Total institutions stored: ${institutions.length}`);
  for (const inst of institutions) {
    console.log(` - [${inst.category}] ${inst.name} (${inst.nameBn}) - Rating: ${inst.trustScore}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
