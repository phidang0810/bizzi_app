import { CreatePostInput } from '../types/CreatePostInput';
import { UpdatePostInput } from '../types/UpdatePostInput';
import { Post } from "../entities/Post";
import { ApolloError } from "apollo-server-errors";
import { ERROR_CODE } from "../constants";
import { convertToSlug } from "../helpers";
import { Comment } from '../entities/Comment';
import algoliasearch from "algoliasearch";

const client = algoliasearch(process.env.ALGOLIA_APP_ID as string, process.env.ALGOLIA_ADMIN_API_KEY as string);
const agoliaSearch = client.initIndex(process.env.ALGOLIA_INDEX as string);

export const createPostService = async function ({title, text, status, userId}: CreatePostInput) {
    try {            
        const slug = convertToSlug(title);
        const postModel = Post.create({
            title,
            slug,
            text,
            status,
            userId
        });

        let newPost = await postModel.save();

        await agoliaSearch.saveObjects([
            {
                title,
                text,                    
                status,
                slug,
                objectID: newPost.id
            }
        ])            
        return newPost;
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new ApolloError(error.message, ERROR_CODE.SERVER_ERROR);
        }
        throw new ApolloError("Internal Server Error", ERROR_CODE.SERVER_ERROR);
    }
}

export const updatePostService = async function ({title, text, status, id}: UpdatePostInput, userId: number) {    
    let existingPost = await Post.findOne(id);
    if (!existingPost) throw new ApolloError("Post not found", ERROR_CODE.NOT_FOUND);        

    if (userId != existingPost.userId) {
        throw new ApolloError("Access denied!", ERROR_CODE.UNAUTHORIZATION);
    }

    const slug = convertToSlug(title);
    existingPost.title = title;
    existingPost.slug = slug
    existingPost.text = text;
    existingPost.status = status;     
    try {
        existingPost = await existingPost.save();
        await agoliaSearch.saveObjects([{
            title,
            text,
            slug,                
            status,
            objectID: existingPost.id
        }])
    } catch (error) {
        throw new ApolloError("Error", ERROR_CODE.SERVER_ERROR);
    }
    return existingPost;
}
export const deletePostService = async function (id: number, userId: number) {
    const existingPost = await Post.findOne(id);
    if (!existingPost) return false;

    if (userId != existingPost.userId) {
        throw new ApolloError("Access denied!", ERROR_CODE.UNAUTHORIZATION);
    }

    await Comment.delete({ postId: id });
    await Post.delete({ id });
    
    try {
        await agoliaSearch.deleteObject(`${id}`);
    } catch (error) {
        return false
    }
    return true;
}