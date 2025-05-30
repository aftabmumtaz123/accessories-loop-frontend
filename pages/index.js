import Collection from "@/components/Collection";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import { mongooseConnection } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default function Home({ featuredProduct, newProducts, collectionProduct }) {
  return <>
    <Hero product={featuredProduct} />

    <hr class="my-4 h-px border-0 bg-gray-300" />

    <Products products={newProducts}/>
    <hr class="my-4 h-px border-0 bg-gray-300" />

    <Collection product={collectionProduct} />

  </>
}


export async function getServerSideProps() {
  await mongooseConnection();

  const featuredId = '678a8faed49d422c97b932e9'
  const collectionId = '65814b7febe487e1589d4372'

  const featuredProduct = await Product.findById(featuredId);
  const collectionProduct = await Product.findById(collectionId);
  const newProducts = await Product.find({}, null, {sort: {'_id':1}, limit: 5})

  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      collectionProduct: JSON.parse(JSON.stringify(collectionProduct)),
    }
  }
}