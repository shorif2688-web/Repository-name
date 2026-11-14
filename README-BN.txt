THE TRADING ROOM — প্রথম সার্ভার সংযোগের প্রস্তুতি

এই প্যাকেজে যা আছে:
- index.html: আগের মোবাইল ওয়েব ইন্টারফেস
- api/candles.js: Twelve Data-এর 1-minute Forex candle আনার নিরাপদ server endpoint
- vercel.json: Vercel serverless function configuration

গুরুত্বপূর্ণ:
1) আপনার আসল API Key কখনো index.html বা chat-এ বসাবেন না।
2) Vercel-এ Project Settings > Environment Variables-এ নাম দিন:
   TWELVE_DATA_API_KEY
   Value ঘরে আপনার নতুন Twelve Data API Key বসাবেন।
3) এরপর Redeploy করতে হবে।
4) এই প্যাকেজটি এখনো deploy করা হয়নি এবং index.html-এ endpoint/chart integration পরের ধাপে করতে হবে।
5) Twelve Data endpoint: /time_series, interval=1min. Forex pairs only; OTC নয়।

প্রথম পরীক্ষার endpoint:
/api/candles?symbol=EUR%2FUSD&interval=1min

সতর্কতা: API plan-এ 1-minute Forex data ও প্রয়োজনীয় credits আছে কি না Twelve Data dashboard-এ যাচাই করুন।
