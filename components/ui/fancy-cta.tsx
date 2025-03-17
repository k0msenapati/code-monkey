import { cn } from "@/lib/utils";

export const CardBody = ({
  className = "",
  title,
  description
}: {
  className?: string;
  title: string;
  description: string;
}) => (
  <div className={cn("text-center flex flex-col items-center", className)}>
    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
      {title}
    </h3>
    <p className="text-gray-700 dark:text-gray-400 max-w-md">
      {description}
    </p>
  </div>
);

//======================================
export const MultilayerCardV_2 = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="py-14 flex justify-center">
      <div className="relative h-72 sm:h-52 w-full max-w-2xl">
        <div className="absolute inset-0 dark:bg-zinc-900 bg-zinc-100 rounded-3xl border border-neutral-200 dark:border-zinc-800 scale-y-[1.15] scale-x-90 -top-4"></div>

        <div className="absolute inset-0 dark:bg-zinc-950 bg-white rounded-3xl p-6 flex justify-center items-center shadow-lg border border-neutral-200 dark:border-zinc-800">
          {children}
        </div>
      </div>
    </div>
  );
};
