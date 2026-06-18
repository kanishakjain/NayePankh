// api/chat.js
// POST endpoint: proxies chat messages to Gemini, keeping the API key server-side.

const SYSTEM_CONTEXT = `You are "Pankh", the friendly AI assistant for NayePankh Foundation, a youth-led NGO in Uttar Pradesh, India.

About NayePankh:
- Provides food distribution, education access (school supplies, uniforms), menstrual health awareness and free sanitary pads, and clothing drives to underprivileged communities.
- Started during the Covid lockdown as a small relief effort, now one of India's largest student-led NGOs.
- Over 200,000 people helped so far.
- Entirely run by student volunteers.
- Registered under the Indian Societies Act, UP Govt registered, 12A and 80G certified (donations are tax-deductible).
- Based in Kanpur, Uttar Pradesh.

How to help:
- Volunteering: direct people to the Volunteer page to fill out the registration form. No experience needed.
- Donating: donations are 80G tax-deductible; direct people to the Contact/Donate page or email contact@nayepankh.com.
- Questions about programs: explain using the info above.
- General questions unrelated to NayePankh: answer briefly and helpfully, but try to steer back to how NayePankh or volunteering/donating might be relevant if it makes sense naturally. Don't force it.
- Keep answers concise (2-4 sentences) and warm in tone. This is a chat widget on a website, not an essay.`;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const contents = [
      ...(Array.isArray(history) ? history : []),
      { role: 'user', parts: [{ text: message }] },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: SYSTEM_CONTEXT }] },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(502).json({ error: 'AI service error. Please try again.' });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(502).json({ error: 'No response from AI. Please try again.' });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat handler failed:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};
