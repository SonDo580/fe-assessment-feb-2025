import { Route, Routes } from "react-router-dom";

import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      {/* <Route path="*" element={<div>Page not found</div>} /> */}
    </Routes>
  );
}

export default App;
