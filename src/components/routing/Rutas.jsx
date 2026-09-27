import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { GuidedTourPage } from "../pages/GuidedTourFormPage";
import { SelfGuidedTourPage } from "../pages/SelfGuidedTourPage";
import ScrollToTop from "./ScrollToTop";
import { NotFound } from "./NotFound";
import { Home } from "../pages/Home";
import { VisitUsPage } from "../pages/VisitUsPage";
import { Header } from "../layout/header";
import { Nav } from "../layout/Nav";
import { Footer } from "../layout/footer";
import ConfirmarVisitaGrupalPage from "../pages/ConfirmarVisitaGrupalPage";
import { FormVisitPage } from "../pages/FormVisitPage";
import { SignUpPage } from "../pages/SignUpPage";
import { SignInPage } from "../pages/SignInPage";
import ProtectedRoute from "./ProtectedRoute";
import { ReservationsPage } from "../pages/ReservationsPage";
import SelfGuidedReservationDetails from "../group-tours/reservationsComponents/DetailsSelf-GuidedTour";
import ReservationDetails from "../group-tours/reservationsComponents/DetailsGuidedTour";
import ReprogramPage from "../pages/ReprogramPage";
import ConfirmEmailPage from "../pages/ConfirmEmailPage";
import UbicacionInstitucion from "../ubicacion/UbicacionInstitucion";

// 1. Creamos el contenedor Layout que encierra el Header, la sección central y el Footer
const MainLayout = () => {
  return (
    <>
      <Header />
      <section className="content" id="content">
        {/* Aquí adentro React Router inyectará la página que corresponda según la URL */}
        <Outlet />
      </section>
      <Footer />
    </>
  );
};

export const Rutas = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* 2. Envolvemos todas tus rutas normales dentro del Layout común */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/visitanos" element={<VisitUsPage />} />
          <Route
            path="/visitas"
            element={
              <ProtectedRoute>
                <FormVisitPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/visitas/guiada"
            element={
              <ProtectedRoute>
                <GuidedTourPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/visitas/autoguiada"
            element={
              <ProtectedRoute>
                <SelfGuidedTourPage />
              </ProtectedRoute>
            }
          />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/signIn" element={<SignInPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/reservations/:id" element={<ReservationDetails />} />
          <Route
            path="/reservations/:id/self-guided"
            element={<SelfGuidedReservationDetails />}
          />

          <Route
            path="/reservations/:id/reprogram"
            element={<ReprogramPage />}
          />
          <Route path="/confirm-email" element={<ConfirmEmailPage />} />
          <Route
            path="/confirmar-visita-grupal"
            element={<ConfirmarVisitaGrupalPage />}
          />
          <Route path="/test-ubicacion" element={<UbicacionInstitucion />} />
        </Route>

        {/* 3. Dejamos la ruta de error 404 afuera para que NO renderice el Layout */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
