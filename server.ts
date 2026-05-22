import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { products } from "./src/catalog";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client safely
const isApiKeyConfigured = !!process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (isApiKeyConfigured) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("GEMINI_API_KEY is not configured in environment variables. Running in mock AI mode.");
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Get products list
app.get("/api/products", (req, res) => {
  res.json({ success: true, products });
});

// 2. AI Stylist Chatbot Route
app.post("/api/gemini/chatbot", async (req, res) => {
  const { messages, userProfile } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages array" });
  }

  // Fallback if AI key is missing
  if (!ai) {
    const lastMsg = messages[messages.length - 1]?.text || "";
    let reply = "Hello! I am your luxury styling assistant at DRIPLY. Since our server's live AI engine is currently initializing, let me tell you that your selection looks immaculate! I highly recommend coordinating the **AURA Velvet Bomber** with heavy knit loungewear.";
    let recommendedProducts: string[] = ["drip-001"];

    if (lastMsg.toLowerCase().includes("pants") || lastMsg.toLowerCase().includes("cargo")) {
      reply = "An excellent choice! Combining structural military tailoring with high-fashion hardware is incredibly on-trend. The **PHANTOM Chrome-Plated Cargo Pants** would drape beautifully with low-profile runners.";
      recommendedProducts = ["drip-004"];
    } else if (lastMsg.toLowerCase().includes("gown") || lastMsg.toLowerCase().includes("evening") || lastMsg.toLowerCase().includes("dress")) {
      reply = "Dazzling! The **SIREN Liquid Gold Evening Gown** makes a sensational statement. Accent it with minimalist gold link chains for a complete red-carpet look.";
      recommendedProducts = ["drip-006", "drip-007"];
    } else if (lastMsg.toLowerCase().includes("shoes") || lastMsg.toLowerCase().includes("boots") || lastMsg.toLowerCase().includes("footwear")) {
      reply = "Footwear dictates the attitude of the whole draft. Our **APEX Tech-Combat Boots** add distinct structure, while the **VORTEX Mesh Runners** balance comfort with high-contrast luxury vibes.";
      recommendedProducts = ["drip-005", "drip-008"];
    }

    return res.json({
      success: true,
      text: reply,
      recommendedProducts
    });
  }

  try {
    // Format conversation history for Gemini
    const systemPrompt = `You are "DRIPLY AI Stylist", an ultra-premium, high-fashion Parisian boutique stylist and fashion director. 
You speak with absolute confidence, elegance, and extreme polish (inspired by Vogue, high end luxury brands like Zara, Nike, and custom couture houses).
Introduce yourself with a brief luxury flourish if it's the start, and keep your advice concise, addictive, and focused on helping the customer assemble the perfect set of items.

We carry the following luxury clothing items. You MUST reference their exact catalog ids and names when recommending products.
Catalog:
${products.map(p => `- ID: "${p.id}", Name: "${p.name}", Brand: "${p.brand}", Price: $${p.price}, Material/Description: ${p.description}`).join('\n')}

Guide the customer towards completing checkout with high-value styling pairs (e.g. matching a jacket with coordinates or premium jewelry).
Your output must be returned as a JSON object matching this schema:
{
  "text": "Your professional stylist advice in elegant, conversational, markdown format designed to excite and convert.",
  "recommendedProducts": ["drip-001", "drip-003"] // string array of catalog IDs that match your advice (max 2-3 matching items)
}`;

    // Make API call using the recommended gemini-3.5-flash
    const userMessageHistory = messages.map(m => `${m.sender === 'user' ? 'Customer' : 'Stylist'}: ${m.text}`).join('\n');
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `UserProfile: ${JSON.stringify(userProfile || {})} \nConversation History:\n${userMessageHistory}\n\nDeliver your response as the requested JSON object containing "text" and "recommendedProducts".`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: "The luxury styling advice in markdown format. Highlight fashion words in bold gold colors or elegant tones."
            },
            recommendedProducts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of product IDs recommended from the catalog."
            }
          },
          required: ["text", "recommendedProducts"]
        }
      }
    });

    const bodyText = response.text || "{}";
    const answer = JSON.parse(bodyText.trim());
    return res.json({
      success: true,
      text: answer.text,
      recommendedProducts: answer.recommendedProducts || []
    });

  } catch (error) {
    console.error("Gemini API Error in Stylist chatbot:", error);
    res.status(500).json({
      success: false,
      text: "Forgive me, my styling connection is momentarily fluctuating. I advise keeping your focus on our timeless AURA Bomber and heavy knit staples in the meantime.",
      recommendedProducts: ["drip-001"]
    });
  }
});

// 3. AI Smart Outfit Recomendations Route
app.post("/api/gemini/recommendations", async (req, res) => {
  const { cartItems, wishlistIds, weatherPreference } = req.body;

  if (!ai) {
    // Return smart pre-crafted suggestions
    return res.json({
      success: true,
      reasoning: "We've styled a premium look pairing street couture with modern comfort. The gold hardware trims seamlessly match our active monogram elements.",
      suggestions: products.slice(0, 3)
    });
  }

  try {
    const prompt = `Cart Items: ${JSON.stringify(cartItems || [])}
Wishlist Items: ${JSON.stringify(wishlistIds || [])}
Context/Occasion preference: ${weatherPreference || 'Casual Premium Lux'}

Catalog of available products:
${products.map(p => `- ID: "${p.id}", Name: "${p.name}", Price: $${p.price}, Description: ${p.description}`).join('\n')}

Output a personalized styling recommendation report in JSON:
{
  "reasoning": "A short, highly persuasive luxury styling narrative on why these items form a divine attire set.",
  "recommendedIds": ["drip-002", "drip-005"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the head of collection design at DRIPLY. Formulate ultra-premium custom suggestions.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reasoning: { type: Type.STRING },
            recommendedIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["reasoning", "recommendedIds"]
        }
      }
    });

    const data = JSON.parse((response.text || "{}").trim());
    const matchedProducts = products.filter(p => (data.recommendedIds || []).includes(p.id));

    res.json({
      success: true,
      reasoning: data.reasoning || "An immaculate configuration crafted by DRIPLY AI.",
      suggestions: matchedProducts.length > 0 ? matchedProducts : products.slice(1, 3)
    });
  } catch (error) {
    console.error("Gemini Recommendations Error:", error);
    res.json({
      success: true,
      reasoning: "A coordinated selection of heavy luxury hoodies with combat detailing to ground your contemporary layout.",
      suggestions: products.slice(0, 2)
    });
  }
});

// 4. Smart Fashion Search Suggestions Route
app.get("/api/gemini/search-suggestions", async (req, res) => {
  const query = req.query.q as string || "";
  if (!query) return res.json({ suggestions: [] });

  let results = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.description.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  return res.json({
    success: true,
    suggestions: results.slice(0, 4)
  });
});

// 5. Simulated Payment Gateways (Stripe + Mobile Money)
app.post("/api/payments/checkout", (req, res) => {
  const { amount, method, paymentNumber, cartItems, billingDetails } = req.body;

  if (!amount || !method) {
    return res.status(400).json({ error: "Missing amount or payment method" });
  }

  // Generate a premium random transaction / order number
  const orderId = `DRIP-${Math.floor(100000 + Math.random() * 900000)}`;

  // Simulate carrier check/bank auth latency
  setTimeout(() => {
    if (method === 'card') {
      res.json({
        success: true,
        orderId,
        paymentStatus: "success",
        message: "Stripe transaction authorized successfully. Charge captured under DRIPLY LUXURY PORTFOLIO.",
        gatewayResponse: {
          transactionId: `ch_${Math.random().toString(36).substring(2, 11)}`,
          receipt_url: "https://stripe.com/receipt"
        }
      });
    } else if (method === 'airtel' || method === 'mtn') {
      // Validate mobile money numbers generally start with operator prefix (simulated)
      if (!paymentNumber || paymentNumber.length < 8) {
        return res.status(400).json({
          success: false,
          error: "Invalid Mobile Money account number format. Please check your credentials."
        });
      }

      res.json({
        success: true,
        orderId,
        paymentStatus: "success",
        message: `Simulated USD $${amount} payment successful. ${method.toUpperCase()} Mobile Money USSD PIN prompt approved under transaction tag Ref-${Math.floor(1000000 + Math.random() * 9000000)}.`,
        gatewayResponse: {
          operatorRef: `TXN-${method.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
          carrierMessage: "A confirmation SMS has been dispatched to your mobile carrier."
        }
      });
    } else {
      res.status(400).json({ error: "Unknown payment channel" });
    }
  }, 1200);
});

// 6. Admin Analytics
app.get("/api/admin/analytics", (req, res) => {
  res.json({
    revenueData: [
      { month: "Jan", sales: 12400 },
      { month: "Feb", sales: 18900 },
      { month: "Mar", sales: 25400 },
      { month: "Apr", sales: 31200 },
      { month: "May", sales: 44800 }
    ],
    categoryShare: [
      { name: "Outerwear", value: 45 },
      { name: "Pants", value: 20 },
      { name: "Footwear", value: 20 },
      { name: "Streetwear", value: 15 }
    ],
    salesSummary: {
      totalRevenue: 132700,
      monthlyGrowth: "+24.5%",
      totalOrders: 642,
      activeUsers: 1840,
      loyaltyDisbursed: 42000
    }
  });
});

// ----------------------------------------------------
// VITE OR STATIC SERVING MIDDLEWARE
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Dynamically import Vite server in development
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware connected.");
  } else {
    // Serve production static assets safely from '/dist'
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DRIPLY full-stack luxury system active on http://localhost:${PORT}`);
  });
}

startServer();
