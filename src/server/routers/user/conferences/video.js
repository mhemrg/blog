import { Router } from 'express';

import Conference from 'Root/models/Conference';

import { admin } from 'Root/perms';

const router = new Router();

router.post('/panel/conferences/video', admin, async (req, res) => {
  try {
    const conf = await Conference.findById(req.body._id);

    if (!conf) {
      res.json({ type: 2, text: 0 });
      return;
    }

    conf.embeds.push(req.body.embed);

    await conf.save();

    res.json({ type: 0 });
  }

  catch (e) {
    res.json({ type: 2, text: 1 });
  }
});

export default router;
