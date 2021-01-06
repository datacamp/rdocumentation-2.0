import Footer from './Footer';
import Navbar from './Navbar';

type Props = {
  children: React.ReactNode;
  isDark: boolean;
  setIsDark: (state: boolean) => void;
};

export default function Layout({ children, isDark, setIsDark }: Props) {
  return (
    <div className="bg-dc-beige100 text-dc-navy dark:bg-dc-navy dark:text-white">
      <div className="container flex flex-col min-h-screen px-10 mx-auto">
        <Navbar isDark={isDark} setIsDark={setIsDark} />
        <div className="flex flex-col flex-grow">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
