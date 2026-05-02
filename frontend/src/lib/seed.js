import { db } from './firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

const productsData = [
  { id: '1', name: 'Petal Glow Serum', cat: 'Serum', price: '₹1,499', img: 'v1777614636/product_glow_serum_1777524145107_icb4ur.jpg', badge: 'Bestseller', desc: 'Rose hip & vitamin C brightening serum for luminous skin.' },
  { id: '2', name: 'Dew Veil Moisturizer', cat: 'Moisturizer', price: '₹1,899', img: 'v1777614637/product_veil_moisturizer_1777524161649_ponzaw.jpg', badge: 'New', desc: 'Hyaluronic acid & ceramide blend for 48-hour deep hydration.' },
  { id: '3', name: 'Calm & Clear Toner', cat: 'Toner', price: '₹999', img: 'v1777614637/product_clear_toner_1777524178937_kgqmao.jpg', badge: null, desc: 'Niacinamide & green tea essence to minimize pores, balance skin.' },
  { id: '4', name: 'Velvet Night Repair', cat: 'Night Cream', price: '₹2,299', img: 'v1777614636/product_night_repair_1777524200469_ehcvkx.jpg', badge: null, desc: 'Retinol & bakuchiol restorative cream — wake up to softer skin.' }
];

export const seedProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    if (querySnapshot.empty) {
      console.log('Seeding products...');
      for (const product of productsData) {
        await setDoc(doc(db, 'products', product.id), product);
      }
      console.log('Seeding complete!');
    }
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};
