import { cn } from "@/lib/utils";

const CardBody = ({
  className = "",
  title,
  description
}: {
  className?: string;
  title: string;
  description: string;
}) => (
  <div className={cn("text-center flex flex-col items-center", className)}>
    <h3 className="text-xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
      {title}
    </h3>
    <p className="text-gray-700 dark:text-gray-400 max-w-xl md:text-2xl">
      {description}
    </p>
  </div>
);

export const SimpleCard_V7 = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const Icon = ({
    className,
    ...rest
  }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
      <div
        {...rest}
        className={cn(
          'dark:border-zinc-200 border-zinc-700 size-6 absolute',
          className,
        )}
      />
    );
  };

  return (
    <div className="border-2 border-zinc-100 dark:border-zinc-700 relative rounded-md max-w-fit px-6 py-4 mx-auto inline-block">
      <Icon className="-top-0.5 -left-0.5 border-l-2 border-t-2 rounded-tl-md" />
      <Icon className="-top-0.5 -right-0.5 border-r-2 border-t-2 rounded-tr-md" />
      <Icon className="-bottom-0.5 -left-0.5 border-l-2 border-b-2 rounded-bl-md" />
      <Icon className="-bottom-0.5 -right-0.5 border-r-2 border-b-2 rounded-br-md" />
      <CardBody className="text-center p-5 md:p-14" title={title} description={description} />
    </div>
  );
};
