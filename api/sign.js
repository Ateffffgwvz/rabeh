// Vercel Serverless Function: signs offerwall.gg wall URLs.
// The secret lives ONLY in the Vercel env var OFFERWALL_GG_SECRET —
// it is never in frontend code and never in this file.
const crypto = require('crypto');

const APP_ID = '497359a1055748764f58bb3862ca163f';

module.exports = async (req, res) => {
  const userId = (req.query && req.query.userId) || '';
  const secret = process.env.OFFERWALL_GG_SECRET;

  if (!/^[A-Za-z0-9_-]{1,128}$/.test(userId)) {
    return res.status(400).json({ error: 'invalid userId' });
  }
  if (!secret) {
    return res.status(500).json({ error: 'signing not configured' });
  }

  const signature = crypto
    .createHmac('sha256', secret)
    .update('appId=' + APP_ID + '&userId=' + userId)
    .digest('hex');

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ signature });
};
