import HomeSearchBar from '../components/HomeSearchBar';

export default function HomePage() {
  return (
    <div className="w-3/4 mx-auto mt-56">
      <h1 className="text-3xl">
        Search all 22,432 R packages on CRAN and Bioconductor
      </h1>
      <HomeSearchBar />
    </div>
  );
}
