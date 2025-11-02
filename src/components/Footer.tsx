export default function Footer() {
  return (
    <footer id="contact" className="bg-orange-700 text-white py-8 px-8 text-center">
      <h3 className="text-xl font-semibold mb-2">Bhakti Bites</h3>
      <p>Pure. Traditional. Divine.</p>
      <p className="mt-4">📍 Rourkela Odisha, India | ✉️ bhaktibites.food@gmail.com</p>
      <p className="mt-4 text-sm">© {new Date().getFullYear()} Bhakti Bites. All rights reserved.</p>
    </footer>
  );
}
