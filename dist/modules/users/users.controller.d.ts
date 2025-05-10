import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
type UserWithoutPassword = Omit<User, 'password'>;
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<UserWithoutPassword[]>;
    findOne(id: string): Promise<UserWithoutPassword | null>;
    update(id: string, updateUserDto: Partial<CreateUserDto>): Promise<User>;
    remove(id: string): Promise<User>;
}
export {};
