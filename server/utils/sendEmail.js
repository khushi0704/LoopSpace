   // nodemailer verification
import nodemailer from "nodemailer";
   
const sendEmail = async(email,subject,text) => {
     try{
       const transporter = nodemailer.createTransport({
         host: process.env.HOST,
         service: process.env.SERVICE,
         port: Number(process.env.EMAIL_PORT),
         secure: Boolean(process.env.SECURE),
         auth:{
           user: process.env.USER,
           pass: process.env.PASS
         }
       });

      // mailBody
       const mailBody = {
        from: process.env.USER,
        to: email,
        subject: subject,
        text: text,
      };

       const info = await transporter.sendMail(mailBody);
       console.log("Email sent: ", info.response); // Log the response if successful
     }
     catch(error){
      console.error("Email not sent:", error); 
     }
   }
export default sendEmail;