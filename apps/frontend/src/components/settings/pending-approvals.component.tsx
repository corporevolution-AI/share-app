'use client';

import React, { useCallback, useState } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import useSWR from 'swr';
import { Button } from '@gitroom/react/form/button';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import dayjs from 'dayjs';

interface PendingApproval {
  id: string;
  content: string;
  publishDate: string;
  integration: {
    id: string;
    name: string;
    picture?: string | null;
    providerIdentifier: string;
  };
}

export const usePendingApprovals = () => {
  const fetch = useFetch();

  const load = useCallback(async () => {
    return (await fetch('/posts/approvals/pending')).json();
  }, []);

  return useSWR<PendingApproval[]>('pending-approvals', load, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    revalidateOnMount: true,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
  });
};

const PendingApprovalsComponent = () => {
  const t = useT();
  const fetch = useFetch();
  const toaster = useToaster();
  const { data, isLoading, mutate } = usePendingApprovals();
  const [comments, setComments] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const review = useCallback(
    async (post: PendingApproval, decision: 'APPROVED' | 'REJECTED') => {
      setBusy(post.id);
      try {
        const response = await fetch(`/posts/${post.id}/approval`, {
          method: 'POST',
          body: JSON.stringify({
            decision,
            comment: comments[post.id] || undefined,
          }),
        });
        if (!response.ok) {
          toaster.show(
            t('approval_failed', 'You are not allowed to review this post'),
            'warning'
          );
          return;
        }
        toaster.show(
          decision === 'APPROVED'
            ? t('post_approved', 'Post approved')
            : t('post_rejected', 'Post rejected'),
          'success'
        );
        await mutate();
      } finally {
        setBusy(null);
      }
    },
    [fetch, comments, mutate, toaster, t]
  );

  if (isLoading) {
    return (
      <div className="my-[16px] bg-sixth border-fifth border rounded-[4px] p-[24px]">
        <div className="animate-pulse">{t('loading', 'Loading...')}</div>
      </div>
    );
  }

  return (
    <div className="my-[16px] bg-sixth border-fifth border rounded-[4px] p-[24px] flex flex-col gap-[16px]">
      <div className="mt-[4px]">
        {t('posts_waiting_approval', 'Posts waiting for approval')}
      </div>
      {!data?.length && (
        <div className="text-[12px] text-customColor18">
          {t('no_posts_waiting_approval', 'No post is waiting for approval.')}
        </div>
      )}
      {data?.map((post) => (
        <div
          key={post.id}
          className="flex flex-col gap-[8px] border-t border-fifth pt-[16px]"
        >
          <div className="text-[12px] text-customColor18">
            {post.integration.name} ·{' '}
            {dayjs(post.publishDate).format('DD/MM/YYYY HH:mm')}
          </div>
          <div className="text-[14px] line-clamp-3">
            {post.content.replace(/<[^>]*>/g, '')}
          </div>
          <textarea
            className="bg-input border border-fifth rounded-[4px] p-[8px] text-[12px]"
            placeholder={t('approval_comment', 'Comment (optional)')}
            value={comments[post.id] || ''}
            onChange={(e) =>
              setComments((prev) => ({ ...prev, [post.id]: e.target.value }))
            }
          />
          <div className="flex gap-[8px] justify-end">
            <Button
              secondary={true}
              loading={busy === post.id}
              onClick={() => review(post, 'REJECTED')}
            >
              {t('reject', 'Reject')}
            </Button>
            <Button
              loading={busy === post.id}
              onClick={() => review(post, 'APPROVED')}
            >
              {t('approve', 'Approve')}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingApprovalsComponent;
