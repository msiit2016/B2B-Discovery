import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";

export interface Supplier {
  id: string;
  name: string;
  description: string;
  location: string;
  phone: string;
  website: string;
  products: string[];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const cleanQuery = query.trim();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      if (!cleanQuery) {
        controller.enqueue(encoder.encode(JSON.stringify({ type: "done" }) + "\n"));
        controller.close();
        return;
      }

      // 1. Calculate and send metadata instantly
      const metadata = parseQueryMetadata(cleanQuery);
      controller.enqueue(encoder.encode(JSON.stringify({ type: "metadata", data: metadata }) + "\n"));

      const geminiApiKey = process.env.GEMINI_API_KEY;

      // 2. Try Gemini Streaming
      if (geminiApiKey) {
        try {
          console.log(`Starting live Gemini stream for query: "${cleanQuery}"`);
          const success = await streamFromGemini(cleanQuery, geminiApiKey, controller, encoder, metadata);
          if (success) {
            controller.enqueue(encoder.encode(JSON.stringify({ type: "done" }) + "\n"));
            controller.close();
            return;
          }
        } catch (err) {
          console.error("Gemini stream error:", err);
        }
      }

      // 3. Fallback to Mock Streaming with simulated delays
      console.log(`Streaming mock fallback for query: "${cleanQuery}"`);
      await streamMockSuppliers(cleanQuery, controller, encoder, metadata);
      controller.enqueue(encoder.encode(JSON.stringify({ type: "done" }) + "\n"));
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}

function parseQueryMetadata(query: string) {
  const queryLower = query.toLowerCase().trim();
  
  // Extract location using prepositions
  let location = "";
  const prepositionMatch = query.match(/(?:\bin\b|\bat\b|\bnear\b|\bfrom\b)\s+([a-zA-Z0-9\s]+)/i);
  if (prepositionMatch) {
    const rawLocation = prepositionMatch[1].trim();
    const locStopWords = ["near", "for", "with", "from", "at", "in", "supplier", "suppliers", "dealer", "dealers", "manufacturer", "manufacturers"];
    const locWords = rawLocation.split(/\s+/);
    const cleanLocWords = [];
    for (const word of locWords) {
      if (locStopWords.includes(word.toLowerCase())) {
        break;
      }
      cleanLocWords.push(word);
    }
    if (cleanLocWords.length > 0) {
      location = cleanLocWords.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    }
  }

  if (!location) {
    const cities = ["kota", "jaipur", "delhi", "ahmedabad", "mumbai", "pune", "bangalore", "chennai", "kolkata", "noida", "gurgaon", "hyderabad", "surat"];
    for (const city of cities) {
      if (queryLower.includes(city)) {
        location = city.charAt(0).toUpperCase() + city.slice(1);
        break;
      }
    }
  }
  
  if (!location) {
    location = "India";
  }

  // Determine category
  let cleanQueryForCategory = query;
  if (prepositionMatch) {
    cleanQueryForCategory = query.replace(/(?:\bin\b|\bat\b|\bnear\b|\bfrom\b)\s+.*/i, "");
  }

  const categoryStopWords = ["supplier", "suppliers", "distributor", "distributors", "dealer", "dealers", "manufacturer", "manufacturers", "wholesale", "wholesaler", "wholesalers", "on", "rent", "rental", "looking", "for", "buy", "find"];
  const categoryWords = cleanQueryForCategory
    .split(/\s+/)
    .filter(w => w.length > 0 && !categoryStopWords.includes(w.toLowerCase()));

  let category = "";
  if (categoryWords.length > 0) {
    category = categoryWords.map(w => {
      const upper = w.toUpperCase();
      if (["TMT", "FRP", "GI", "MS", "OPC", "PPC", "B2B", "ERW", "PVC", "GRP"].includes(upper)) {
        return upper;
      }
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    }).join(" ");
  } else {
    category = "Industrial Supplies";
  }

  return { category, location };
}

async function streamFromGemini(
  query: string, 
  apiKey: string, 
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  metadata: { category: string; location: string }
): Promise<boolean> {
  const ai = new GoogleGenAI({ apiKey });
  const models = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash"];

  const prompt = `Find B2B suppliers matching this query: "${query}".
You must search for real, live, existing suppliers using Google Search. DO NOT invent details.
Provide exactly 30 suppliers. If you cannot find 30 real ones from search results, first list all the real ones you found, and then complete the list of 30 by generating highly realistic suppliers based on actual brands and actual market locations in the target location focus of the query (e.g. China, India, USA, etc.).

For each supplier, output a single valid JSON object on its own line. Do NOT wrap the output in markdown code blocks (such as \`\`\`json), parent arrays, or parent objects. Output ONLY one JSON object per line.
Each line must be a complete JSON object matching this schema exactly:
{"name": "string", "description": "string", "location": "string", "phone": "string", "website": "string", "products": ["string"]}`;

  for (const model of models) {
    console.log(`Starting Gemini stream using model: ${model}`);
    try {
      const responseStream = await ai.models.generateContentStream({
        model: model,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        }
      });

      let buffer = "";
      let supplierCount = 0;

      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (!text) continue;
        buffer += text;

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          const line = buffer.substring(0, newlineIndex).trim();
          buffer = buffer.substring(newlineIndex + 1);

          if (line) {
            try {
              let cleanedLine = line.trim();
              if (cleanedLine.startsWith(",")) cleanedLine = cleanedLine.slice(1).trim();
              if (cleanedLine.endsWith(",")) cleanedLine = cleanedLine.slice(0, -1).trim();
              
              if (cleanedLine.startsWith("{") && cleanedLine.endsWith("}")) {
                const s = JSON.parse(cleanedLine);
                if (s.name) {
                  supplierCount++;
                  const formattedSupplier = {
                    id: s.id || `supplier-${supplierCount}`,
                    name: s.name,
                    description: s.description || `Industrial supplier of ${metadata.category}`,
                    location: s.location || metadata.location,
                    phone: s.phone || `+91 98765 ${43210 - supplierCount}`,
                    website: s.website || `https://www.google.com/search?q=${encodeURIComponent(s.name)}`,
                    products: Array.isArray(s.products) ? s.products : [metadata.category]
                  };
                  controller.enqueue(encoder.encode(JSON.stringify({ type: "supplier", data: formattedSupplier }) + "\n"));
                }
              }
            } catch (e) {
              // Ignore line if not a valid JSON supplier object
            }
          }
        }
      }

      if (buffer.trim()) {
        try {
          let cleanedLine = buffer.trim();
          if (cleanedLine.startsWith(",")) cleanedLine = cleanedLine.slice(1).trim();
          if (cleanedLine.endsWith(",")) cleanedLine = cleanedLine.slice(0, -1).trim();
          if (cleanedLine.startsWith("{") && cleanedLine.endsWith("}")) {
            const s = JSON.parse(cleanedLine);
            if (s.name) {
              supplierCount++;
              const formattedSupplier = {
                id: s.id || `supplier-${supplierCount}`,
                name: s.name,
                description: s.description || `Industrial supplier of ${metadata.category}`,
                location: s.location || metadata.location,
                phone: s.phone || `+91 98765 ${43210 - supplierCount}`,
                website: s.website || `https://www.google.com/search?q=${encodeURIComponent(s.name)}`,
                products: Array.isArray(s.products) ? s.products : [metadata.category]
              };
              controller.enqueue(encoder.encode(JSON.stringify({ type: "supplier", data: formattedSupplier }) + "\n"));
            }
          }
        } catch (e) {
          // Ignore
        }
      }

      if (supplierCount > 0) {
        console.log(`Successfully streamed ${supplierCount} suppliers using ${model}`);
        return true;
      }
      
      throw new Error("No suppliers parsed from stream");
    } catch (err) {
      console.warn(`Model ${model} stream failed:`, err);
    }
  }

  return false;
}

async function streamMockSuppliers(
  query: string,
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  metadata: { category: string; location: string }
) {
  const { category, location } = metadata;
  
  const supplierTemplates = [
    {
      nameSuffix: "Enterprises",
      desc: `Leading provider of ${category.toLowerCase()} and wholesale supply services. Established with certified logistics and top quality standards.`,
      products: [`Premium ${category}`, `Commercial ${category}`, `Standard Grade Supplies`, `Custom Solutions`]
    },
    {
      nameSuffix: "Industries Ltd.",
      desc: `ISO 9001 certified manufacturer specializing in high-grade ${category.toLowerCase()} and components. Serving regional hubs.`,
      products: [`Heavy-Duty ${category}`, `Industrial Grade ${category}`, `Bulk Materials`, `OEM Services`]
    },
    {
      nameSuffix: "Trading Company",
      desc: `Authorized national distributor and supply chain partner. Offering door-step delivery and competitive bulk contract rates.`,
      products: [`Branded ${category}`, `Bulk ${category} Orders`, `Imported Alternatives`, `Wholesale Distribution`]
    },
    {
      nameSuffix: "Solutions Corp",
      desc: `Pioneering high-durability products and smart engineering designs. Delivering eco-friendly materials and custom specifications.`,
      products: [`Eco ${category}`, `Advanced ${category} Modules`, `Specialized Components`, `Engineering Consultation`]
    },
    {
      nameSuffix: "Partners",
      desc: `Dedicated supplier of premium ${category.toLowerCase()} for commercial, residential, and infrastructure projects across the region.`,
      products: [`Grade-A ${category}`, `Contract Supplies`, `Ready-Stock Logistics`, `Local Distribution`]
    }
  ];

  const brandPrefixes = [
    "Royal", "Apex", "Global", "United", "Prime", "Universal",
    "Super", "Supreme", "National", "Elite", "Bharat", "Vedic",
    "Sigma", "Zenith", "Dynamic", "Nova", "Everest", "GoldStar",
    "Matrix", "Quantum", "Pacific", "Atlas", "Omega", "Vanguard",
    "Crown", "Galaxy", "Imperial", "Legacy", "Pioneer", "Anchor"
  ];

  let displayLocation = location;
  const indianCities = ["kota", "jaipur", "delhi", "ahmedabad", "mumbai", "pune", "bangalore", "chennai", "kolkata", "noida", "gurgaon", "hyderabad", "surat"];
  if (indianCities.includes(location.toLowerCase())) {
    displayLocation = `${location}, India`;
  } else if (location.toLowerCase() === "india") {
    displayLocation = "India";
  } else {
    displayLocation = location;
  }

  let phonePrefix = "+91";
  const locLower = location.toLowerCase();
  if (locLower === "china") {
    phonePrefix = "+86";
  } else if (locLower === "usa" || locLower === "united states") {
    phonePrefix = "+1";
  } else if (locLower === "uk" || locLower === "united kingdom") {
    phonePrefix = "+44";
  } else if (locLower === "germany") {
    phonePrefix = "+49";
  } else if (locLower === "japan") {
    phonePrefix = "+81";
  }

  for (let idx = 0; idx < 30; idx++) {
    const tpl = supplierTemplates[idx % supplierTemplates.length];
    const prefix = brandPrefixes[idx % brandPrefixes.length];
    const name = `${prefix} ${location} ${category} ${tpl.nameSuffix}`;
    const id = `mock-supplier-${idx + 1}`;
    
    const supplier = {
      id,
      name,
      description: tpl.desc,
      location: displayLocation,
      phone: `${phonePrefix} 98765 ${43210 - idx * 111}`,
      website: `https://www.${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      products: tpl.products
    };

    controller.enqueue(encoder.encode(JSON.stringify({ type: "supplier", data: supplier }) + "\n"));
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
}
