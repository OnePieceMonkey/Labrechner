import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface InvoiceEmailProps {
  invoiceNumber: string;
  recipientName: string;
  labName: string;
  invoiceDate: string;
  total: number;
  shareUrl: string;
  dueDate?: string;
}

export function InvoiceEmail({
  invoiceNumber,
  recipientName,
  labName,
  invoiceDate,
  total,
  shareUrl,
  dueDate,
}: InvoiceEmailProps) {
  const formattedTotal = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(total);

  const formattedDate = new Date(invoiceDate).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const formattedDueDate = dueDate
    ? new Date(dueDate).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : null;

  return (
    <Html>
      <Head />
      <Preview>
        Ihre Rechnung {invoiceNumber} von {labName} - {formattedTotal}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Heading style={logoText}>Labrechner</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={heading}>Ihre Rechnung</Heading>

            <Text style={paragraph}>
              {recipientName ? `Sehr geehrte/r ${recipientName},` : 'Sehr geehrte Damen und Herren,'}
            </Text>

            <Text style={paragraph}>
              anbei erhalten Sie Ihre Rechnung von <strong>{labName}</strong>.
            </Text>

            {/* Invoice Details Box */}
            <Section style={detailsBox}>
              <table style={detailsTable}>
                <tbody>
                  <tr>
                    <td style={detailLabel}>Rechnungsnummer:</td>
                    <td style={detailValue}>{invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td style={detailLabel}>Rechnungsdatum:</td>
                    <td style={detailValue}>{formattedDate}</td>
                  </tr>
                  {formattedDueDate && (
                    <tr>
                      <td style={detailLabel}>Fällig bis:</td>
                      <td style={detailValue}>{formattedDueDate}</td>
                    </tr>
                  )}
                  <tr>
                    <td style={detailLabel}>Gesamtbetrag:</td>
                    <td style={detailValueTotal}>{formattedTotal}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* CTA Button */}
            <Section style={buttonSection}>
              <Button style={button} href={shareUrl}>
                Rechnung ansehen
              </Button>
            </Section>

            <Text style={smallText}>
              Dieser Link ist 7 Tage gültig. Bei Fragen wenden Sie sich bitte direkt an {labName}.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Diese E-Mail wurde automatisch über{' '}
              <Link href="https://labrechner.de" style={footerLink}>
                Labrechner.de
              </Link>{' '}
              versendet.
            </Text>
            <Text style={footerText}>
              Bei technischen Problemen:{' '}
              <Link href="mailto:support@labrechner.de" style={footerLink}>
                support@labrechner.de
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main: React.CSSProperties = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  maxWidth: '600px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
};

const header: React.CSSProperties = {
  backgroundColor: '#8B5CF6',
  padding: '24px 32px',
  borderRadius: '8px 8px 0 0',
};

const logoText: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0',
  textAlign: 'center' as const,
};

const content: React.CSSProperties = {
  padding: '32px',
};

const heading: React.CSSProperties = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0 0 24px 0',
};

const paragraph: React.CSSProperties = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
};

const detailsBox: React.CSSProperties = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const detailsTable: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const detailLabel: React.CSSProperties = {
  color: '#6b7280',
  fontSize: '14px',
  padding: '8px 0',
  textAlign: 'left' as const,
  width: '50%',
};

const detailValue: React.CSSProperties = {
  color: '#1f2937',
  fontSize: '14px',
  fontWeight: '500',
  padding: '8px 0',
  textAlign: 'right' as const,
};

const detailValueTotal: React.CSSProperties = {
  ...detailValue,
  color: '#8B5CF6',
  fontSize: '18px',
  fontWeight: '700',
};

const buttonSection: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button: React.CSSProperties = {
  backgroundColor: '#8B5CF6',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
};

const smallText: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '13px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  margin: '0',
};

const hr: React.CSSProperties = {
  borderColor: '#e5e7eb',
  margin: '0',
};

const footer: React.CSSProperties = {
  padding: '24px 32px',
};

const footerText: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0 0 8px 0',
  textAlign: 'center' as const,
};

const footerLink: React.CSSProperties = {
  color: '#8B5CF6',
  textDecoration: 'underline',
};

export default InvoiceEmail;
