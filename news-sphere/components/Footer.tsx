// components/Footer.tsx
export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-white mt-8">
      <div className="container mx-auto px-4 py-6 text-center">
        <p>&copy; {currentYear} NewsSphere. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
