
import { User } from '../entities/User'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class LoginResponse {	

	@Field({ nullable: true })
	accessToken: string

	@Field()
	user: User
}