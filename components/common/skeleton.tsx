import { cn } from '@/lib/utils';

/**
 * Skeleton générique avec shimmer animé.
 * Usage : <Skeleton className="h-4 w-24" />
 */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('nk-skeleton rounded-md', className)} aria-hidden="true" />;
}

/* Skeleton ProArticleCard pour /recherche pendant le chargement DB */
export function ProArticleCardSkeleton() {
  return (
    <article
      aria-hidden="true"
      className="bg-card border-border/40 flex w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-[18px] border md:w-[340px]"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="aspect-[4/3] w-full">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="mt-1.5 h-3 w-1/2" />
          </div>
          <div className="text-right">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="mt-1 h-2.5 w-10" />
          </div>
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="border-border/40 mt-auto flex items-center justify-between border-t pt-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </article>
  );
}

/* Skeleton NextSessionCard pour /accueil */
export function NextSessionSkeleton() {
  return (
    <section className="mt-6 px-4" aria-hidden="true">
      <Skeleton className="mb-2 h-3 w-32" />
      <div className="bg-card border-border/40 rounded-xl border p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-1.5 h-5 w-32" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="border-border/40 mt-3 flex items-center gap-3 border-t pt-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="mt-1 h-2.5 w-1/3" />
          </div>
        </div>
      </div>
    </section>
  );
}
