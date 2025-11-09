import { NextApiRequest, NextApiResponse } from 'next';

// Simulated AI responses (in production, use OpenAI API)
function generateAIResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  // Financing questions
  if (lowerMessage.includes('finance') || lowerMessage.includes('loan') || lowerMessage.includes('payment')) {
    return "💰 For financing, I recommend checking our Calculator page! You can compare different lenders and see monthly payments based on your credit score. Most Toyota buyers qualify for 3-5% APR with good credit.";
  }
  
  // Hybrid questions
  if (lowerMessage.includes('hybrid') || lowerMessage.includes('fuel efficient')) {
    return "🌱 Great choice! Our best hybrid options are the RAV4 Hybrid (SUV, ~40 MPG), Prius (Sedan, ~55 MPG), and Sienna Hybrid (Minivan, ~36 MPG). Hybrids save you $800-1200/year on gas compared to conventional engines.";
  }
  
  // Family car questions
  if (lowerMessage.includes('family') || lowerMessage.includes('kids') || lowerMessage.includes('safe')) {
    return "👨‍👩‍👧‍👦 For families, I'd suggest the Highlander (3-row SUV, seats 8), RAV4 (compact SUV, great safety ratings), or Sienna (minivan, most space). All have Toyota Safety Sense standard!";
  }
  
  // Electric questions
  if (lowerMessage.includes('electric') || lowerMessage.includes('ev') || lowerMessage.includes('bz4x')) {
    return "⚡ The bZ4X is Toyota's all-electric SUV! It has ~250 miles range, charges in 1 hour (DC fast), and qualifies for federal tax credits. Perfect for eco-conscious buyers who can charge at home.";
  }
  
  // Truck questions
  if (lowerMessage.includes('truck') || lowerMessage.includes('tacoma') || lowerMessage.includes('towing')) {
    return "🚚 The Tacoma is our mid-size truck! It can tow up to 6,800 lbs, has excellent off-road capability with TRD Pro trim, and holds value better than any other truck. Great for work or adventure!";
  }
  
  // Budget questions
  if (lowerMessage.includes('cheap') || lowerMessage.includes('affordable') || lowerMessage.includes('budget')) {
    return "💵 Our most affordable options are the Prius ($28k), Corolla ($25k-30k), and used RAV4s. All come with legendary Toyota reliability, so you'll save on repairs too. Check our Filter page for cars under $30k!";
  }
  
  // Comparison questions
  if (lowerMessage.includes('compare') || lowerMessage.includes('difference') || lowerMessage.includes('vs')) {
    return "📊 Use our Compare page! You can select up to 3 cars and see side-by-side specs, pricing, and fuel economy. It makes deciding much easier!";
  }
  
  // General help
  return "👋 I'm here to help! I can answer questions about:\n• Financing & monthly payments\n• Hybrid vs gas vehicles\n• Best cars for families\n• Electric vehicle options\n• Budget-friendly choices\n• Comparing different models\n\nWhat would you like to know?";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message required' });
    }

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const response = generateAIResponse(message);
    
    res.status(200).json({
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'AI chat failed' });
  }
}
