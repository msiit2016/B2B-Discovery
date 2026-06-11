"use server";

import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

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
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    return { category: "", location: "", suppliers: [] };
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  // 1. Try Gemini API if configured
  if (geminiApiKey) {
    try {
      console.log("Using Gemini API for B2B supplier discovery...");
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `Act as a B2B supplier discovery engine.
For the query below:
${cleanQuery}

Generate supplier information matching the schema:
{
  "category": "string",
  "location": "string",
  "suppliers": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "location": "string",
      "phone": "string",
      "website": "string",
      "products": ["string"]
    }
  ]
}

Return exactly 30 suppliers. Make sure they have realistic names, descriptions, locations matching the query, phone numbers, valid-looking websites, and list 3-5 specific products they offer.`,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini");
      }

      const data = JSON.parse(text) as SearchResult;
      
      // Quick validation
      if (!data.suppliers || !Array.isArray(data.suppliers)) {
        throw new Error("Invalid response format: 'suppliers' field must be an array");
      }

      // Ensure IDs exist
      data.suppliers = data.suppliers.map((s, idx) => ({
        ...s,
        id: s.id || `supplier-${idx + 1}`
      }));

      return data;
    } catch (error) {
      console.error("Gemini API Search Error:", error);
      if (openaiApiKey && openaiApiKey !== "your_openai_api_key_here") {
        console.log("Gemini failed. Cascading down to OpenAI...");
      } else {
        console.warn("Gemini failed and no valid OpenAI key found. Falling back to mock data.");
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
      
      // Quick validation
      if (!data.suppliers || !Array.isArray(data.suppliers)) {
        throw new Error("Invalid response format: 'suppliers' field must be an array");
      }

      // Ensure IDs exist
      data.suppliers = data.suppliers.map((s, idx) => ({
        ...s,
        id: s.id || `supplier-${idx + 1}`
      }));

      return data;
    } catch (error) {
      console.error("OpenAI API Search Error:", error);
      console.warn("OpenAI also failed. Falling back to mock data.");
    }
  }

  // 3. Fallback to mock data generator if no API keys are present
  console.warn("No AI API Keys are configured. Falling back to local mock data generator.");
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return generateMockSuppliers(cleanQuery);
}

// Mock generator for offline/unconfigured testing
function generateMockSuppliers(query: string): SearchResult {
  const queryLower = query.toLowerCase();
  
  // Extract location / category keywords from query
  let category = "Industrial Goods";
  let location = "India";

  if (queryLower.includes("tmt bar") || queryLower.includes("tmt")) {
    category = "TMT Steel Bars";
  } else if (queryLower.includes("cement")) {
    category = "Cement & Construction Materials";
  } else if (queryLower.includes("pipe") || queryLower.includes("steel")) {
    category = "Steel Pipes & Tubes";
  } else if (queryLower.includes("frp tank") || queryLower.includes("tank")) {
    category = "FRP Industrial Tanks";
  }

  // Location detection
  const cities = ["kota", "jaipur", "delhi", "ahmedabad", "mumbai", "pune", "bangalore", "chennai", "kolkata", "noida", "gurgaon"];
  let detectedLocation = "";
  for (const city of cities) {
    if (queryLower.includes(city)) {
      detectedLocation = city.charAt(0).toUpperCase() + city.slice(1);
      break;
    }
  }

  if (detectedLocation) {
    location = detectedLocation;
  } else {
    // If no city matches, use default
    location = "Rajasthan";
  }

  // List of mock company name segments based on category
  const supplierTemplates = [
    {
      nameSuffix: "Enterprises",
      desc: "Leading manufacturer and wholesale distributor of heavy industrial products. Established in 2010 with state-of-the-art testing facilities.",
      products: ["Heavy Duty Products", "Standard Materials", "Custom Fabrications", "OEM Services"]
    },
    {
      nameSuffix: "Industries Ltd.",
      desc: "ISO 9001:2015 certified company specializing in premium grade raw materials and fabrication services. Catering to national infrastructure projects.",
      products: ["Premium Supplies", "Bulk Orders", "Structural Solutions", "Raw Elements"]
    },
    {
      nameSuffix: "Steel & Alloys",
      desc: "Top-tier supplier of metal castings, rolled products, and specialized reinforcements. Known for prompt delivery and strict quality compliance.",
      products: ["Grade-A Reinforcements", "Custom Sections", "Alloy Components", "Bulk Logistics"]
    },
    {
      nameSuffix: "Solutions Corp",
      desc: "Pioneering technological integrations in manufacturing. Supplying high-durability items for residential and commercial development projects.",
      products: ["Smart Materials", "Pre-fabricated Modules", "Eco-friendly Components", "Design Consultation"]
    },
    {
      nameSuffix: "Trading Company",
      desc: "Authorized dealer and supply chain partner for leading global brands. Providing door-step delivery and competitive bulk pricing options.",
      products: ["Branded Products", "Imported Alternates", "Ready Stock Supplies", "Wholesale Distribution"]
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
    const baseName = category.split(" ")[0] || "Industrial";
    const name = `${prefix} ${location} ${baseName} ${tpl.nameSuffix}`;
    const id = `mock-supplier-${idx + 1}`;
    
    // Custom products list
    const specificProducts = tpl.products.map(p => {
      if (category.includes("TMT")) return p.replace("Products", "TMT Rebars").replace("Materials", "Fe-550D Bars").replace("Fabrications", "Structural Rods").replace("Supplies", "Stirrups");
      if (category.includes("Cement")) return p.replace("Products", "OPC 53 Grade").replace("Materials", "PPC Cement").replace("Fabrications", "White Cement").replace("Supplies", "Rapid Hardening Cement");
      if (category.includes("Pipe")) return p.replace("Products", "GI Pipes").replace("Materials", "MS Seamless Tubes").replace("Fabrications", "ERW Steel Pipes").replace("Supplies", "PVC Fittings");
      if (category.includes("FRP")) return p.replace("Products", "Chemical Storage Tanks").replace("Materials", "Acid Storage FRP").replace("Fabrications", "Vertical FRP Vessels").replace("Supplies", "GRP Scrubbers");
      return p;
    });

    return {
      id,
      name,
      description: `[Result #${idx + 1}] ${tpl.desc}`,
      location: `${location}, India`,
      phone: `+91 98765 ${43210 - idx * 111}`,
      website: `https://www.${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      products: specificProducts
    };
  });

  return {
    category,
    location,
    suppliers
  };
}
