import productModel from '../models/productModel.js';

export const seedAdminProducts = async (userId) => {
    try {
        console.log(`Checking products for admin ${userId} (${typeof userId})`);
        const count = await productModel.countDocuments({ ownerId: userId });
        console.log(`Found ${count} products for admin ${userId}`);
        if (count >= 3) return;

        const productsToCreate = 3 - count;
        const placeholders = [];
        for (let i = 0; i < productsToCreate; i++) {
            placeholders.push({
                name: `Placeholder Product ${i + 1}`,
                description: "This is a placeholder product automatically created for the admin.",
                price: 100,
                image: ["https://via.placeholder.com/150"],
                category: "Placeholder",
                subCategory: "System",
                sizes: ["S", "M", "L"],
                bestseller: false,
                date: new Date(),
                ownerId: userId,
                isDraft: true,
                isPublished: false
            });
        }
        if (placeholders.length > 0) {
            await productModel.insertMany(placeholders);
            console.log(`Seeded ${placeholders.length} products for admin ${userId}`);
        }
    } catch (error) {
        console.error("Seeding error:", error);
    }
};
