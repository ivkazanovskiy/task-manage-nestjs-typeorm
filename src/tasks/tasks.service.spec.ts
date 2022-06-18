import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  findOne: jest.fn(),
});

describe('TaskService', () => {
  let tasksService: TasksService;
  let tasksRepository: Repository<Task>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: 'TaskRepository',
          useFactory: mockTasksRepository,
        },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get('TaskRepository');
  });

  describe(1, () => {
    it('2', () => {
      expect(tasksRepository.findOne).not.toHaveBeenCalled();
    });
  });
});
describe(1, () => {
  it('2', () => {
    expect(1).toEqual(1);
  });
});
