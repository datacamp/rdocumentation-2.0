type SidebarValueProps = {
  children: React.ReactNode;
  Icon?: React.ComponentType;
};

export default function SidebarValue({ Icon, children }: SidebarValueProps) {
  return (
    <div className="flex items-center">
      {Icon && <Icon />}
      <span className={Icon ? 'ml-2' : ''}>{children}</span>
    </div>
  );
}
