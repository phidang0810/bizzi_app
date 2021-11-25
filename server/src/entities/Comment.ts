import { Field, ID, ObjectType } from 'type-graphql';
import {BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne} from 'typeorm'
import { User } from './User';
import { Post } from './Post';

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
    @Field(_type => ID)
    @PrimaryGeneratedColumn()
    id!: number

    @Field()
    @Column()
    text!: string

    @Field()
	@Column()
	userId!: number

    @Field()
	@Column()
	postId!: number

    @ManyToOne(() => User, user => user.comments)
    user: User;

    @ManyToOne(() => Post, post => post.comments)
    post: Post;

    @Field()
    @CreateDateColumn()
    createdAt: Date

    @Field()
    @UpdateDateColumn()
    updatedAt: Date
    

    
    
}