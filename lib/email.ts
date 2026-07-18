import * as tls from "tls";

export interface EmailData {
  from: string;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
}

class DirectSMTPClient {
  private config: SMTPConfig;
  private socket: tls.TLSSocket | null = null;

  constructor(config: SMTPConfig) {
    this.config = config;
  }

  private async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = tls.connect({
        host: this.config.host,
        port: this.config.port,
        rejectUnauthorized: false,
      });

      this.socket.on("secureConnect", resolve);
      this.socket.on("error", reject);
      this.socket.setTimeout(30000, () => reject(new Error("Connection timeout")));
    });
  }

  private async waitForGreeting(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject(new Error("Socket not connected"));
      const onData = (data: Buffer) => {
        const greeting = data.toString();
        if (greeting.startsWith("220")) {
          this.socket?.off("data", onData);
          resolve();
        } else if (greeting.startsWith("4") || greeting.startsWith("5")) {
          this.socket?.off("data", onData);
          reject(new Error("Server error: " + greeting));
        }
      };
      this.socket.on("data", onData);
      setTimeout(() => { this.socket?.off("data", onData); reject(new Error("Timeout")); }, 15000);
    });
  }

  private async sendCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject(new Error("Socket not connected"));
      let response = "";
      const onData = (data: Buffer) => {
        response += data.toString();
        const lines = response.split("\r\n");
        const lastCompleteLine = lines[lines.length - 2];
        if (lastCompleteLine && /^\d{3}\s/.test(lastCompleteLine)) {
          this.socket?.off("data", onData);
          resolve(response.trim());
        }
      };
      this.socket.on("data", onData);
      if (command) this.socket.write(command + "\r\n");
      setTimeout(() => { this.socket?.off("data", onData); reject(new Error("SMTP command timeout")); }, 15000);
    });
  }

  private base64(str: string) { return Buffer.from(str).toString("base64"); }

  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      console.log("🔧 SMTP Config:", {
        host: this.config.host,
        port: this.config.port,
        username: this.config.username
      });
      
      await this.connect();
      console.log("✅ SMTP Connected");
      
      await this.waitForGreeting();
      console.log("✅ SMTP Greeting received");
      
      let response = await this.sendCommand("EHLO localhost");
      console.log("✅ EHLO response:", response);
      
      response = await this.sendCommand("AUTH LOGIN");
      console.log("✅ AUTH LOGIN response:", response);
      
      if (!response.includes("334")) throw new Error("AUTH LOGIN not supported");
      
      response = await this.sendCommand(this.base64(this.config.username));
      console.log("✅ Username response:", response);
      
      if (!response.includes("334")) throw new Error("Username rejected");
      
      response = await this.sendCommand(this.base64(this.config.password));
      console.log("✅ Password response:", response);
      
      if (!response.includes("235")) throw new Error("Authentication failed");
      
      response = await this.sendCommand(`MAIL FROM:<${this.config.username}>`);
      console.log("✅ MAIL FROM response:", response);
      
      response = await this.sendCommand(`RCPT TO:<${emailData.to}>`);
      console.log("✅ RCPT TO response:", response);
      
      response = await this.sendCommand("DATA");
      console.log("✅ DATA response:", response);

      const encodedSubject = `=?utf-8?B?${Buffer.from(emailData.subject).toString("base64")}?=`;
      const base64Html = Buffer.from(emailData.html, "utf8").toString("base64");
      const chunkedBase64Html = base64Html.match(/.{1,76}/g)?.join("\r\n") || "";

      const headers = [
        `From: ${emailData.from || this.config.username}`,
        `To: ${emailData.to}`,
        ...(emailData.replyTo ? [`Reply-To: ${emailData.replyTo}`] : []),
        `Subject: ${encodedSubject}`,
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "Content-Transfer-Encoding: base64",
      ];
      const emailContent = [...headers, "", chunkedBase64Html].join("\r\n");

      this.socket?.write(emailContent + "\r\n");
      this.socket?.write(".\r\n");
      response = await this.sendCommand("");
      console.log("✅ Email send response:", response);
      
      await this.sendCommand("QUIT");
      console.log("✅ QUIT sent");
      
      return response.startsWith("250");
    } catch (err) {
      console.error("❌ SMTP Error:", err);
      return false;
    } finally {
      this.socket?.destroy();
      this.socket = null;
    }
  }
}

export async function sendEmailUsingClient(emailData: EmailData): Promise<boolean> {
  if (!emailData.to || !emailData.subject || !emailData.html) throw new Error("Missing email data");

  const client = new DirectSMTPClient({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || "465"),
    secure: true,
    username: process.env.SMTP_USERNAME || "",
    password: process.env.SMTP_PASSWORD || "",
  });

  return await client.sendEmail(emailData);
}
