import { RichMenu } from "@line/bot-sdk";

export const richMenuObjectA = (): RichMenu => ({
  size: {
    width: 2500,
    height: 1686
  },
  selected: true,
  name: "richmenu",
  chatBarText: "Tap to open",
  areas: [
    {
      bounds: {
        x: 0,
        y: 0,
        width: 833,
        height: 843
      },
      action: {
        type: "postback",
        data: "dateTime"
      }
    },
    {
      bounds: {
        x: 833,
        y: 0,
        width: 833,
        height: 843
      },
      action: {
        type: "postback",
        data: "location"
      }
    },
    {
      bounds: {
        x: 1666,
        y: 0,
        width: 833,
        height: 843
      },
      action: {
        type: "postback",
        data: "menu"
      }
    },
    {
      bounds: {
        x: 0,
        y: 843,
        width: 833,
        height: 843
      },
      action: {
        type: "postback",
        data: "groomProfile"
      }
    },
    {
      bounds: {
        x: 833,
        y: 843,
        width: 833,
        height: 843
      },
      action: {
        type: "postback",
        data: "brideProfile"
      }
    },
    {
      bounds: {
        x: 1666,
        y: 843,
        width: 833,
        height: 843
      },
      action: {
        type: "postback",
        data: "seatingChart"
      }
    }
  ]
})
