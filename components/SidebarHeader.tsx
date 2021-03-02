type SidebarHeaderProps = {
  children: React.ReactNode;
};

export default function SidebarHeader({ children }: SidebarHeaderProps) {
  return <h4 className="mb-2 text-sm text-gray-500 uppercase">{children}</h4>;
}
