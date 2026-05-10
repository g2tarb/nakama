import {
  NextSessionSkeleton,
  ProArticleCardSkeleton,
  Skeleton,
} from '@/components/common/skeleton';

export default function AccueilLoading() {
  return (
    <div className="mx-auto max-w-[480px] pb-8 md:max-w-[640px]">
      <header className="px-4 pt-6">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="mt-2 h-7 w-48" />
        <Skeleton className="mt-2 h-3.5 w-40" />
      </header>

      <div className="mt-6 px-4">
        <Skeleton className="h-14 w-full rounded-[14px]" />
      </div>

      <NextSessionSkeleton />

      <section className="mt-10">
        <Skeleton className="mb-4 ml-4 h-5 w-36" />
        <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-hidden px-4">
          {Array.from({ length: 3 }, (_, i) => (
            <ProArticleCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
