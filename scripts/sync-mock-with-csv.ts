import fs from "fs";
import path from "path";

// Parse CSV line handling quoted fields with commas
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

const csvPath = path.join(process.cwd(), "jonomot_institutions_seed.csv");
const content = fs.readFileSync(csvPath, "utf-8");
const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
const dataLines = lines.slice(1);

const institutions = [];

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
    featured: true,
    aiSummary,
    busyHoursNote: "Peak waiting times typically between 11:00 AM and 2:00 PM.",
  });
}

// Read mockData.ts
const mockDataPath = path.join(process.cwd(), "lib", "mockData.ts");
let mockContent = fs.readFileSync(mockDataPath, "utf-8");

// We want to replace the INSTITUTIONS array in mockData.ts with all 25 institutions
const arrayString = `export const INSTITUTIONS: InstitutionItem[] = ${JSON.stringify(institutions, null, 2)};`;

// Replace from `export const INSTITUTIONS` up to `;` before `export const INITIAL_REPORTS`
const startIdx = mockContent.indexOf("export const INSTITUTIONS: InstitutionItem[] =");
const endIdx = mockContent.indexOf("export const INITIAL_REPORTS: ReportItem[] =");

if (startIdx !== -1 && endIdx !== -1) {
  mockContent =
    mockContent.substring(0, startIdx) +
    arrayString +
    "\n\n" +
    mockContent.substring(endIdx);
  fs.writeFileSync(mockDataPath, mockContent, "utf-8");
  console.log(`✅ Updated lib/mockData.ts with all ${institutions.length} institutions!`);
} else {
  console.error("Could not locate INSTITUTIONS block in lib/mockData.ts");
}
