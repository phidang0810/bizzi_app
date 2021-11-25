import { Field, ObjectType, ID } from 'type-graphql';
import {BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index} from 'typeorm'
import { User } from './User';
import { Comment } from './Comment';

@ObjectType()
@Entity() //db table
export class Post extends BaseEntity {

    @Field(_type => ID)
    @PrimaryGeneratedColumn()
    id!: number

    @Field()
    @Column()
    @Index({ fulltext: true })
    title!: string

    @Field()
    @Column("text")
    @Index({ fulltext: true })
    text!: string

    @Field()
    @Column()
    slug!: string

    @Field()
    @Column()
    photo: string

    @Field()
    @Column({ type: 'bool', width: 1 })
    status!: number

    @Field()
	@Column()
	userId!: number

    @Field(_type => User)
    @ManyToOne(() => User, user => user.posts)
    user: User

    @Field(_type => [Comment])
    @OneToMany(() => Comment, comment => comment.post)
    comments: Comment[]

    @Index()
    @Field()
    @CreateDateColumn()
    createdAt: Date

    @Field()
    @UpdateDateColumn()
    updatedAt: Date
    
}