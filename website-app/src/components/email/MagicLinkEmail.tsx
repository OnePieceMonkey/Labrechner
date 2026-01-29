import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface MagicLinkEmailProps {
  email: string;
  loginUrl: string;
}

export function MagicLinkEmail({ email, loginUrl }: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Ihr Labrechner Login-Link</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={brandBar} />
          <Section style={content}>
            <Heading style={logoText}>Labrechner</Heading>
            <Heading style={heading}>Ihr Login-Link</Heading>

            <Text style={paragraph}>
              Wir haben einen sicheren Login-Link fuer Ihr Konto erstellt.
            </Text>

            <Text style={metaText}>Empfaenger: {email}</Text>

            <Section style={buttonSection}>
              <Button style={button} href={loginUrl}>
                Jetzt anmelden
              </Button>
            </Section>

            <Text style={smallText}>
              Falls der Button nicht funktioniert, kopieren Sie diesen Link in
              Ihren Browser:
            </Text>
            <Section style={linkWrap}>
              <Link href={loginUrl} style={link} title={loginUrl}>
                {loginUrl}
              </Link>
            </Section>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              Diese E-Mail wurde automatisch von Labrechner versendet.
            </Text>
            <Text style={footerText}>
              Hilfe:{" "}
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

const main: React.CSSProperties = {
  backgroundColor: "#F5F3FF",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  margin: 0,
  padding: "24px",
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "600px",
  borderRadius: "12px",
  overflow: "hidden",
  border: "1px solid #EDE9FE",
};

const brandBar: React.CSSProperties = {
  height: "4px",
  background:
    "linear-gradient(90deg, #8B5CF6 0%, #A78BFA 50%, #8B5CF6 100%)",
};

const content: React.CSSProperties = {
  padding: "32px",
  textAlign: "center" as const,
};

const logoText: React.CSSProperties = {
  color: "#8B5CF6",
  fontSize: "22px",
  fontWeight: "700",
  margin: "0 0 16px 0",
};

const heading: React.CSSProperties = {
  color: "#111827",
  fontSize: "22px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const paragraph: React.CSSProperties = {
  color: "#4B5563",
  fontSize: "15px",
  lineHeight: "22px",
  margin: "0 0 10px 0",
};

const metaText: React.CSSProperties = {
  color: "#6B7280",
  fontSize: "13px",
  margin: "0",
};

const buttonSection: React.CSSProperties = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button: React.CSSProperties = {
  backgroundColor: "#8B5CF6",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const smallText: React.CSSProperties = {
  color: "#9CA3AF",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0 0 8px 0",
};

const linkWrap: React.CSSProperties = {
  margin: "0 auto",
  maxWidth: "320px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const link: React.CSSProperties = {
  color: "#7C3AED",
  fontSize: "12px",
  textDecoration: "underline",
};

const hr: React.CSSProperties = {
  borderColor: "#E5E7EB",
  margin: "0",
};

const footer: React.CSSProperties = {
  padding: "20px 32px",
};

const footerText: React.CSSProperties = {
  color: "#9CA3AF",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0 0 8px 0",
  textAlign: "center" as const,
};

const footerLink: React.CSSProperties = {
  color: "#8B5CF6",
  textDecoration: "underline",
};

export default MagicLinkEmail;
