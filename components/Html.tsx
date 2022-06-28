import { MathJax, MathJaxContext } from "better-react-mathjax";

type Props = {
  children: string;
  className?: string;
};

export default function Html({ children, className }: Props) {
  return (
    <MathJaxContext>
      <MathJax hideUntilTypeset="first">
        <span
          className={className}
          dangerouslySetInnerHTML={{ __html: children }}
        />
      </MathJax>
    </MathJaxContext>
  );
}
