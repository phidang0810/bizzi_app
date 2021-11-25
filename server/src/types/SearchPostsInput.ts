import { Field, InputType } from 'type-graphql'


@InputType()
export class SearchPostsInput {
	@Field()
	page: number = 1

	@Field({nullable: true})
	length: number = 10

	@Field({nullable: true})
	orderField: string = 'createdAt'

	@Field({nullable: true})
	orderType: string = 'DESC'

	@Field({nullable: true})
	keyword?: string = ''
}