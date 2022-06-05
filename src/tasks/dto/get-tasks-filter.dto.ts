import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ETaskStatus } from '../task-status.enum';

export class TasksFilterDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ETaskStatus)
  status?: ETaskStatus;
}
