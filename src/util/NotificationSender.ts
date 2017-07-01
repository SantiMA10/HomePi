import * as gcm from "node-gcm";

export interface NotificationMessage{
    title : string,
    icon : string,
    body : string
}

export class NotificationSender{

    /**
     * Envia una notificación push mediante Firebase Cloud Messaging
     * @param messageInfo titulo y conteido del mensaje
     * @param recipients lista de ids de dispositivos a los que se va a enviar el mensaje
     */
    public sendNotification(messageInfo : NotificationMessage, recipients : string[]){

        if(recipients.length > 0){
            let sender = new gcm.Sender(process.env.SENDER_ID);
            let message = new gcm.Message({ notification : messageInfo });

            sender.sendNoRetry(message, recipients, (error, message) => {
            });
        }

    }

}