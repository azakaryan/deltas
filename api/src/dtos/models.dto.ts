import { IsArray, IsString } from 'class-validator';
import { Delta } from '../interfaces/delta.interface';

export class CreateModelDto {
  @IsString()
  public name: string;
}

export class UpdateModelDto {
  @IsArray()
  public deltas: Delta[];
}
