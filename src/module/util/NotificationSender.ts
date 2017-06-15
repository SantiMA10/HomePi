import * as gcm from "node-gcm";
import * as config from "../../../config/config.json";

export interface NotificationMessage{
    title : string,
    icon : string,
    body : string
}

export class NotificationSender{

    public sendNotification(messageInfo : NotificationMessage, recipients : string[]){

        if(recipients.length > 0){
            let sender = new gcm.Sender((<any>config).firebase.senderId);
            let message = new gcm.Message({ notification : messageInfo });

            sender.sendNoRetry(message, recipients, (error, message) => {
            });
        }

    }

}