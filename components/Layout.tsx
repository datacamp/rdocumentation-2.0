import Footer from './Footer';
import Navbar from './Navbar';

type Props = {
  children: React.ReactNode;
  isDark: boolean;
  setIsDark: (state: boolean) => void;
};

export default function Layout({ children, isDark, setIsDark }: Props) {
  return (
    <div className="flex flex-col w-full max-w-screen-xl min-h-screen px-5 mx-auto md:px-10">
      <Navbar isDark={isDark} setIsDark={setIsDark} />
      <div className="flex flex-col flex-grow">{children}</div>
      <Footer />
    </div>
  );
}
