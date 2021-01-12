type Props = {
  children: React.ReactNode;
};

export default function GridListContainer({ children }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 mt-5 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
      {children}
    </div>
  );
}
