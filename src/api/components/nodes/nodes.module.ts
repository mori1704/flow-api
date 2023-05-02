import { Module } from '@nestjs/common';
import { NodesController } from './nodes.controller';
import { NodesService } from './nodes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nodes } from './entities/nodes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nodes])],
  controllers: [NodesController],
  providers: [NodesService],
})
export class NodesModule {}
