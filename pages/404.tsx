import Button from '@datacamp/waffles-button';

type Props = {
  isDark: boolean;
};

export default function Custom404({ isDark }: Props) {
  return (
    <div className="flex flex-col items-center mt-32 md:mt-56">
      <h1 className="text-xl md:text-2xl">Oops, that page doesn't exist.</h1>
      <div className="mt-8">
        <Button
          appearance={isDark ? 'primary' : 'default'}
          href="/"
          intent={isDark ? 'b2b' : 'neutral'}
          size="large"
          type="link"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}
