import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksFilterDto } from './dto/get-tasks-filter.dto';
import { ETaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksRepository } from './task.repository';

@Injectable()
export class TasksService {
  //  Data Mapper approach
  private tasksRepository: typeof TasksRepository & Repository<Task>;
  constructor(@InjectRepository(Task) baseRepository: Repository<Task>) {
    this.tasksRepository = baseRepository.extend(TasksRepository);
  }

  async getAllTasks(
    tasksFilterDto: TasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = tasksFilterDto;
    const query = this.tasksRepository.createQueryBuilder('task'); // we set here just a naming of variable

    query.where({ user });

    if (status) {
      // 'task' is just a name we declared above. It could be whatever we want
      query.andWhere('task.status = :someVariable', {
        someVariable: status,
      });
    }

    if (status) {
      // it is necessary to use brackets because we use OR operator in the query
      // cond1 && cond2 && cond3 || cond4 - without brackets
      // cond1 && cond2 && (cond3 || cond4) - with brackets
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    return query.getMany();
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id, user });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async deleteTaskById(id: string, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    await this.tasksRepository.remove(task);
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      user, // TypeOrm takes whole entity in this case and write in DB only userId
      status: ETaskStatus.OPEN,
    });
    await this.tasksRepository.save(task);
    return task;
  }

  async updateTaskStatusById({
    id,
    status,
    user,
  }: {
    id: string;
    status: ETaskStatus;
    user: User;
  }): Promise<any> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}
