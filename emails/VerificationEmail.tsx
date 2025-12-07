import { Html, Head, Body, Container, Text, Tailwind } from "@react-email/components";

interface VerificationEmailProps{
    username: string,
    code: string,
}

export default function VerificationEmail({ username, code }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white max-w-lg mx-auto my-8 p-8 rounded-2xl shadow-lg">
            <Text className="text-xl font-semibold text-center text-gray-800">
              Welcome {username}. 🔐 Verify Your Email
            </Text>

            <Text className="text-gray-600 text-center mt-4">
              Use the verification code below to complete your sign-up:
            </Text>

            <Text className="text-4xl tracking-widest font-bold text-indigo-600 text-center bg-indigo-50 p-4 rounded-lg mt-6">
              {code}
            </Text>

            <Text className="text-sm text-gray-500 text-center mt-6">
              This code will expire in 10 minutes.
              <br />
              If you didn’t request this email, you can safely ignore it.
            </Text>

            <Text className="text-xs text-gray-400 text-center mt-8">
              © {new Date().getFullYear()} Your App Name. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
