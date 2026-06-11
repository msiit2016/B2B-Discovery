"use server";

import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { connection } from "next/server";

export interface Supplier {
  id: string;
  name: string;
  description: string;
  location: string;
  phone: string;
  website: string;
  products: string[];
}

export interface SearchResult {
  category: string;
  location: string;
  suppliers: Supplier[];
}

export async function searchSuppliers(query: string): Promise<SearchResult> {
  // Force this server action to run at request time — never serve from cache.
  // Per Next.js 16 docs, calling connection() opts out of static/cached execution.
  await connection();

  const cleanQuery = query.trim();
  if (!cleanQuery) {
    return { category: "", location: "", suppliers: [] };
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  // 1. Try Gemini API if configured
  if (geminiApiKey) {
    try {
      console.log("Starting Gemini API search with Google Search grounding...");
      const data = await searchWithGemini(cleanQuery, geminiApiKey);
      return data;
    } catch (error) {
      console.error("All Gemini API attempts failed:", error);
      if (openaiApiKey && openaiApiKey !== "your_openai_api_key_here") {
        console.log("Cascading down to OpenAI...");
      } else {
        console.warn("No valid OpenAI key found. Falling back to local dynamic mock data.");
      }
    }
  }

  // 2. Try OpenAI API if configured and key is valid
  const isValidOpenAIKey = openaiApiKey && openaiApiKey !== "your_openai_api_key_here";
  if (isValidOpenAIKey) {
    try {
      console.log("Using OpenAI API for B2B supplier discovery...");
      const openai = new OpenAI({ apiKey: openaiApiKey });
      const prompt = `Act as a B2B supplier discovery engine.
For the query below:
${cleanQuery}

Generate supplier information.
Return ONLY valid JSON matching the schema below. Do not wrap in markdown \`\`\`json blocks.

Schema:
{
  "category":"",
  "location":"",
  "suppliers":[
    {
      "id":"",
      "name":"",
      "description":"",
      "location":"",
      "phone":"",
      "website":"",
      "products":[]
    }
  ]
}

Return 30 suppliers. Make sure they have realistic names, descriptions, locations matching the query, phone numbers, valid-looking websites, and list 3-5 specific products they offer.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that only replies with structured B2B supplier data in raw JSON format. No markdown, no conversational text."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      const text = response.choices[0]?.message?.content;
      if (!text) {
        throw new Error("Empty response from OpenAI");
      }

      const data = JSON.parse(text) as SearchResult;
      
      if (!data.suppliers || !Array.isArray(data.suppliers)) {
        throw new Error("Invalid response format: 'suppliers' field must be an array");
      }

      data.suppliers = data.suppliers.map((s, idx) => ({
        ...s,
        id: s.id || `supplier-${idx + 1}`
      }));

      return data;
    } catch (error) {
      console.error("OpenAI API Search Error:", error);
      console.warn("OpenAI also failed. Falling back to local dynamic mock data.");
    }
  }

  // 3. Fallback to mock data generator if no API keys are present or all failed
  console.warn("Falling back to local query-intent-aware mock data generator.");
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return generateMockSuppliers(cleanQuery);
}

// Extract JSON block from LLM markdown response text
function extractJson(text: string): string {
  // Try to find markdown code block first
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) {
    return match[1].trim();
  }
  // Fallback: try to find first { and last }
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return text.substring(start, end + 1).trim();
  }
  return text.trim();
}

// Live search with Gemini with search grounding and retry logic
async function searchWithGemini(query: string, apiKey: string): Promise<SearchResult> {
  const ai = new GoogleGenAI({ apiKey });
  const models = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash"];
  
  const prompt = `Find B2B suppliers matching this query: "${query}".
You must search for real, live, existing suppliers using Google Search. DO NOT invent details.
Provide exactly 30 suppliers. If you cannot find 30 real ones from search results, first list all the real ones you found, and then complete the list of 30 by generating highly realistic suppliers based on actual brands and actual market locations in India.

Format your entire response as a single valid JSON object. Use markdown code block with \`\`\`json.
The JSON object must match this schema:
{
  "category": "string",
  "location": "string",
  "suppliers": [
    {
      "name": "string",
      "description": "string",
      "location": "string",
      "phone": "string",
      "website": "string",
      "products": ["string"]
    }
  ]
}`;

  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      console.log(`Gemini discovery attempt ${attempt} using model ${model} for query "${query}"...`);
      try {
        const response = await ai.models.generateContent({
          model: model,
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
          }
        });
        
        const text = response.text;
        if (!text) {
          throw new Error("Empty response from Gemini");
        }
        
        const jsonStr = extractJson(text);
        const data = JSON.parse(jsonStr) as SearchResult;
        
        if (!data.suppliers || !Array.isArray(data.suppliers)) {
          throw new Error("Invalid response format: 'suppliers' field must be an array");
        }
        
        // Ensure standard formatting, IDs, and valid values
        data.category = data.category || "General B2B";
        data.location = data.location || "India";
        data.suppliers = data.suppliers.map((s, idx) => ({
          id: s.id || `supplier-${idx + 1}`,
          name: s.name || "Unknown Supplier",
          description: s.description || `Industrial supplier of ${data.category}`,
          location: s.location || data.location,
          phone: s.phone || `+91 98765 ${43210 - idx}`,
          website: s.website || `https://www.google.com/search?q=${encodeURIComponent(s.name || "supplier")}`,
          products: Array.isArray(s.products) ? s.products : [data.category]
        }));
        
        console.log(`Successfully retrieved and parsed ${data.suppliers.length} suppliers from Gemini using ${model}`);
        return data;
      } catch (error: any) {
        console.error(`Attempt ${attempt} with model ${model} failed:`, error.message || error);
        lastError = error;
        // Wait before retry if not the absolute last attempt
        if (model !== models[models.length - 1] || attempt < 3) {
          const waitTime = attempt * 1500;
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
      }
    }
  }
  
  throw lastError || new Error("Gemini API search failed after trying all models");
}

// Mock generator for offline/unconfigured testing or complete fallback
function generateMockSuppliers(query: string): SearchResult {
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

  // Fallback to checking cities list if no preposition match
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

  // Determine category by stripping prepositions & location
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

  const suppliers: Supplier[] = Array.from({ length: 30 }).map((_, idx) => {
    const tpl = supplierTemplates[idx % supplierTemplates.length];
    const prefix = brandPrefixes[idx % brandPrefixes.length];
    const name = `${prefix} ${location} ${category} ${tpl.nameSuffix}`;
    const id = `mock-supplier-${idx + 1}`;
    
    return {
      id,
      name,
      description: tpl.desc,
      location: `${location}, India`,
      phone: `+91 98765 ${43210 - idx * 111}`,
      website: `https://www.${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      products: tpl.products
    };
  });

  return {
    category,
    location,
    suppliers
  };
}
