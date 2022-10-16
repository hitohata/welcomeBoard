import { Message, TemplateMessage } from "@line/bot-sdk";
import { IMessageDb } from "database/IMessageDb";

export interface IProfileHandler {
  profileTemplate(): TemplateMessage
  groomProfileMessage(): Promise<Message>
  brideProfileMessage(): Promise<Message>
}

export class ProfileHandler implements IProfileHandler {

  private readonly groomProfile = "groomProfile";
  private readonly brideProfile = "brideProfile";

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
            data: this.groomProfile
          },
          {
            type: "postback",
            label: "Bride",
            data: this.brideProfile
          }
        ]
      }
    } 

    return profileTemplate;
  };

  public async groomProfileMessage(): Promise<Message> {
    return {
      type: "text",
      text: "TODO"
    }
  }

  public async brideProfileMessage(): Promise<Message> {
    return {
      type: "text",
      text: "TODO"
    }
  }
}
