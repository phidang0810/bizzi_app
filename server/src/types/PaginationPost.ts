import { Field, ObjectType, Int } from 'type-graphql';
import { Post } from '../entities/Post';

@ObjectType()
export class PaginatedPosts {
	@Field(_type => Int)
	total!: number

	@Field(_type => Int)
	page!: number

	@Field(_type => Int)
	length!: number

	@Field(_type => [Post])
	rows!: Post[]
}