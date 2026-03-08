interface EmailTemplateProps {
  firstName: string;
  inviteToken: string;
}

export function EmailTemplate({ firstName, inviteToken }: EmailTemplateProps) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/register?token=${inviteToken}`;

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
          padding: "20px 0",
          borderBottom: "2px solid #e62b1e",
        }}
      >
        <h1
          style={{
            color: "#e62b1e",
            fontSize: "32px",
            fontWeight: "bold",
            margin: "0",
            letterSpacing: "2px",
          }}
        >
          TEDx New Cairo STEM Youth
        </h1>
        <p
          style={{
            color: "#666",
            fontSize: "14px",
            margin: "5px 0 0 0",
            fontStyle: "italic",
          }}
        >
          independently organized TED event
        </p>
      </div>

      {/* Main Content */}
      <div style={{ marginBottom: "30px" }}>
        <h2
          style={{
            color: "#333",
            fontSize: "24px",
            marginBottom: "15px",
          }}
        >
          You&apos;re Invited to Join TEDx CommitHub!
        </h2>

        <p
          style={{
            color: "#555",
            fontSize: "16px",
            lineHeight: "1.6",
            marginBottom: "20px",
          }}
        >
          Dear <strong>{firstName}</strong>,
        </p>

        <p
          style={{
            color: "#555",
            fontSize: "16px",
            lineHeight: "1.6",
            marginBottom: "20px",
          }}
        >
          We&apos;re thrilled to invite you to join the TEDx CommitHub platform!
          This is our dedicated workspace where passionate volunteers like you
          collaborate, organize events, and make ideas worth spreading come to
          life.
        </p>

        <p
          style={{
            color: "#555",
            fontSize: "16px",
            lineHeight: "1.6",
            marginBottom: "25px",
          }}
        >
          As a member of our community, you&apos;ll have the opportunity to:
        </p>

        <ul
          style={{
            color: "#555",
            fontSize: "16px",
            lineHeight: "1.6",
            marginLeft: "20px",
            marginBottom: "25px",
          }}
        >
          <li style={{ marginBottom: "8px" }}>
            Collaborate with fellow TEDx enthusiasts
          </li>
          <li style={{ marginBottom: "8px" }}>
            Contribute to organizing amazing events
          </li>
          <li style={{ marginBottom: "8px" }}>
            Track your impact and earn recognition
          </li>
          <li style={{ marginBottom: "8px" }}>
            Be part of a global community of changemakers
          </li>
        </ul>
      </div>

      {/* Call to Action */}
      <div
        style={{
          textAlign: "center",
          margin: "30px 0",
          padding: "25px",
          backgroundColor: "#f8f8f8",
          borderRadius: "8px",
        }}
      >
        <p
          style={{
            color: "#333",
            fontSize: "16px",
            marginBottom: "15px",
            fontWeight: "bold",
          }}
        >
          Ready to start your TEDx journey?
        </p>

        <a
          href={inviteUrl}
          style={{
            display: "inline-block",
            backgroundColor: "#e62b1e",
            color: "white",
            padding: "12px 30px",
            textDecoration: "none",
            borderRadius: "25px",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "background-color 0.3s ease",
          }}
        >
          Accept Invitation & Complete Registration
        </a>

        <p
          style={{
            color: "#666",
            fontSize: "12px",
            marginTop: "15px",
            marginBottom: "0",
          }}
        >
          This invitation expires in 48 hours
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "40px",
          padding: "20px 0",
          borderTop: "1px solid #eee",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#666",
            fontSize: "14px",
            margin: "0 0 10px 0",
          }}
        >
          Questions? Reach out to our team at{" "}
          <a
            href="mailto:hello@updates.rashadhussein.com"
            style={{ color: "#e62b1e" }}
          >
            hello@updates.rashadhussein.com
          </a>
        </p>

        <p
          style={{
            color: "#999",
            fontSize: "12px",

            margin: "0",
            lineHeight: "1.4",
          }}
        >
          This invitation was sent to you because you were selected to join the
          TEDx community.
          <br />
          If you believe this was sent in error, please disregard this email.
        </p>

        <div
          style={{
            marginTop: "15px",
            fontSize: "12px",
            color: "#999",
          }}
        >
          <p style={{ margin: "0" }}>
            © 2024 TEDx CommitHub. All rights reserved.
          </p>
          <p style={{ margin: "5px 0 0 0", fontStyle: "italic" }}>
            This independent TEDx event is operated under license from TED.
          </p>
        </div>
      </div>
    </div>
  );
}
