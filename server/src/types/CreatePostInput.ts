import { Field, InputType } from 'type-graphql'

@InputType()
export class CreatePostInput {
	@Field()
	title: string

	@Field({nullable: true})
	text?: string
	
	@Field()
	status: number

	@Field({nullable: true})
	userId?: number
}