export default async function handler(req, res) {
  const symbol = String(req.query.symbol || 'EUR/USD').toUpperCase();
  const allowed = new Set(['EUR/USD','GBP/USD','USD/JPY','AUD/USD','USD/CAD','USD/CHF','NZD/USD']);
  if (!allowed.has(symbol)) return res.status(400).json({ error: 'Unsupported pair' });
  const key = process.env.TWELVE_DATA_API_KEY;
  if (!key) return res.status(503).json({ error: 'Server API key is not configured yet.' });
  try {
    const url = new URL('https://api.twelvedata.com/time_series');
    url.searchParams.set('symbol', symbol);
    url.searchParams.set('interval', '1min');
    url.searchParams.set('outputsize', '60');
    url.searchParams.set('apikey', key);
    const upstream = await fetch(url);
    const data = await upstream.json();
    if (!upstream.ok || data.status === 'error' || !data.values) {
      return res.status(502).json({ error: data.message || 'Market data is temporarily unavailable.' });
    }
    return res.status(200).json({ symbol, interval: '1min', source: 'Twelve Data', values: data.values });
  } catch (e) {
    return res.status(500).json({ error: 'Could not retrieve market data.' });
  }
}
