import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen bg-dc-beige100 text-dc-navy dark:bg-dc-navy dark:text-white">
      <div className="max-w-screen-xl mx-auto">
        <Navbar />
        <div className="px-6 mt-6">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
