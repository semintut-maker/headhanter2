/** @format */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import VacanciesPage from "./pages/VacanciesPage";
import VacancyPage from "./pages/VacancyPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const basename = import.meta.env.PROD ? "/headhunter2" : "/";

  return (
    <BrowserRouter basename={basename}>
      <Header />
      <Routes>
        <Route
          path='/'
          element={
            <Navigate
              to='/vacancies/moscow'
              replace
            />
          }
        />
        <Route
          path='/vacancies/moscow'
          element={<VacanciesPage />}
        />
        <Route
          path='/vacancies/petersburg'
          element={<VacanciesPage />}
        />
        <Route
          path='/vacancies/:id'
          element={<VacancyPage />}
        />
        <Route
          path='*'
          element={<NotFoundPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
