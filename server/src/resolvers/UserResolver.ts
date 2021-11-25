import { User } from '../entities/User';
import { Query, Resolver} from "type-graphql";

@Resolver(_of => User)
export class UserResolver {

    @Query(_return => [User])
    async users(): Promise<User[]> {
        const users = User.find();
        return users
    }

}
