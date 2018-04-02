import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} from 'graphql';

import User from 'Root/models/User';

import UserSchema from './user';

const ArticleSchema = new GraphQLObjectType({
  name: 'Article',
  fields: () => ({
    title: {
      type: GraphQLString
    },
    content: {
      type: GraphQLString
    },
    minutes: {
      type: GraphQLInt
    },
    avatar: {
      type: GraphQLString
    },
    createdAt: {
      type: GraphQLString
    },
    viewers: {
      type: GraphQLInt
    },
    likes: {
      type: GraphQLInt
    },
    type: {
      type: GraphQLInt
    },
    user: {
      type: UserSchema,
      async resolve(parent) {
        let user = await User
          .findOne({ _id: parent.author })
          .select('-password -submembers -__v')
          .lean();

        user = {
          ...user,
          createdAt: +user.createdAt,
          articles: user.articles.length
        };

        return user;
      }
    }
  })
});

export default ArticleSchema;