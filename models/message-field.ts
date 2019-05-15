import { Message } from "./message";

export interface MessageField extends Message {
    field: string,
    messages: Message[],
  }