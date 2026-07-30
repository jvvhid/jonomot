import { InstitutionItem } from "./mockData";

export interface SearchResult {
  matches: InstitutionItem[];
  didYouMean?: string;
}

// 1. Synonym groups for Bangla & English civic terms
const SYNONYM_GROUPS: string[][] = [
  ["hospital", "হাসপাতাল", "medical", "medicl", "dmch", "স্বাস্থ্য", "clinic", "চিকিৎসা", "মেডিকেল"],
  ["police", "পুলিশ", "thana", "থানা", "station", "safety", "আইনশৃঙ্খলা", "থানায়"],
  ["passport", "পাসপোর্ট", "pasport", "nid", "এনআইডি", "agargaon", "ভোটার", "identity", "পরিচয়পত্র"],
  ["brta", "বিআরটিএ", "license", "licence", "লাইসেন্স", "transport", "পরিবহন", "গাড়ি", "মোটর", "ড্রাইভিং"],
  ["land", "ভূমি", "ac land", "এসি ল্যান্ড", "registration", "রেজিস্ট্রেশন", "revenue", "রাজস্ব", "খতিয়ান", "জমির"],
  ["city corporation", "সিটি কর্পোরেশন", "municipal", "পৌরসভা", "dncc", "dscc", "নগর", "সিটি"],
  ["electricity", "বিদ্যুৎ", "gas", "গ্যাস", "desco", "titas", "utility", "বিদ্যুত"],
  ["mirpur", "মিরপুর", "mirpu"],
  ["banani", "বনানী", "bannani"],
  ["uttara", "উত্তরা", "utara"],
  ["dhaka", "ঢাকা", "dacca"],
];

// 2. Trigram similarity score (0.0 to 1.0)
export function getTrigramSimilarity(strA: string, strB: string): number {
  const a = strA.toLowerCase().trim();
  const b = strB.toLowerCase().trim();
  if (a === b) return 1.0;
  if (a.length === 0 || b.length === 0) return 0.0;
  if (b.includes(a) || a.includes(b)) return 0.85;

  const getTrigrams = (s: string): Set<string> => {
    const set = new Set<string>();
    const padded = ` ${s} `;
    for (let i = 0; i < padded.length - 2; i++) {
      set.add(padded.substring(i, i + 3));
    }
    return set;
  };

  const trigramsA = getTrigrams(a);
  const trigramsB = getTrigrams(b);
  let intersection = 0;
  trigramsA.forEach((tri) => {
    if (trigramsB.has(tri)) intersection++;
  });

  return (2 * intersection) / (trigramsA.size + trigramsB.size);
}

// 3. Main search function with pg_trgm style similarity & didYouMean
export function searchInstitutions(
  list: InstitutionItem[],
  query: string,
  selectedCategory: string = "ALL"
): SearchResult {
  const q = query.toLowerCase().trim();

  // First filter by category
  const inCategory = list.filter((inst) => {
    if (selectedCategory === "ALL") return true;
    if (inst.category === selectedCategory) return true;
    if (selectedCategory.includes("Healthcare") && inst.category.includes("Healthcare")) return true;
    if (selectedCategory.includes("Land") && inst.category.includes("Land")) return true;
    return false;
  });

  if (!q) {
    return { matches: inCategory };
  }

  // Tokenize query into words
  const queryTokens = q.split(/\s+/).filter(Boolean);

  // Expand tokens with synonyms
  const expandedTokens = queryTokens.flatMap((token) => {
    const group = SYNONYM_GROUPS.find((g) =>
      g.some((word) => word.toLowerCase() === token || getTrigramSimilarity(word, token) > 0.75)
    );
    return group ? [token, ...group] : [token];
  });

  const scored: { inst: InstitutionItem; score: number }[] = inCategory.map((inst) => {
    const targetString = `${inst.name} ${inst.nameBn || ""} ${inst.category} ${inst.address} ${inst.id}`.toLowerCase();

    // 1. Direct substring match (highest score)
    if (targetString.includes(q)) {
      return { inst, score: 1.0 };
    }

    // 2. Token AND match (all search tokens or their synonyms present in targetString)
    const allTokensMatch = queryTokens.every((token) => {
      const isDirect = targetString.includes(token);
      const isSynonym = expandedTokens.some((syn) => targetString.includes(syn));
      return isDirect || isSynonym;
    });

    if (allTokensMatch) {
      return { inst, score: 0.9 };
    }

    // 3. Trigram similarity matching across words
    let maxSim = getTrigramSimilarity(q, inst.name);
    if (inst.nameBn) {
      maxSim = Math.max(maxSim, getTrigramSimilarity(q, inst.nameBn));
    }
    maxSim = Math.max(maxSim, getTrigramSimilarity(q, inst.category));

    // Also check word-by-word trigram similarity for typos
    const words = targetString.split(/\s+/);
    queryTokens.forEach((qt) => {
      words.forEach((w) => {
        maxSim = Math.max(maxSim, getTrigramSimilarity(qt, w) * 0.85);
      });
    });

    // Bonus if any synonym appears in targetString
    const hasSynonym = expandedTokens.some((syn) => targetString.includes(syn));
    if (hasSynonym) {
      maxSim = Math.max(maxSim, 0.7);
    }

    return { inst, score: maxSim };
  });

  // Filter matches above similarity threshold (0.28)
  const matches = scored
    .filter((item) => item.score >= 0.28)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.inst);

  // Determine "Did you mean X?" if no exact substring match but good similarity
  let didYouMean: string | undefined = undefined;
  if (q.length >= 2 && matches.length > 0) {
    const best = scored.reduce((prev, curr) => (curr.score > prev.score ? curr : prev), scored[0]);
    // If top match isn't a 1.0 perfect substring match, but score >= 0.45, suggest its Bangla or English name
    if (best && best.score < 1.0 && best.score >= 0.45) {
      const bestName = best.inst.nameBn || best.inst.name;
      if (bestName.toLowerCase() !== q) {
        didYouMean = bestName;
      }
    }
  }

  return { matches, didYouMean };
}
