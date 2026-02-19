import "./globals.css";

export const metadata = {
  title: "MatchStake",
  description: "Competitive skill-based matches",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
