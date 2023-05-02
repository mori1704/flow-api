import { IsEnum, IsString } from "class-validator";
import { ENodePort } from "../entities/nodes.entity";

export class CreateNodeDto {
  @IsString()
  public name: string;

  @IsEnum(ENodePort)
  public port: ENodePort;

  @IsString()
  public portId: string;
}