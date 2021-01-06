type Props = {
  children: string;
};

export default function Html({ children }: Props) {
  return <span dangerouslySetInnerHTML={{ __html: children }} />;
}
