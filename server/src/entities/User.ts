import { Field, ID, ObjectType } from 'type-graphql'
import {BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index} from 'typeorm'
import { Post } from './Post'
import { Comment } from './Comment'

@ObjectType()
@Entity()
@Index(["email"])
export class User extends BaseEntity {
    @Field(_type => ID)
    @PrimaryGeneratedColumn()
    id!: number

    @Field()
    @Column({ length: 50 })
    email!: string

    @Field()
    @Column({length: 50})
    name!: string

    @Field()
    @Column({length: 10})
    social!: string

    @Column({nullable: true})
    password!: string

    @Field()
    @CreateDateColumn()
    createdAt: Date

    @Field()
    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(() => Post, post => post.user)
    posts: Post[]

    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[]
}