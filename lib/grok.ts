export async function askGrok(prompt: string, model: string = 'grok-4.7'): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_XAI_API_KEY || '';
  const baseURL = process.env.EXPO_PUBLIC_XAI_BASE_URL || 'https://api.x.ai/v1';

  if (!apiKey || apiKey === 'your-xai-api-key-here') {
    throw new Error('Please configure a valid EXPO_PUBLIC_XAI_API_KEY in your .env file.');
  }

  try {
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: 'You are an assistant for One Shepherd Channel.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Grok API Error (${response.status}): ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response returned from Grok.';
  } catch (error) {
    console.error('Error connecting to Grok API:', error);
    throw error;
  }
}
