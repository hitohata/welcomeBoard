import { Message, TemplateMessage } from "@line/bot-sdk";
import { IMessageDb } from "database/IMessageDb";

export interface IProfileHandler {
  profileTemplate(): TemplateMessage
  groomProfileMessage(): Promise<Message>
  brideProfileMessage(): Promise<Message>
  groomProfile: string
  brideProfile: string
}

export class ProfileHandler implements IProfileHandler {

  private readonly _groomProfile = "groomProfile";
  private readonly _brideProfile = "brideProfile";

  private readonly messageDb: IMessageDb;

  constructor(messageDb: IMessageDb) {
    this.messageDb = messageDb;
  };

  public profileTemplate(): TemplateMessage {
    const profileTemplate: TemplateMessage = {
      type: "template",
      altText: "Our profiles",
      template: {
        type: "buttons",
        title: "Profile",
        text: "Our Profile",
        actions: [
          {
            type: "postback",
            label: "Groom",
            data: this._groomProfile
          },
          {
            type: "postback",
            label: "Bride",
            data: this._brideProfile
          }
        ]
      }
    } 

    return profileTemplate;
  };

  public async groomProfileMessage(): Promise<Message> {
    return {
      type: "text",
      text: "TODO: groom profile"
    }
  }

  public async brideProfileMessage(): Promise<Message> {
    return {
      type: "text",
      text: "TODO"
    }
  }

  get groomProfile(): string {
    return this._groomProfile;
  }

  get brideProfile(): string {
    return this._brideProfile;
  }
}
