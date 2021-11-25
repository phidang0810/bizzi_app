import DataLoader from 'dataloader'
import { Comment } from '../entities/Comment'
import { User } from '../entities/User'
import { Post } from '../entities/Post'

interface CommentTypeCondition {
	postId: number
	userId: number
    message?: string
}

const getUsers = async (userIds: number[]) => {
	const users = await User.findByIds(userIds)
	return userIds.map(userId => users.find(user => user.id === userId))
}

const getPosts = async (postIds: number[]) => {
	const posts = await Post.findByIds(postIds)
	return postIds.map(postId => posts.find(post => post.id === postId))
}

const getVoteTypes = async (voteTypeConditions: CommentTypeCondition[]) => {
	const voteTypes = await Comment.findByIds(voteTypeConditions)
	return voteTypeConditions.map(voteTypeCondition =>
		voteTypes.find(
            (rowComment: any) =>
                rowComment.postId === voteTypeCondition.postId &&
                rowComment.userId === voteTypeCondition.userId
		)
	)
}

export const buildDataLoaders = () => ({
	userLoader: new DataLoader<number, User | undefined>(userIds =>
		getUsers(userIds as number[])
	),
	postLoader: new DataLoader<number, Post | undefined>(postIds =>
		getPosts(postIds as number[])
	),	
	voteTypeLoader: new DataLoader<CommentTypeCondition, Comment | undefined>(
		voteTypeConditions =>
			getVoteTypes(voteTypeConditions as CommentTypeCondition[])
	)
})