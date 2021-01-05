type Props = {
  children: string;
};

export default function Html({ children }: Props) {
  return <div dangerouslySetInnerHTML={{ __html: children }} />;
}
