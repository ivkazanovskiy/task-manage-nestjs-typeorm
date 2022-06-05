import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'task-management',
      autoLoadEntities: true, // helps us not to load explicitly entities
      synchronize: true, // because we do not use migrations in this project
    }),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
