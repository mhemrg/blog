import React, { Component } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import { withRouter } from 'react-router-dom';
import izitoast from 'izitoast';

import newArticle from 'Root/actions/user/articles/add';

import bind from 'Root/js/bind';

import Button from 'Root/components/Utils/Button';

import 'Root/css/simplemde.less';
import styles from './index.less';


class AddArticle extends Component {
  state = {
    content: '',
    avatar: ''
  };

  @bind
  post() {
    if (!this.refs.title.value || !this.state.content) {
      izitoast.warning({
        rtl: true,
        title: 'مقادیر کافی نیستند'
      });
      return;
    }

    if (!this.state.avatar) {
      izitoast.warning({
        rtl: true,
        title: 'مقاله شما باید عکس داشته باشد'
      });

      return;
    }

    newArticle({
      title: this.refs.title.value,
      content: this.state.content,
      avatar: this.state.avatar,
      minutes: Math.ceil(this.state.content.length / 386)
    }, this.props.history.push);
  }

  @bind
  updateAvatar() {
    let reader = new FileReader();
    let file = this.refs.file.files[0];
    let type = file.type.split('/')[1];

    reader.addEventListener('loadend', () => {
      if (file.size > 1048576) {
        izitoast.warning({
          rtl: true,
          title: 'حجم فایل حداکثر می تواند ۱ مگابایت باشد.'
        });

        return;
      }

      if (!['jpg', 'jpeg', 'png'].includes(type)) {
        izitoast.warning({
          rtl: true,
          title: 'فرمت فایل باید jpg یا png باشد'
        });

        return;
      }

    });

    reader.readAsBinaryString(this.refs.file.files[0]);

    this.setState({ avatar: this.refs.file.files[0] });
  }

  @bind
  openInput() {
    this.refs.file.click();
  }

  @bind
  handle(content) {
    this.setState({ content });
  }

  render() {
    return (
      <div className={styles.container}>
        <input
          type='text'
          placeholder='عنوان'
          ref='title'
        />
        <SimpleMDE
          ref='content'
          onChange={this.handle}
          options={{
            spellChecker: false
          }}
        />

        <input
          type='file'
          ref='file'
          className={styles.avatarInput}
          onChange={this.updateAvatar} />

        <Button
          handleClick={this.openInput}
          color='blue'>
          اضافه کردن عکس
        </Button>

        <Button handleClick={this.post} color='blue'>ثبت</Button>
      </div>
    );
  }
}

export default withRouter(AddArticle);
