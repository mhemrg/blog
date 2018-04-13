import { GraphQLObjectType } from 'graphql';

import articles from './article/articles';
import article from './article/article';
import comment from './comment/comment';
import users from './user/users';
import user from './user/user';
import tag from './tag/tags';

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    articles,
    article,
    comment,
    users,
    user,
    tag
  }
});

export default query;