import {Arg, Mutation, Resolver, UseMiddleware, Ctx, FieldResolver, Root, Int} from "type-graphql";
import { checkAuth } from '../middleware/checkAuth';
import { Context } from '../types/Context'
import { ERROR_CODE } from '../constants';
import { ApolloError } from 'apollo-server-core';
import { Comment } from '../entities/Comment';
import { User } from '../entities/User';

@Resolver(_of => Comment)
export class CommentResolver{  

	@FieldResolver(_return => User)
	async user(
		@Root() root: Comment,
		@Ctx() { dataLoaders: { userLoader } }: Context
	) {
		return await userLoader.load(root.userId)
	}

    @Mutation(_return => Comment)
	@UseMiddleware(checkAuth)
	async createComment(
		@Arg('text') text: string,
		@Arg('postId', _type => Int) postId: number,
		@Ctx() { payload }: Context
	): Promise<Comment> {
		try {
			const { userId } = payload;
			const commentModel = await Comment.create({
				text,
				postId,
				user: {
					id: userId
				}
			})

			let comment = commentModel.save();
			return comment;

		} catch (error) {
			if (error instanceof SyntaxError) {                
                throw new ApolloError(error.message, ERROR_CODE.SERVER_ERROR);
            }
			throw new ApolloError('Internal Server Error', ERROR_CODE.SERVER_ERROR);
		}
	}
}
