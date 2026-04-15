//import { useState } from "react";
import Nav from "./Components/Nav/Nav";
import Index from "./Components/Pages/Index";
import Shop from "./Components/Pages/Shop";
import ProductDetails from "./Components/Pages/ProductDetails";
import Footer from "./Components/Footer/Footer";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Router>
        <Nav/>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
        </main>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;