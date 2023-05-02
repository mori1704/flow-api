import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodesModule } from './api/components/nodes/nodes.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'vps.upixels.com.br',
      port: 5432,
      username: 'docker',
      password: 'docker',
      database: 'flow',
      // entities: [],
      autoLoadEntities: true,
      synchronize: true,
    }),
    NodesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
