import "./globals.css";

export const metadata = {
  title: "MatchStake",
  description: "Skill-based matches. Real stakes.",
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

