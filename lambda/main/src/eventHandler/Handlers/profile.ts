import { Message, TemplateMessage } from "@line/bot-sdk";
import { IMessageDb } from "database/dynamoDb/IMessageDb";

export interface IProfileHandler {
  profileTemplate(): TemplateMessage
  getGroomProfileMessage(): Promise<Message>
  getBrideProfileMessage(): Promise<Message>
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

  public async getGroomProfileMessage(): Promise<Message> {
    const groomProfile = await this.messageDb.getGroomProfile();
    return {
      type: "text",
      text: groomProfile.Profile
    }
  }

  public async getBrideProfileMessage(): Promise<Message> {
    const brideProfile = await this.messageDb.getBrideProfile();
    return {
      type: "text",
      text: brideProfile.Profile
    }
  }

  get groomProfile(): string {
    return this._groomProfile;
  }

  get brideProfile(): string {
    return this._brideProfile;
  }
}
