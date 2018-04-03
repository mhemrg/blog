import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { createApolloFetch } from 'apollo-fetch';
import nprogress from 'nprogress';

import moment from 'Root/js/moment';
import bind from 'Root/js/bind';

import Article from 'Root/components/Utils/Article';

import userDefault from 'Root/images/u.png';
import styles from './index.less';


class User extends Component {
  state = {
    data: undefined
  };

  componentWillMount() {
    nprogress.start();
  }

  componentDidMount() {

    const apolloFetch = createApolloFetch({
      uri: `${location.origin}/graphql`
    });

    const query = `
      query {
        user(username: "${this.props.match.params.username}") {
          description
          createdAt
          articles
          username
          avatar
          email
          type
          name

          userArticles {
            createdAt
            minutes
            content
            avatar
            title
          }
        }
      }
    `;

    apolloFetch({ query }).then(data => {
      this.setState({ data: data.data });
      nprogress.done();
    });
  }

  @bind
  role() {
    if (this.state.data.user.type === 1) {
      return 'در انتظار پذیرش';
    } else if (this.state.data.user.type === 2) {
      return 'کاربر معمولی';
    } else if (this.state.data.user.type === 3) {
      return 'مدیر';
    }
    return 'مدیر کل';
  }

  @bind
  renderImage() {
    if (this.state.data.user.avatar) {
      return <img
        src={`/static/image/${this.state.data.user.avatar}`}
        className={styles.userImage}
      />;
    }

    return <img
      src={userDefault}
      className={styles.userImage}
    />;
  }

  render() {
    if (!this.state.data) {
      return <h1>در حال گرفتن اطلاعات</h1>;
    }

    if (this.state.data.user === null) {
      return <Redirect to='/notfound' />;
    }

    return (
      <div className={styles.container}>
        <div className={styles.user}>
          <p>{this.state.data.user.name}</p>
          <p>{this.state.data.user.email}</p>
          <p>{this.role()}</p>
          {this.renderImage()}
          {this.state.data.user.description && <p>
            درباره: {this.state.data.user.description}
          </p>}
          <p>عضو شده در:‌ {moment(new Date(this.state.data.user.createdAt))}</p>
          <p>تعداد مقالات: {this.state.data.user.articles}</p>
        </div>


        <div className={styles.articles}>
          {this.state.data.user.userArticles.length && <h1>مقالات</h1>}

          {this.state.data.user.userArticles.map((v, i) =>
            <Article
              key={i}
              user={{ ...this.state.data.user }}
              art={{ ...v }}
            />
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(User);
