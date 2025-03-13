import "./App.css";
import axios from "axios";
import { Box } from "@chakra-ui/react";

import ProductsTable from "./components/sleakops/product-table";

import Navbar from "./components/sleakops/navbar";
import Footer from "./components/sleakops/footer";
import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api");
        if (response.data && response.data.products && response.data.terms) {
          const { products, terms } = response.data;
  
          const transformedProducts = Object.entries(products).map(([sku, product]: [string, any]) => {
            // Obtener precio OnDemand
            let onDemandPrice = "0";
            const onDemandTerms = terms.OnDemand?.[sku];
  
            if (onDemandTerms) {
              const termKey = Object.keys(onDemandTerms)[0]; // Primera clave de los términos
              const priceDimension = Object.values(onDemandTerms[termKey]?.priceDimensions || {})[0] as any;
              
              if (priceDimension && typeof priceDimension === "object" && priceDimension.pricePerUnit?.USD) {
                onDemandPrice = priceDimension.pricePerUnit.USD;
              }
            }
  
            // Obtener precios Reserved
            const reservedPrices: { [key: string]: { [key: string]: string } } = {};
            const reservedTerms = terms.Reserved?.[sku];
  
            if (reservedTerms) {
              Object.entries(reservedTerms).forEach(([_, termValue]: [string, any]) => {
                const leaseContractLength = termValue?.termAttributes?.LeaseContractLength || "Unknown";
                const purchaseOption = termValue?.termAttributes?.PurchaseOption || "Unknown";
  
                if (!reservedPrices[leaseContractLength]) {
                  reservedPrices[leaseContractLength] = {};
                }
  
                const priceDimension = Object.values(termValue.priceDimensions || {})[0] as any;
                if (priceDimension && typeof priceDimension === "object" && priceDimension.pricePerUnit?.USD) {
                  reservedPrices[leaseContractLength][purchaseOption] = priceDimension.pricePerUnit.USD;
                }
              });
            }
  
            return {
              sku,
              instanceType: product.attributes?.instanceType || "",
              databaseEngine: product.attributes?.databaseEngine || "",
              memory: product.attributes?.memory || "",
              vcpu: product.attributes?.vcpu || "",
              location: product.attributes?.location || "",
              terms: {
                OnDemand: { USD: onDemandPrice },
                Reserved: reservedPrices
              }
            };
          });
  
          setProducts(transformedProducts);
        } else {
          setError("Invalid data format received from API");
          console.log(response.data);
        }
      } catch (err) {
        setError("Error fetching products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);

  return (
    <Box>
      <Navbar />
      {loading ? (
        <Box px={10} textAlign="center" color="white">
          Loading...
        </Box>
      ) : error ? (
        <Box px={10} textAlign="center" color="red.500">
          {error}
        </Box>
      ) : (
        <ProductsTable products={products} />
      )}
      <Footer />
    </Box>
  );
}

export default App;
