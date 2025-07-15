import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'your-openai-api-key',
  dangerouslyAllowBrowser: true
});

export interface CountryDescriptions {
  landmarks: string;
  cuisine: string;
  culture: string;
}

export const aiService = {
  async generateCountryDescriptions(countryName: string): Promise<CountryDescriptions> {
    try {
      const prompt = `Generate detailed, engaging descriptions for ${countryName} in the following categories. Each description should be 2-3 sentences long and educational:

1. Famous Landmarks: Describe the most iconic landmarks, monuments, or natural wonders
2. Traditional Cuisine: Describe the food culture, signature dishes, and culinary traditions
3. Cultural Highlights: Describe unique cultural aspects, traditions, festivals, or customs

Respond with JSON in this exact format:
{
  "landmarks": "description here",
  "cuisine": "description here", 
  "culture": "description here"
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a knowledgeable travel and culture expert. Provide accurate, engaging descriptions that would help someone learn about a country's landmarks, food, and culture."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 800,
        temperature: 0.7
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      const descriptions = JSON.parse(content);
      
      return {
        landmarks: descriptions.landmarks || 'Discover the remarkable landmarks that define this country\'s landscape and heritage.',
        cuisine: descriptions.cuisine || 'Experience the unique flavors and culinary traditions that make this country\'s food culture special.',
        culture: descriptions.culture || 'Explore the rich cultural traditions and customs that shape daily life in this fascinating country.'
      };
    } catch (error) {
      console.error('Error generating AI descriptions:', error);
      
      // Fallback descriptions
      return {
        landmarks: `Discover the remarkable landmarks that define ${countryName}'s landscape and heritage.`,
        cuisine: `Experience the unique flavors and culinary traditions that make ${countryName}'s food culture special.`,
        culture: `Explore the rich cultural traditions and customs that shape daily life in ${countryName}.`
      };
    }
  }
};