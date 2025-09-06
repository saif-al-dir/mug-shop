import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsArray()
  @IsOptional()
  additionalImages?: string[];

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  description?: string;
}