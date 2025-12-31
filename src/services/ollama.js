async function checkOllamaConnection() {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    return response.ok;
  } catch {
    return false;
  }
}

async function sendToOllama(goal, model = 'llama3.1') {
    console.log(`Sending to Ollama `);
  const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt: goal, stream: false })
    });
    console.log(`end Sending to Ollama `);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const text = data.response;

  const steps = text
    .split(/\n+/)
    .map(s => s.trim())
    .filter(str => str.length);

  return steps;
}

module.exports = {
  sendToOllama,
  checkOllamaConnection
};
