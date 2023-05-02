import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ENodePort, Nodes } from './entities/nodes.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class NodesService {
  constructor(
    @InjectRepository(Nodes)
    private nodesRepository: Repository<Nodes>,
  ) {}

  private operations = {
    equal: (a: any, b: any) => a === b,
    notEqual: (a: any, b: any) => a !== b,
    greaterThan: (a: any, b: any) => a > b,
    greaterThanOrEqual: (a: any, b: any) => a >= b,
    lessThan: (a: any, b: any) => a < b,
    lessThanOrEqual: (a: any, b: any) => a <= b,
  }

  public async create(data: Partial<Nodes>) {
    return this.nodesRepository.save(this.nodesRepository.create(data));
  }

  public async findByName(name: string) {
    return this.nodesRepository.find({
      where: { name },
    });
  }

  public async findOneByPortId(portId: string) {
    return this.nodesRepository.findOne({
      where: {
        portId,
      },
    });
  }

  public async findOneByTargetId(targetId: string) {
    return this.nodesRepository.findOne({
      where: { targetId },
    });
  }

  public async update(
    criteria: string | FindOptionsWhere<Nodes>,
    data: Partial<Nodes>,
  ) {
    return this.nodesRepository.update(criteria, data);
  }

  public async connect(portId: string, targetPortId: string) {
    const node = await this.findOneByPortId(portId);

    if (!node) {
      throw new NotFoundException('node not found', 'NODE_0001');
    }

    const target = await this.findOneByPortId(targetPortId);

    if (!target) {
      throw new NotFoundException('target node not found', 'NODE_0002');
    }

    if (node.port !== ENodePort.IN) {
      throw new BadRequestException(
        `the source node port must be 'in'`,
        'NODE_0003',
      );
    }

    if (target.port !== ENodePort.OUT) {
      throw new BadRequestException(
        `the source node port must be 'out'`,
        'NODE_0004',
      );
    }

    await this.update(node.id, {
      targetId: target.portId,
    });

    return {
      result: 'ok',
      data: {
        message: 'nodes connected',
      },
    };
  }

  public async disconnect(portId: string, targetId: string) {
    const node = await this.findOneByPortId(portId);

    if (!node) {
      throw new NotFoundException('node not found', 'NODE_0001');
    }

    const target = await this.findOneByTargetId(targetId);

    if (!target) {
      throw new NotFoundException('target node not found', 'NODE_0002');
    }

    await this.update(
      {
        id: node.id,
        targetId,
      },
      {
        targetId: null,
      },
    );

    return {
      result: 'ok',
      data: {
        message: 'nodes disconnected',
      },
    };
  }

  public async execute(portId: string) {
    const node = await this.findOneByPortId(portId);

    if (!node) {
      throw new NotFoundException('node not found', 'NODE_0001');
    }

    /*if (node.port !== ENodePort.IN) {
      throw new BadRequestException(
        `the source node port must be 'in'`,
        'NODE_0003',
      );
    }*/

    if (!node.targetId) {
      throw new BadRequestException(
        'the node has no target node to execute',
        'NODE_0005',
      );
    }

    const target = await this.findOneByPortId(node.targetId);

    if (!target) {
      throw new NotFoundException('target node not found', 'NODE_0002');
    }

    const result = await this.evaluate(node, target);
  }

  public async evaluate(node: Nodes, target: Nodes) {
    // get the code from the node payload
    
    if (!node.payload) {
      throw new BadRequestException('the node has no code to evaluate', 'NODE_0006');
    }

    const code = JSON.parse(node.payload);

    if (node.port !== ENodePort.OUT) {
      throw new BadRequestException(
        `the source node port must be 'out'`,
        'NODE_0004',
      );
    }

    // check if the code has one of the supported operations
    const hasOperation = Object.keys(this.operations).some((operation) =>
      code.includes(operation),
    );

    const operationResult = new Map<string, boolean>();

    if (hasOperation) {
      // get the operations from the code
      const operations = Object.keys(this.operations).filter((operation) =>
        code.includes(operation),
      );

      // get the values from the target node payload
      const values = JSON.parse(target.payload);

      // evaluate the operations
      await Promise.all(
        operations.map(async (operation) => {
          const [a, b] = values;

          operationResult.set(operation, this.operations[operation](a, b));
        }),
      );

      

    }


  }
}
