export type Reference = {
  id?: string;
  title?: string;
  url?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  references?: Reference[];
};
