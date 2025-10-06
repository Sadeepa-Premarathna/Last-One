// MongoDB Migration Script
// Run this in MongoDB Compass or mongosh after code deployment

// IMPORTANT: Backup your database first!
// mongodump --uri="your_mongodb_uri" --out=backup_before_migration

// ===================================
// MIGRATION: Rename Product Columns
// ===================================
// Changes:
// - quantity → stock
// - expiryDate → expiryDays (convert Date to Number of days)
// - imageUrl → image

use dairy_shop;

// Step 1: Add new fields with converted data
db.products.updateMany(
  {},
  [
    {
      $set: {
        // Rename quantity to stock
        stock: { $ifNull: ["$quantity", 0] },
        
        // Calculate expiryDays from expiryDate and manufactureDate
        expiryDays: {
          $cond: {
            if: { $and: ["$expiryDate", "$manufactureDate"] },
            then: {
              $ceil: {
                $divide: [
                  { $subtract: ["$expiryDate", "$manufactureDate"] },
                  86400000  // milliseconds in a day
                ]
              }
            },
            else: 7  // default to 7 days if dates are missing
          }
        },
        
        // Rename imageUrl to image
        image: { $ifNull: ["$imageUrl", "/placeholder-product.jpg"] }
      }
    }
  ]
);

// Step 2: Remove old fields
db.products.updateMany(
  {},
  {
    $unset: {
      quantity: "",
      expiryDate: "",
      imageUrl: ""
    }
  }
);

// Step 3: Verify the migration
print("=== Migration Complete ===");
print("Total products migrated:", db.products.countDocuments());
print("\nSample migrated document:");
printjson(db.products.findOne());

// Step 4: Verify all products have the new fields
print("\nVerifying all products have new fields:");
print("Products with 'stock' field:", db.products.countDocuments({ stock: { $exists: true } }));
print("Products with 'expiryDays' field:", db.products.countDocuments({ expiryDays: { $exists: true } }));
print("Products with 'image' field:", db.products.countDocuments({ image: { $exists: true } }));

// Step 5: Verify old fields are gone
print("\nVerifying old fields removed:");
print("Products with 'quantity' field (should be 0):", db.products.countDocuments({ quantity: { $exists: true } }));
print("Products with 'expiryDate' field (should be 0):", db.products.countDocuments({ expiryDate: { $exists: true } }));
print("Products with 'imageUrl' field (should be 0):", db.products.countDocuments({ imageUrl: { $exists: true } }));

print("\n=== Migration Status ===");
print("✅ If all old field counts are 0, migration is successful!");
print("⚠️  If any old fields still exist, review the migration steps.");
