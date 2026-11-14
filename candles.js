// Vercel serverless function. Keep TWELVE_DATA_API_KEY in Vercel Environment Variables.
const ALLOWED_SYMBOLS = new Set([
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD',
  'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY'
]);

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=20');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'শুধু GET অনুরোধ গ্রহণ করা হয়।' });
  }

  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'সার্ভারে API Key সেট করা হয়নি।' });

  const symbol = String(req.query.symbol || 'EUR/USD').toUpperCase();
  const interval = String(req.query.interval || '1min');
  if (!ALLOWED_SYMBOLS.has(symbol)) return res.status(400).json({ error: 'এই Forex pair এখন অনুমোদিত নয়।' });
  if (interval !== '1min') return res.status(400).json({ error: 'এই সংস্করণে শুধু 1min টাইমফ্রেম চালু।' });

  const url = new URL('https://api.twelvedata.com/time_series');
  url.search = new URLSearchParams({
    symbol,
    interval,
    outputsize: '60',
    timezone: 'Asia/Dhaka',
    apikey: apiKey
  }).toString();

  try {
    const upstream = await fetch(url, { headers: { Accept: 'application/json' } });
    const data = await upstream.json();
    if (!upstream.ok || data.status === 'error' || !Array.isArray(data.values)) {
      return res.status(upstream.status || 502).json({
        error: data.message || data.code || 'Twelve Data থেকে ডেটা পাওয়া যায়নি।'
      });
    }
    const candles = data.values.slice().reverse().map(v => ({
      time: v.datetime,
      open: Number(v.open), high: Number(v.high),
      low: Number(v.low), close: Number(v.close)
    }));
    return res.status(200).json({
      source: 'Twelve Data', market: 'LIVE FOREX', symbol,
      interval, timezone: 'Asia/Dhaka', candles
    });
  } catch (error) {
    return res.status(502).json({ error: 'ডেটা সার্ভারের সঙ্গে যোগাযোগ করা যায়নি।' });
  }
};
