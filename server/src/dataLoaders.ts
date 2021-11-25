import DataLoader from 'dataloader'
import { getRepository } from 'typeorm'
import { Comment } from './entities/Comment'
import { User } from './entities/User'
import _ from 'lodash';

const batchGetUsers = async (userIds: number[]) => {
	const users = await User.findByIds(userIds)
	return userIds.map(userId => users.find(user => user.id === userId))
}

const batchGetComments = async (postIds: number[]) => {
	const commentRepository = getRepository(Comment);

    const conmments = await commentRepository.createQueryBuilder().where("postId IN(:...postIds)", { postIds }).getMany();
	const gs = _.groupBy(conmments, 'postId');
	return postIds.map(k => gs[k] || []);
}

export const buildDataLoaders = () => ({
	userLoader: new DataLoader<number, User | undefined>(userIds =>
		batchGetUsers(userIds as number[])
	),
	commentLoader: new DataLoader<number, Comment[] | undefined>(postIds =>
		batchGetComments(postIds as number[])
	),
})
