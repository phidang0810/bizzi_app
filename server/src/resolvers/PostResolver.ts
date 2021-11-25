import { POST_STATUS } from "./../constants";
import { Post } from "../entities/Post";
import { Arg, Mutation, Query, Resolver, UseMiddleware, Ctx, ID, FieldResolver, Root } from "type-graphql";
import { checkAuth } from "../middleware/checkAuth";
import { Context } from "../types/Context";
import { CreatePostInput } from "../types/CreatePostInput";
import { PaginatedPosts } from "../types/PaginationPost";
import { UpdatePostInput } from "../types/UpdatePostInput";
import { ERROR_CODE } from "../constants";
import { ApolloError } from "apollo-server-core";
import { Comment } from "../entities/Comment";
import { User } from "../entities/User";
import { getRepository } from "typeorm";
import { SearchPostsInput } from "../types/SearchPostsInput";
import {createPostService, updatePostService, deletePostService} from "../services/PostService"
@Resolver(_of => Post)
export class PostResolver { 
    @FieldResolver(_return => String)
    key(@Root() root: Post) {
        return root.id;
    }

    @FieldResolver(_return => String)
    shortDes(@Root() root: Post) {
        return root.text.substring(0, 50) + "...";
    }

    @FieldResolver(_return => User)
    async user(
        @Root() root: Post,
        @Ctx() { dataLoaders: { userLoader } }: Context
    ) {
        return await userLoader.load(root.userId)
    }

    @FieldResolver(_return => [Comment])
    async comments(
        @Root() root: Post,
        @Ctx() { dataLoaders: { commentLoader } }: Context
    ) {
        return await commentLoader.load(root.id)
    }

    @Mutation(_return => Post)
    @UseMiddleware(checkAuth)
    async createPost(
        @Arg("createPostInput") input: CreatePostInput, 
        @Ctx() { payload }: Context
        ): Promise<Post> {
            input.userId = payload.userId;
            return createPostService(input);
    }

    @Mutation(_return => Post)
    @UseMiddleware(checkAuth)
    async updatePost(@Arg("updatePostInput") input: UpdatePostInput, 
        @Ctx() { payload }: Context
    ): Promise<Post> {
        const { userId } = payload;
        console.log('input.id)=', input.userId)
        console.log('userId=', userId)
        if (userId !== input.id) {
            throw new ApolloError("Access denied!", ERROR_CODE.UNAUTHORIZATION);
        }
        return updatePostService(input)
    }

    @Mutation(_return => Boolean)
    @UseMiddleware(checkAuth)
    async deletePost(@Arg("id", _type => ID) id: number, @Ctx() { payload }: Context): Promise<boolean> {
        const { userId } = payload;       

        if (id !== userId) {
            throw new ApolloError("Access denied!", ERROR_CODE.UNAUTHORIZATION);
        }

        return deletePostService(id);
    }


    @Query(_return => PaginatedPosts, { nullable: true })
    async posts(@Arg("searchPostsInput") { page, length, orderField, orderType, keyword }: SearchPostsInput): Promise<PaginatedPosts | null> {
        const userRepository = getRepository(Post);

        let posts = userRepository.createQueryBuilder().select().where("status = :status", { status: POST_STATUS.ACTIVE });

        if (keyword !== "") {
            posts.where(`MATCH(title) AGAINST ('${keyword}' IN BOOLEAN MODE)`).orWhere(`MATCH(text) AGAINST ('${keyword}' IN BOOLEAN MODE)`);
        }

        if (orderType === "ASC" || orderType === "DESC") {
            posts.orderBy(orderField, orderType);
        }

        posts
            .skip((page - 1) * length)
            .take(length)
            .getMany();
        const [rows, total] = await posts.getManyAndCount();

        return {
            total: total,
            page: page,
            length: length,
            rows: rows
        };
    }

    @Query(_return => PaginatedPosts, { nullable: true })
    @UseMiddleware(checkAuth)
    async myPosts(
        @Ctx() { payload }: Context,
        @Arg("searchPostsInput") { page, length, orderField, orderType }: SearchPostsInput
    ): Promise<PaginatedPosts | null> {
        const { userId } = payload;
        const totalPosts = await Post.count({ userId });
        const defaultOrderColumn = orderField || "id";
        const defaultOrderType = orderType || "DESC";
        const posts = await Post.find({
            where: { userId },
            order: {
                [defaultOrderColumn]: defaultOrderType
            },
            skip: (page - 1) * length,
            take: length
        });

        return {
            total: totalPosts,
            page: page,
            length: length,
            rows: posts
        };
    }

    @Query(_return => Post, { nullable: true })
    async post(@Arg("id", _type => ID) id: number): Promise<Post> {
        const post = await Post.findOne({ id });

        if (!post) throw new ApolloError("Post not found", ERROR_CODE.NOT_FOUND);

        return post;
    }    
}
