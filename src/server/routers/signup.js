import { Router } from 'express';

import ActivationLink from 'Root/models/ActivationLink';
import User from 'Root/models/User';

import { hmac } from 'Root/utils/crypto';
import { dbkey, url } from 'Root/config';
import sendEmail from 'Root/utils/email';
import random from 'Root/utils/random';
import { login } from 'Root/perms';

const router = new Router();


router.post('/signup', login, async (req, res) => {
  req.body.username = req.body.username.toLowerCase();
  req.body.email = req.body.email.toLowerCase();

  const email = await User.findOne({ email: req.body.email });

  if (email) {
    res.json({ type: 2, text: 1 });
    return;
  }

  const username = await User.findOne({ username: req.body.username });

  if (username) {
    res.json({ type: 2, text: 2 });
    return;
  }

  const user = new User({
    ...req.body,
    password: hmac(req.body.password, dbkey)
  });

  const code = await random(25);

  const AL = new ActivationLink({
    user: user._id,
    code
  });

  try {
    await user.save();
    await AL.save();

    sendEmail({
      to: user.email,
      subject: 'تایید حساب',
      html: `
        ثبت نام شما در جامعه متن باز قم با موفقیت انجام شد
        <br>
        لطفا تا زمان تایید حساب شما توسط مدیران شکیبا باشید
        <br>
        برای تایید حساب خود روی لینک زیر کلیک کنید
        <br>
        <a href='${url}/activate/${code}'>تایید حساب</a>
        <br>
        شما میتوانید در خبرنامه ثبت نام کنید و از اخبار جدید با خبر شوید
        <br>
        جامعه متن باز قم
      `
    });

  } catch (e) {
    res.json({ type: 2, text: 3 });
    return;
  }
});

export default router;
