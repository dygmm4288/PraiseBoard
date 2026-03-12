import Queue from "@/shared/utils/queue";
import sleep from "@/shared/utils/sleep";
import { useRef, useState } from "react";

export type WhaleMessage = {
  message: string;
  userDisabled?: boolean;
  onOk?: () => void;
  waitUser?: boolean;
};
type ChatMessage = {
  type: "text" | "typing";
  role: "system" | "user";
  message?: string;
};

type Props = {
  whaleMessages: WhaleMessage[];
};
/**
 * ChatBubbleList에 들어가는 chat 관리
 */
const useOnboardChat = ({ whaleMessages }: Props) => {
  const queueRef = useRef<Queue<WhaleMessage>>(new Queue(whaleMessages));
  const runningRef = useRef(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [disabled, setDisabled] = useState(true);

  const addUserMessage = async (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        type: "text",
        role: "user",
        message: text,
      },
    ]);

    if (!queueRef.current?.isEmpty()) {
      run();
    }
    await sleep(1200);
  };

  const run = async () => {
    if (runningRef.current) return;
    runningRef.current = true;

    while (!queueRef.current?.isEmpty()) {
      const topMessages = queueRef.current?.pop();
      if (!topMessages) break;

      setMessages((prev) => [...prev, { type: "typing", role: "system" }]);
      await sleep(1200);
      setMessages((prev) => {
        const next = [...prev];
        const lastTypingIdx = next.findLastIndex((m) => m.type === "typing");

        if (lastTypingIdx !== -1) {
          next[lastTypingIdx] = {
            type: "text",
            role: "system",
            message: topMessages.message,
          };
        }
        return next;
      });

      if (topMessages.onOk) topMessages.onOk();
      if (topMessages.userDisabled !== undefined)
        setDisabled(topMessages.userDisabled);
      if (topMessages.waitUser) {
        runningRef.current = false;
        return;
      }
    }

    runningRef.current = false;
  };

  return {
    addUserMessage,
    run,
    messages,
    disabled,
  };
};

export default useOnboardChat;
