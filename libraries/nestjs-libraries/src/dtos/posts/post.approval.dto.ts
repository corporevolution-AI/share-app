import { ApprovalDecision } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class PostApprovalDto {
  @IsEnum(ApprovalDecision)
  decision: ApprovalDecision;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;
}
