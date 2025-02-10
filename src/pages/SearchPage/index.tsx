import Banner from "./components/Banner";
import Results from "./components/Results";
import Search from "./components/Search";

function SearchPage() {
  return (
    <>
      <div className="sticky top-0 z-10 bg-white">
        <Banner />
        <Search />
      </div>
      <Results />
    </>
  );
}

export default SearchPage;
