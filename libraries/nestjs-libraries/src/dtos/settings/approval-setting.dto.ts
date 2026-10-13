import { IsBoolean } from 'class-validator';

export class ApprovalSettingDto {
  @IsBoolean()
  requiresApproval: boolean;
}
