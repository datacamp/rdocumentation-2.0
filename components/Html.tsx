type Props = {
  children: string;
  className?: string;
};

export default function Html({ children, className }: Props) {
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  );
}
