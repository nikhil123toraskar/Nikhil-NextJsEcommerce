import { wixClientServer } from "@/lib/wixClientServer";
import CategoryCarousel from "./CategoryCarousel";

const CategoryList = async () => {
  const wixClient = await wixClientServer();

  const cats = await wixClient.collections
    .queryCollections()
    .find();

  return <CategoryCarousel categories={cats.items} />;
};

export default CategoryList;