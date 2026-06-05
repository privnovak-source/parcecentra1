import { drizzle } from "drizzle-orm/mysql2";
import { menuItems } from "./schema";
import { count } from "drizzle-orm";
import "dotenv/config";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const db = drizzle(DATABASE_URL, { mode: "planetscale" });

const menuData = [
  // PIZZA 32CM
  { name: "Margherita 32cm", description: "Pelat, mozzarella, bosiljak, maslinovo ulje", price: "960.00", category: "PIZZA_32CM", isPopular: false, sortOrder: 1 },
  { name: "Capricciosa 32cm", description: "Pelat, kačkavalj, šunka, pečurke, origano", price: "960.00", category: "PIZZA_32CM", isPopular: false, sortOrder: 2 },
  { name: "Pepperoni 32cm", description: "Pelat, kulen, kačkavalj, origano", price: "980.00", category: "PIZZA_32CM", isPopular: true, sortOrder: 3 },
  { name: "Slaninica 32cm", description: "Pelat, kačkavalj, slaninica, origano", price: "980.00", category: "PIZZA_32CM", isPopular: false, sortOrder: 4 },
  { name: "Quattro Formaggi 32cm", description: "Pelat, gorgonzola, mozzarella, kačkavalj, parmezan, rukola, origano", price: "1060.00", category: "PIZZA_32CM", isPopular: false, sortOrder: 5 },
  { name: "Quattro Stagione 32cm", description: "Pelat, kačkavalj, šunka, pečurke, jaja, kulen, masline, origano, pavlaka", price: "1060.00", category: "PIZZA_32CM", isPopular: false, sortOrder: 6 },
  { name: "Diavola 32cm", description: "Pelat, mozzarella, kulen, feferoni, masline, origano, ljuti sos", price: "990.00", category: "PIZZA_32CM", isPopular: false, sortOrder: 7 },
  { name: "Vegetariana 32cm", description: "Pelat, kačkavalj, kukuruz, pečurke, crni luk, paradajz, origano, masline, paprika", price: "960.00", category: "PIZZA_32CM", isPopular: false, sortOrder: 8 },
  { name: "Tuna 32cm", description: "Pelat, tuna, posni kačkavalj, kukuruz, masline", price: "990.00", category: "PIZZA_32CM", isPopular: false, sortOrder: 9 },
  { name: "Burger Special 32cm", description: "Sos za roštilj, kačkavalj, čisto juneće meso, burger sos, ajzberg salata, crni luk, korice punjene kačkavaljem", price: "1450.00", category: "PIZZA_32CM", isPopular: false, sortOrder: 10 },
  { name: "Parče Centra Special 32cm", description: "Pelat, mozzarella, kačkavalj, pršuta, pečenica, suvi vrat, bosiljak, maslinovo ulje, crni luk, origano, korice punjene kačkavaljem", price: "1450.00", category: "PIZZA_32CM", isPopular: true, sortOrder: 11 },
  { name: "Calzone Šunka 32cm", description: "Pelat, kačkavalj, šunka, pečurke, pavlaka", price: "980.00", category: "PIZZA_32CM", isPopular: false, sortOrder: 12 },
  { name: "Parče Specijal 2", description: "Pelat, kačkavalj, mozzarella, gorgonzola, parmezan, pečenica, pršuta, masline, čeri paradajz, punjenje korice kačkavaljem, susam", price: "1450.00", category: "PIZZA_32CM", isPopular: false, sortOrder: 13 },
  { name: "Calzone Kulen 32cm", description: "Pelat, kačkavalj, kulen, pečurke, pavlaka", price: "980.00", category: "PIZZA_32CM", isPopular: false, sortOrder: 14 },
  { name: "Calzone Pečenica 32cm", description: "Pelat, kačkavalj, pečenica, pečurke, pavlaka", price: "980.00", category: "PIZZA_32CM", isPopular: false, sortOrder: 15 },
  { name: "Calzone Slaninica 32cm", description: "Pelat, kačkavalj, slaninica, pečurke, pavlaka", price: "980.00", category: "PIZZA_32CM", isPopular: false, sortOrder: 16 },
  { name: "Calzone Pršuta 32cm", description: "Pelat, kačkavalj, pršuta, pečurke, pavlaka", price: "980.00", category: "PIZZA_32CM", isPopular: false, sortOrder: 17 },

  // PIZZA 50CM
  { name: "Margherita 50cm", description: "Pelat, mozzarella, bosiljak, maslinovo ulje", price: "1650.00", category: "PIZZA_50CM", isPopular: false, sortOrder: 1 },
  { name: "Capricciosa 50cm", description: "Pelat, kačkavalj, šunka, pečurke, origano", price: "1650.00", category: "PIZZA_50CM", isPopular: false, sortOrder: 2 },
  { name: "Pepperoni 50cm", description: "Pelat, kulen, kačkavalj, origano", price: "1670.00", category: "PIZZA_50CM", isPopular: false, sortOrder: 3 },
  { name: "Slaninica 50cm", description: "Pelat, kačkavalj, slaninica, origano", price: "1670.00", category: "PIZZA_50CM", isPopular: false, sortOrder: 4 },
  { name: "Quattro Formaggi 50cm", description: "Pelat, gorgonzola, mozzarella, kačkavalj, parmezan, rukola, origano", price: "1800.00", category: "PIZZA_50CM", isPopular: false, sortOrder: 5 },
  { name: "Quattro Stagione 50cm", description: "Pelat, kačkavalj, šunka, pečurke, jaja, kulen, masline, origano, pavlaka", price: "1800.00", category: "PIZZA_50CM", isPopular: false, sortOrder: 6 },
  { name: "Diavola 50cm", description: "Pelat, mozzarella, kulen, feferoni, masline, origano, ljuti sos", price: "1650.00", category: "PIZZA_50CM", isPopular: false, sortOrder: 7 },
  { name: "Vegetariana 50cm", description: "Pelat, kačkavalj, kukuruz, pečurke, crni luk, paradajz, origano, masline, paprika", price: "1670.00", category: "PIZZA_50CM", isPopular: false, sortOrder: 8 },
  { name: "Tuna 50cm", description: "Pelat, tuna, posni kačkavalj, kukuruz, masline", price: "1650.00", category: "PIZZA_50CM", isPopular: false, sortOrder: 9 },
  { name: "Burger Special 50cm", description: "Sos za roštilj, kačkavalj, čisto juneće meso, burger sos, ajzberg salata, crni luk, korice punjene kačkavaljem", price: "2200.00", category: "PIZZA_50CM", isPopular: false, sortOrder: 10 },
  { name: "Parče Centra Special 50cm", description: "Pelat, mozzarella, kačkavalj, pršuta, pečenica, suvi vrat, bosiljak, maslinovo ulje, crni luk, origano, korice punjene kačkavaljem", price: "2200.00", category: "PIZZA_50CM", isPopular: false, sortOrder: 11 },

  // SLATKA PIZZA 32CM
  { name: "Chocco Tropic 32cm", description: "Nutela, banane, jagode, plazma, preliv čokolada", price: "1350.00", category: "SLATKA_PIZZA_32CM", isPopular: true, sortOrder: 1 },
  { name: "Chocco Kinder 32cm", description: "Nutela, kinder bueno, preliv od pistaća, kinder čokoladica, jagoda", price: "1350.00", category: "SLATKA_PIZZA_32CM", isPopular: false, sortOrder: 2 },

  // SLATKA PIZZA 50CM
  { name: "Chocco Tropic 50cm", description: "Nutela, banane, jagode, plazma, preliv čokolada", price: "2200.00", category: "SLATKA_PIZZA_50CM", isPopular: false, sortOrder: 1 },
  { name: "Chocco Kinder 50cm", description: "Nutela, kinder bueno, preliv od pistaća, kinder čokoladica, jagoda", price: "2200.00", category: "SLATKA_PIZZA_50CM", isPopular: false, sortOrder: 2 },

  // PALAČINKA
  { name: "Nutela Mix", description: "Nutela, plazma, banane, jagode, preliv od pistaća, preliv od čokolade", price: "500.00", category: "PALAČINKA", isPopular: true, sortOrder: 1 },
  { name: "Eurokrem", description: "", price: "300.00", category: "PALAČINKA", isPopular: false, sortOrder: 2 },
  { name: "Eurokrem Plazma", description: "", price: "350.00", category: "PALAČINKA", isPopular: false, sortOrder: 3 },
  { name: "Palačinka Nutela", description: "", price: "370.00", category: "PALAČINKA", isPopular: false, sortOrder: 4 },
  { name: "Nutela Plazma", description: "", price: "400.00", category: "PALAČINKA", isPopular: false, sortOrder: 5 },
  { name: "Nutela, Plazma, Banane", description: "", price: "450.00", category: "PALAČINKA", isPopular: false, sortOrder: 6 },
  { name: "Nutela, Plazma, Jagode", description: "", price: "450.00", category: "PALAČINKA", isPopular: false, sortOrder: 7 },
  { name: "Kinder Box Seckana", description: "Kutija box seckana palačinka, nutela, plazma, kinder", price: "500.00", category: "PALAČINKA", isPopular: false, sortOrder: 8 },
  { name: "Jagoda Box Seckana", description: "Kutija box sa seckanom palačinkom, nutelom, jagodama, preliv od jagoda", price: "500.00", category: "PALAČINKA", isPopular: false, sortOrder: 9 },
  { name: "Pohovana Slatka Kinder", description: "Pohovana palačinka, nutela, plazma, kinder bueno, banana", price: "550.00", category: "PALAČINKA", isPopular: false, sortOrder: 10 },
  { name: "Pohovana Slana sa Pečenicicom", description: "Pohovana palačinka, pečenica, kačkavalj, pavlaka", price: "550.00", category: "PALAČINKA", isPopular: false, sortOrder: 11 },
  { name: "Nutela, Malina, Plazma", description: "Nutela, plazma, nadev od maline", price: "450.00", category: "PALAČINKA", isPopular: false, sortOrder: 12 },

  // SOMUNI
  { name: "Somun Kulen", description: "Kulen, pavlaka, kačkavalj, paradajz, zelena salata", price: "400.00", category: "SOMUN", isPopular: false, sortOrder: 1 },
  { name: "Somun Pečenica", description: "Pečenica, kačkavalj, pavlaka, paradajz, zelena salata", price: "400.00", category: "SOMUN", isPopular: true, sortOrder: 2 },
  { name: "Somun Tuna", description: "Tuna, zelena salata, paradajz, kukuruz, masline", price: "400.00", category: "SOMUN", isPopular: false, sortOrder: 3 },
  { name: "Somun Pršuta", description: "Crnogorska pršuta, mozzarella, pavlaka, zelena salata, paradajz", price: "600.00", category: "SOMUN", isPopular: false, sortOrder: 4 },
  { name: "Somun Poh Piletina", description: "Pohovana piletina, pavlaka, zelena salata, paradajz, kačkavalj", price: "600.00", category: "SOMUN", isPopular: true, sortOrder: 5 },
  { name: "Mali Somuni Kulen 4 komada", description: "Mali somuni sa kulenom, zelena salata, pavlaka, paradajz", price: "550.00", category: "SOMUN", isPopular: false, sortOrder: 6 },
  { name: "Mali Somuni Pečenica 4 komada", description: "Somuni 4 komada, pavlaka, paradajz, pečenica", price: "550.00", category: "SOMUN", isPopular: false, sortOrder: 7 },
  { name: "Mali Somuni Suvi Vrat 4 komada", description: "Mali somuni 4 komada, suvi vrat, pavlaka, zelena salata, paradajz", price: "550.00", category: "SOMUN", isPopular: false, sortOrder: 8 },

  // PIĆE
  { name: "Pepsi 0.5l", description: "", price: "180.00", category: "PIĆE", subcategory: "Sokovi", isPopular: false, sortOrder: 1 },
  { name: "Pepsi Zero 0.5l", description: "", price: "180.00", category: "PIĆE", subcategory: "Sokovi", isPopular: false, sortOrder: 2 },
  { name: "Mirinda 0.5l", description: "", price: "180.00", category: "PIĆE", subcategory: "Sokovi", isPopular: false, sortOrder: 3 },
  { name: "7up 0.5l", description: "", price: "180.00", category: "PIĆE", subcategory: "Sokovi", isPopular: false, sortOrder: 4 },
  { name: "Tube narandža 0.5l", description: "", price: "180.00", category: "PIĆE", subcategory: "Sokovi", isPopular: false, sortOrder: 5 },
  { name: "Aqua viva ledeni čaj 0.5l", description: "", price: "180.00", category: "PIĆE", subcategory: "Sokovi", isPopular: false, sortOrder: 6 },
  { name: "Guarana 0.25l", description: "", price: "180.00", category: "PIĆE", subcategory: "Sokovi", isPopular: false, sortOrder: 7 },
  { name: "Remix narandža 0.33l", description: "", price: "180.00", category: "PIĆE", subcategory: "Sokovi", isPopular: false, sortOrder: 8 },
  { name: "Pepsi 0.33l", description: "", price: "170.00", category: "PIĆE", subcategory: "Sokovi", isPopular: false, sortOrder: 9 },
  { name: "Pepsi Zero 0.33l", description: "", price: "170.00", category: "PIĆE", subcategory: "Sokovi", isPopular: false, sortOrder: 10 },
  { name: "Ivi 0.33l", description: "", price: "170.00", category: "PIĆE", subcategory: "Sokovi", isPopular: false, sortOrder: 11 },
  { name: "Aqua viva 0.5l", description: "", price: "160.00", category: "PIĆE", subcategory: "Voda", isPopular: false, sortOrder: 12 },
  { name: "Knjaz Miloš 0.5l", description: "", price: "160.00", category: "PIĆE", subcategory: "Voda", isPopular: false, sortOrder: 13 },
  { name: "Knjaz Miloš limun 0.5l", description: "", price: "180.00", category: "PIĆE", subcategory: "Voda", isPopular: false, sortOrder: 14 },
  { name: "Tuborg 0.5l", description: "", price: "220.00", category: "PIĆE", subcategory: "Pivo", isPopular: false, sortOrder: 15 },
  { name: "Carlsberg 0.5l", description: "", price: "250.00", category: "PIĆE", subcategory: "Pivo", isPopular: false, sortOrder: 16 },
  { name: "Lav premium 0.5l", description: "", price: "200.00", category: "PIĆE", subcategory: "Pivo", isPopular: false, sortOrder: 17 },
  { name: "Blanc 1664 0.5l", description: "", price: "250.00", category: "PIĆE", subcategory: "Pivo", isPopular: false, sortOrder: 18 },

  // POHOVANO RAZNO
  { name: "Naša Piletina 300g i pomfrit 150g", description: "Porcija piletine 300g, pomfrit 150g, majonez, kečap", price: "650.00", category: "POHOVANO", isPopular: false, sortOrder: 1 },
  { name: "Chicken Nuggets 300g i pomfrit 150g", description: "Chicken nuggets 300g i pomfrit 150g, kečap ili majonez", price: "650.00", category: "POHOVANO", isPopular: false, sortOrder: 2 },
  { name: "Mozzarela Štapići", description: "Mali sočni mozzarela štapići od 100% mlečne mozzarele, 5 kom u porciji", price: "370.00", category: "POHOVANO", isPopular: false, sortOrder: 3 },
  { name: "Trouglici sa Kačkavaljem", description: "Mali pikantni trouglici sa kačkavaljem, 5 kom u porciji", price: "350.00", category: "POHOVANO", isPopular: false, sortOrder: 4 },
  { name: "Susam Piletina 300g i Pomfrit 150g", description: "", price: "650.00", category: "POHOVANO", isPopular: false, sortOrder: 5 },
  { name: "Mexico Tortilja", description: "U mexico tortilji: Piletina sa susamom 200g, tzaziki sos, roštilj sos, pasulj u sosu sa kukuruzom i ajzberg salata", price: "690.00", category: "POHOVANO", isPopular: false, sortOrder: 6 },
  { name: "Pileći Cheeseburger i Pomfrit", description: "Sočni pileći pohovani cheeseburger sa topljenim sirom, ajzberg, paradajz, burger sos i pomfrit 150g", price: "690.00", category: "POHOVANO", isPopular: false, sortOrder: 7 },
  { name: "Panirana Pileća Krilca i Pomfrit", description: "Panirana blago ljuta pileća krilca 300g i pomfrit 150g", price: "690.00", category: "POHOVANO", isPopular: false, sortOrder: 8 },

  // OBROK SALATE
  { name: "Tuna Salata", description: "Zelena salata, komadi tune, paradajz, kukuruz, posni majonez, limun, ljubičasti luk i hlebići sa strane", price: "550.00", category: "SALATA", isPopular: false, sortOrder: 1 },
  { name: "Mozzarela Salata", description: "Miks salate iceberg i zelena, pržena piletina, čeri paradajz, mozzarella, hlebići sa strane, sos šefa kuhinje", price: "650.00", category: "SALATA", isPopular: false, sortOrder: 2 },
  { name: "Tzatziki Salata", description: "Miks povrća (paradajz, krastavac, zelena salata), piletina, sos šefa kuhinje", price: "600.00", category: "SALATA", isPopular: false, sortOrder: 3 },

  // POMFRIT
  { name: "Pomfrit 100g", description: "", price: "150.00", category: "POMFRIT", isPopular: false, sortOrder: 1 },
  { name: "Pomfrit 200g", description: "", price: "250.00", category: "POMFRIT", isPopular: false, sortOrder: 2 },
  { name: "Pomfrit 300g", description: "", price: "350.00", category: "POMFRIT", isPopular: true, sortOrder: 3 },

  // MINI PIZZE PUNJENE KORICE
  { name: "Mini Pizza Pečenica", description: "Mala pizza sa pečenicicom i punjenim koricama", price: "380.00", category: "MINI_PIZZA", isPopular: false, sortOrder: 1 },
  { name: "Mini Pizza Kulen", description: "Mala pizza sa kulenom i punjenim koricama", price: "380.00", category: "MINI_PIZZA", isPopular: false, sortOrder: 2 },
  { name: "Mini Pizza Slaninica", description: "Mini pica sa slaninicom i punjenim koricama", price: "380.00", category: "MINI_PIZZA", isPopular: false, sortOrder: 3 },
  { name: "Mini Pizza Capricciosa", description: "Mini pizza capricciosa sa punjenim koricama", price: "380.00", category: "MINI_PIZZA", isPopular: false, sortOrder: 4 },
  { name: "Mini Burger", description: "Mini burger pizza sa punjenim koricama, najfinije juneće meso, roštilj sos, ajzberg, burger sos, luk, kačkavalj", price: "500.00", category: "MINI_PIZZA", isPopular: false, sortOrder: 5 },

  // DORUČAK
  { name: "Omlet Slaninica", description: "Omlet sa jajima, kačkavalj, feta sir, paradajz, somun", price: "350.00", category: "DORUČAK", isPopular: false, sortOrder: 1 },
  { name: "Omlet sa Povrćem", description: "Omlet sa jajima, kačkavalj, crveni luk, pečurke, paprika, paradajz, feta sir, somun", price: "350.00", category: "DORUČAK", isPopular: false, sortOrder: 2 },

  // PIZZA PARČE
  { name: "Pizza Parče Slaninica", description: "Slaninica, pelat, kačkavalj, origano", price: "250.00", category: "PIZZA_PARCE", isPopular: false, sortOrder: 1 },
  { name: "Pizza Parče Pepperoni", description: "Pepperoni, pelat, kačkavalj, origano", price: "250.00", category: "PIZZA_PARCE", isPopular: false, sortOrder: 2 },
  { name: "Pizza Parče Capriccosa", description: "Pelat, šunka, kačkavalj, pečurke, origano", price: "250.00", category: "PIZZA_PARCE", isPopular: false, sortOrder: 3 },
  { name: "Pizza Parče Capriccosa bez Pečuraka", description: "Pelat, šunka, kačkavalj, origano", price: "250.00", category: "PIZZA_PARCE", isPopular: false, sortOrder: 4 },
];

async function seed() {
  const [result] = await db.select({ count: count() }).from(menuItems);
  if (result.count > 0) {
    console.log("Menu items already seeded, skipping...");
    return;
  }

  console.log("Seeding menu items...");

  for (const item of menuData) {
    await db.insert(menuItems).values(item);
  }

  console.log(`Seeded ${menuData.length} menu items.`);
}

seed().catch(console.error);
