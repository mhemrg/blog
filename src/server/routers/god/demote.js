import { Router } from 'express';

import User from 'Root/models/User';

import sendEmail from 'Root/utils/email';
import { god } from 'Root/perms';

const router = new Router();

router.post('/panel/god/demote', god, async (req, res) => {
  req.body.username = req.body.username.toLowerCase();

  const user = await User.findOne({
    username: req.body.username,
    type: { $in: [3, 4] }
  });

  console.log(user);

  if (!user) {
    res.json({ type: 2, text: 0 });
    return;
  }

  if (user.type === 4) {
    res.json({ type: 2, text: 2 });
    return;
  }

  user.type = 2;

  try {
    await user.save();

    sendEmail({
      to: user.email,
      subject: 'عزل مقام شدن - جامعه متن باز قم',
      html: `
        کاربر گرامی ${user.name},
        <br>
        متاسفانه به دلایلی،‌ مدیران حساب شما را از مقام مدیریت
        به مقام کاربر معمولی عزل نمودند
        <br>
        جامعه متن باز قم
      `
    });

    res.json({ type: 0 });
  }

  catch (e) {
    res.json({ type: 2, text: 1 });
  }
});

export default router;
