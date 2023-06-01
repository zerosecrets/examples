import { getOpenAIClient } from './getOpenAIClient.js';

const UNKNOWN_CATEGORY = 'Unknown';

export async function getPaymentCategory(
  serviceDescription: string
): Promise<string> {
  const prompt =
    `An invoice was received for the following service. ` +
    `Tell me the category of the service. ` +
    `Give me only the category so I can copy paste.\n\n` +
    `Service: ${serviceDescription}`;

  const openai = await getOpenAIClient();

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt,
    temperature: 0.5,
    max_tokens: 100,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });

  if (response.status >= 400) {
    throw new Error(
      `OpenAI returned an error status code: ${response.status}.`
    );
  }

  if (response.data.choices.length === 0) {
    return UNKNOWN_CATEGORY;
  }

  const choice = response.data.choices[0];
  const text = choice.text?.trim();

  if (!text) {
    return UNKNOWN_CATEGORY;
  }

  return text;
}
