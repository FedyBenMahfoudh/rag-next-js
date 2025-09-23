const MessageSkeleton = ({ align = "left" }: { align?: "left" | "right" }) => (
  <div
    className={`flex ${
      align === "right" ? "justify-end" : "justify-start"
    } mb-4`}
  >
    <div
      className={`rounded-lg px-4 py-3 ${
        align === "right"
          ? "bg-blue-200 animate-pulse"
          : "bg-gray-200 animate-pulse"
      } w-2/3 max-w-md`}
    >
      <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    </div>
  </div>
);

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col min-w-0 h-[89vh]">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-full mx-auto space-y-6">
          <MessageSkeleton align="left" />
          <MessageSkeleton align="right" />
          <MessageSkeleton align="left" />
          <MessageSkeleton align="right" />
          <MessageSkeleton align="left" />
        </div>
      </div>
      <div className="sticky bottom-0 left-0 right-0 border-t bg-background p-4 z-10">
        <div className="max-w-full mx-auto">
          <div className="flex items-center gap-3 border bg-muted/50 border-input-border rounded-4xl p-3 shadow-sm">
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1 h-8 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
