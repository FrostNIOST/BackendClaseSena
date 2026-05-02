//import { useState } from "react";
import Nav from "./Components/Nav/Nav";
import Index from "./Components/Pages/Index";
import Shop from "./Components/Pages/Shop";
import ProductDetails from "./Components/Pages/ProductDetails";
import Footer from "./Components/Footer/Footer";
import Login from "./Components/Pages/Login";
import Register from "./Components/Pages/Register";
import Dashboard from "./Components/Pages/Dashboard";
import Category from "./Components/Pages/Category";
import Categorylist from "./Components/Pages/Categorylist";
import Wishlist from "./Components/Pages/Wishlist";
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
            <Route path="/categories" element={<Categorylist />} />
            <Route path="/categories/:id" element={<Category />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/panel" element={<Dashboard />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </main>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;
