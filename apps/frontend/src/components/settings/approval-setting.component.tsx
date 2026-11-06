'use client';

import React, { useCallback } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import useSWR from 'swr';
import { Slider } from '@gitroom/react/form/slider';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { useT } from '@gitroom/react/translation/get.transation.service.client';

interface ApprovalSettingResponse {
  requiresApproval: boolean;
}

export const useApprovalSetting = () => {
  const fetch = useFetch();

  const load = useCallback(async () => {
    return (await fetch('/settings/approval')).json();
  }, []);

  return useSWR<ApprovalSettingResponse>('approval-setting', load, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    revalidateOnMount: true,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
  });
};

const ApprovalSettingComponent = () => {
  const t = useT();
  const fetch = useFetch();
  const toaster = useToaster();
  const { data, isLoading, mutate } = useApprovalSetting();

  const changeRequiresApproval = useCallback(
    async (value: 'on' | 'off') => {
      const requiresApproval = value === 'on';

      await fetch('/settings/approval', {
        method: 'POST',
        body: JSON.stringify({ requiresApproval }),
      });

      mutate({ requiresApproval });
      toaster.show(t('settings_updated', 'Settings updated'), 'success');
    },
    [fetch, mutate, toaster, t]
  );

  if (isLoading) {
    return (
      <div className="my-[16px] mt-[16px] bg-sixth border-fifth border rounded-[4px] p-[24px]">
        <div className="animate-pulse">{t('loading', 'Loading...')}</div>
      </div>
    );
  }

  return (
    <div className="my-[16px] mt-[16px] bg-sixth border-fifth border rounded-[4px] p-[24px] flex flex-col gap-[24px]">
      <div className="mt-[4px]">
        {t('approval_settings', 'Post Approval')}
      </div>
      <div className="flex items-center justify-between gap-[24px]">
        <div className="flex flex-col flex-1">
          <div className="text-[14px]">
            {t('require_approval', 'Require approval before publishing')}
          </div>
          <div className="text-[12px] text-customColor18">
            {t(
              'require_approval_description',
              'Scheduled posts wait for an admin to approve them. Editing a post requires a new approval.'
            )}
          </div>
        </div>
        <Slider
          value={data?.requiresApproval ? 'on' : 'off'}
          onChange={changeRequiresApproval}
          fill={true}
        />
      </div>
    </div>
  );
};

export default ApprovalSettingComponent;
