import Footer from './Footer';
import Navbar from './Navbar';

export default function Layout({ children, isDark, setIsDark }) {
  return (
    <div className="bg-dc-beige100 text-dc-navy dark:bg-dc-navy dark:text-white">
      <div className="flex flex-col min-h-screen container mx-auto px-10">
        <Navbar isDark={isDark} setIsDark={setIsDark} />
        <div className="flex flex-col flex-grow">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
