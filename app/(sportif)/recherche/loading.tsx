import { ProArticleCardSkeleton } from '@/components/common/skeleton';

export default function RechercheLoading() {
  return (
    <div className="mx-auto w-full max-w-[480px] px-4 py-6 md:max-w-[1080px]">
      <div className="mb-6">
        <div className="nk-skeleton mb-2 h-7 w-48 rounded-md" />
        <div className="nk-skeleton h-4 w-32 rounded-md" />
      </div>

      <div className="mb-3">
        <div className="nk-skeleton mb-3 h-5 w-32 rounded-md" />
        <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-hidden px-4">
          {Array.from({ length: 4 }, (_, i) => (
            <ProArticleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
