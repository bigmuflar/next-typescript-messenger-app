import { User } from './user';
import { Action } from './action';

export class Message {
    public from?: User;
    public content?: any;
    public action?: Action;

    constructor(from: User, content?: string, action?: Action) {
      this.from = from;
      this.content = content;
      this.action = action;
    }
}