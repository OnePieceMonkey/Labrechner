import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface SubscriptionRenewalEmailProps {
  recipientName?: string;
  planName: string;
  periodEnd: Date;
  portalUrl: string;
}

export function SubscriptionRenewalEmail({
  recipientName,
  planName,
  periodEnd,
  portalUrl,
}: SubscriptionRenewalEmailProps) {
  const formattedDate = periodEnd.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <Html>
      <Head />
      <Preview>
        Ihr Jahresabo verlaengert sich bald - {planName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logoText}>Labrechner</Heading>
          </Section>

          <Section style={content}>
            <Heading style={heading}>Abo-Hinweis</Heading>

            <Text style={paragraph}>
              {recipientName ? `Hallo ${recipientName},` : 'Hallo,'}
            </Text>

            <Text style={paragraph}>
              Ihr Jahresabo ({planName}) verlaengert sich am {formattedDate}.
              Wenn Sie kuendigen moechten, koennen Sie das im Kundenportal tun.
            </Text>

            <Section style={buttonSection}>
              <Button style={button} href={portalUrl}>
                Abo verwalten
              </Button>
            </Section>

            <Text style={smallText}>
              Falls Sie Fragen haben, antworten Sie gern auf diese E-Mail.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              Diese E-Mail wurde automatisch von Labrechner versendet.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

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
  fontSize: '22px',
  fontWeight: '600',
  margin: '0 0 24px 0',
};

const paragraph: React.CSSProperties = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
};

const buttonSection: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '24px 0',
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
  padding: '12px 28px',
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
  padding: '20px 32px',
};

const footerText: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0',
  textAlign: 'center' as const,
};

export default SubscriptionRenewalEmail;
