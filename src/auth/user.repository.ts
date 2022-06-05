import { ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

export const UserRepository = {
  async createUser(
    this: Repository<User>,
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const securedPass = await bcrypt.hash(password, salt);
    const user = this.create({ username, password: securedPass });

    try {
      await this.save(user);
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException(`Username ${username} already exists`);
      }
      throw err;
    }
  },
  async getUser(
    this: Repository<User>,
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const securedPass = await bcrypt.hash(password, salt);
    const user = this.create({ username, password: securedPass });

    try {
      await this.save(user);
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException(`Username ${username} already exists`);
      }
      throw err;
    }
  },
};
