import { Message } from "@/types";
import clsx from "clsx";

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={clsx("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={clsx(
          "rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-wrap",
          isUser ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
