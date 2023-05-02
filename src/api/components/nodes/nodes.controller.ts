import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateNodeDto } from './dtos/create-node';
import { NodesService } from './nodes.service';

@Controller('nodes')
export class NodesController {
  constructor(private nodesService: NodesService) {}

  @Get()
  public async find() {
    return true;
  }

  @Post()
  public async create(@Body() data: CreateNodeDto) {
    const node = await this.nodesService.create(data);

    return {
      result: 'ok',
      data: {
        attributes: node,
      },
    };
  }

  @Post('connect/:portId/:targetPortId')
  public async connect(
    @Param('portId') portId: string,
    @Param('targetPortId') targetPortId: string,
  ) {
    return this.nodesService.connect(portId, targetPortId);
  }
}
