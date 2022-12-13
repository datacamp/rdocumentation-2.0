export default function Footer() {
  return (
    <footer className="absolute inset-x-0 bottom-0 flex items-center justify-center h-20 mt-5 md:mt-10">
      <div>
        Powered by{' '}
        <a
          className="underline"
          href="https://www.datacamp.com/"
          rel="noreferrer"
          target="_blank"
        >
          DataCamp
        </a>
      </div>
    </footer>
  );
}
