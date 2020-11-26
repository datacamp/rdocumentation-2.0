export default function Footer() {
  return (
    <footer className="absolute bottom-0 inset-x-0 flex justify-center pb-4 text-center">
      <div>
        Powered by{' '}
        <a
          className="underline"
          href="https://www.datacamp.com/"
          target="_blank"
          rel="noreferrer"
        >
          DataCamp
        </a>
      </div>
    </footer>
  );
}
