import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'

@Injectable()
export class EmailService {
  private resend = new Resend(process.env.RESEND_API_KEY)

  async sendVerificationEmail(email: string, token: string) {
    const url = `${process.env.FRONTEND_URL}/verificar?token=${token}`
    await this.resend.emails.send({
      from: 'WYD Hub <noreply@wydhub.com>',
      to: email,
      subject: 'Confirme seu email — WYD Hub',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #18181b; color: #e4e4e7; border-radius: 12px;">
          <h1 style="color: #f59e0b; font-size: 24px; margin: 0 0 16px;">WYD Hub</h1>
          <p style="color: #a1a1aa; margin: 0 0 24px;">Confirme seu endereço de email para garantir acesso à sua conta.</p>
          <a href="${url}" style="display: inline-block; background: #f59e0b; color: #000; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            Confirmar email
          </a>
          <p style="color: #52525b; font-size: 12px; margin: 24px 0 0;">
            Se você não criou uma conta no WYD Hub, ignore este email.<br/>
            Link válido por 24 horas.
          </p>
        </div>
      `,
    })
  }
}
