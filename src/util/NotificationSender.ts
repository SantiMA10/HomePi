import * as gcm from "node-gcm";

export interface NotificationMessage{
    title : string,
    icon : string,
    body : string
}

export class NotificationSender{

    public sendNotification(messageInfo : NotificationMessage, recipients : string[]){

        if(recipients.length > 0){
            let sender = new gcm.Sender(process.env.SENDER_ID);
            let message = new gcm.Message({ notification : messageInfo });

            sender.sendNoRetry(message, recipients, (error, message) => {
            });
        }

    }

}