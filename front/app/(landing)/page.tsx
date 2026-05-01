import Header from "../components/navbar/Header";
import Footer from "../components/footer/Footer";
import ProductList from "../components/modules/landing/ProductList";

export default function Home() {
  return (
    <div>
      <Header />
      <main style={{ minHeight: "70vh" }}>
        <ProductList />
      </main>
      <Footer />
    </div>
  );
}
