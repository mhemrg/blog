import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import izitoast from 'izitoast';

import toGod from 'Root/actions/god/promote/toGod';

import { username } from 'Root/js/validator';
import bind from 'Root/js/bind';

import Button from 'Root/components/Utils/Button';

import styles from './index.less';


class ToGod extends Component {
  @bind
  promote() {
    if (!this.refs.username.value) {
      izitoast.warning({
        rtl: true,
        title: 'مقادیر کافی نمیباشد'
      });

      return;
    }

    if (!username(this.refs.username.value)) {
      izitoast.warning({
        rtl: true,
        title: 'نام کاربری وارد شده صحیح نمی باشد'
      });

      return;
    }

    toGod(this.refs.username.value, this.props.history.push);
  }

  render() {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>ترفیع دادن کاربر به مدیر کل شدن</h1>

        <p>
          توجه! کاربر باید در سایت ثبت نام کرده و از طرف مدیران تایید شده باشد
        </p>

        <input
          type='text'
          ref='username'
          placeholder='یوزرنیم کاربر'
        />

        <Button color='green' handleClick={this.promote}>
          ترفیع دادن
        </Button>
      </div>
    );
  }
}

export default withRouter(ToGod);
