import HomeSearchBar from '../components/HomeSearchBar';

export default function HomePage() {
  return (
    <div className="w-2/3 mt-56 mx-auto">
      <h1 className="text-3xl">
        Search all 22,432 R packages on CRAN and Bioconductor
      </h1>
      <HomeSearchBar />
    </div>
  );
}
