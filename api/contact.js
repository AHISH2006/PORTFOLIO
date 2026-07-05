  // api/contact.js
  import nodemailer from "nodemailer";

  export default async function handler(req, res) {
    // We only want to handle POST requests to this endpoint
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    // --- Start of New Debugging Logs ---
    console.log("Contact API endpoint hit.");
    console.log("Checking for environment variables...");

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const toEmail = process.env.EMAIL_TO;

    // These will show up in your Vercel logs and tell us if the variables are loaded
    if (!user) console.error("ERROR: EMAIL_USER environment variable is not loaded.");
    if (!pass) console.error("ERROR: EMAIL_PASS environment variable is not loaded.");
    if (!toEmail) console.error("ERROR: EMAIL_TO environment variable is not loaded.");
    // --- End of New Debugging Logs ---

    const { name, email, subject, message } = req.body;

    // Basic validation to ensure all fields are filled out
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // A final check before attempting to send the email
    if (!user || !pass || !toEmail) {
      console.error("Server configuration error: Missing one or more required environment variables.");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: user,
        pass: pass,
      },
    });

    try {
      console.log("Attempting to send email...");
      await transporter.sendMail({
        from: `"Portfolio" <${user}>`,
        to: toEmail,
        replyTo: email,
        subject: `New Portfolio Message: ${subject}`,
        html: `
          <h2>New Message from your Portfolio Contact Form</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });
      
      console.log("Email sent successfully!");
      return res.status(200).json({ message: "Email sent successfully" });

    } catch (error) {
      // This will now log the SPECIFIC error from Nodemailer/Google
      console.error("NODEMAILER ERROR:", error);
      return res.status(500).json({ message: "Failed to send email" });
    }
  }

