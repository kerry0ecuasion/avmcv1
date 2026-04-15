const BACKEND_API_ENDPOINT = '/api/chat';

export async function sendMessageToAPI(message: string): Promise<string> {
  const url = `${BACKEND_API_ENDPOINT}?provider=gemini`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Backend error');
  }
  return data.reply || 'I apologize, but I could not process your request.';
}
