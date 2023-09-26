import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import BookingPage from "./pages/BookingPage";
import ManagePage from "./pages/ManagePage";
import AdminManagePage from "./pages/AdminManagePage";


function App() {
  return (
    <BrowserRouter>
     <Header />
        <Routes>
          <Route path="/" element={<BookingPage />}/>
          <Route path="manage-booking" element={ <ManagePage />}/>
          <Route path="all-bookings" element={ <AdminManagePage />}/>
          </Routes>
    </BrowserRouter>
  );
}

export default App;
