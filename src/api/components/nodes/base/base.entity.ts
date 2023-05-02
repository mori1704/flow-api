import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Base {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    default: true,
  })
  public active: boolean;

  @Column({
    default: false,
  })
  public deleted: boolean;

  @CreateDateColumn({
    name: 'created_at',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  public updatedAt: Date;
}
