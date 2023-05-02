import { Column, Entity } from 'typeorm';
import { Base } from '../base/base.entity';

export enum ENodePort {
  IN = 'in',
  OUT = 'out',
}

@Entity('nodes')
export class Nodes extends Base {
  @Column()
  public name: string;

  @Column({
    type: 'enum',
    enum: ENodePort,
    default: ENodePort.IN,
  })
  public port: ENodePort;

  @Column({
    name: 'port_id',
  })
  public portId: string;

  @Column({
    name: 'from_port_id',
    nullable: true,
  })
  public fromPortId?: string;

  @Column({
    name: 'target_id',
    nullable: true,
  })
  public targetId?: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  public payload?: any;
}
