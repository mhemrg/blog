import { Router } from 'express';

import Newsletter from 'Root/models/Newsletter';

const router = new Router();

router.post('/subscribe/verify', async (req, res) => {
  const member = await Newsletter.findOne({
    token: req.body.token,
    verified: false
  });

  if (!member) {
    res.json({ type: 2, text: 0 });

    return;
  }

  member.verified = true;

  try {
    await member.save();

    res.json({ type: 0 });
  }

  catch (e) {
    res.json({ type: 2, text: 1 });
  }
});

export default router;
