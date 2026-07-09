"use strict";
// Seeder for the Biomarker collection type. Mirrors the static list that
// used to live in web/data/biomarker.ts so the admin DB is the source of
// truth.
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedBiomarkers = void 0;
const BIOMARKERS = [
    {
        title: "Sleep",
        slug: "sleep-quality",
        description: "Prioritizing deep sleep stages accelerates tissue regeneration, balances hormones and restores energy levels, key factors to more effective recovery.",
        order_column: 1,
    },
    {
        title: "Cortisol",
        slug: "cortisol",
        description: "Elevated cortisol levels increase overtraining risks by causing muscle breakdown, immune suppression, inflammation, sleep disruption, and glycogen depletion.",
        order_column: 2,
    },
    {
        title: "DOMS",
        slug: "muscle-soreness",
        description: "Effectively managing DOMS can lead to a substantial reduction in muscle pain and improved range of motion after strenuous exercise.",
        order_column: 3,
    },
    {
        title: "Inflammation",
        slug: "inflammation",
        description: "Controlling inflammation during recovery is critical, as a regulated inflammatory response is integral to muscle repair and regeneration.",
        order_column: 4,
    },
    {
        title: "Muscle Damage",
        slug: "muscle-damage",
        description: "Reducing excessive muscle damage supports rapid tissue repair and promotes muscle growth by boosting protein synthesis, ensuring each workout leads to strength not strain.",
        order_column: 5,
    },
    {
        title: "Oxidative Stress",
        slug: "oxidative-stress",
        description: "Fortifying antioxidant defenses reduces exercise induced oxidation, preventing cellular damage and muscle fatigue, allowing for quicker recovery and peak performance.",
        order_column: 6,
    },
    {
        title: "Pain",
        slug: "pain",
        description: "Reducing pain signals during recovery helps restore mobility, supports adherence to training, and lets the body heal without the stress that comes from prolonged discomfort.",
        order_column: 7,
    },
];
const seedBiomarkers = async (strapi) => {
    console.log("=== Starting Biomarker Seeder ===");
    let success = 0;
    let failed = 0;
    for (const b of BIOMARKERS) {
        try {
            await strapi.entityService.create("api::biomarker.biomarker", {
                data: b,
            });
            success++;
            console.log(`✓ Inserted biomarker: ${b.slug}`);
        }
        catch (err) {
            failed++;
            console.error(`❌ Insert failed for biomarker ${b.slug}:`, err.message);
        }
    }
    console.log("\n=== BIOMARKER SEED COMPLETE ===");
    console.log("  ✅ Inserted:", success);
    console.log("  ❌ Failed:", failed);
    console.log("  📈 Total:", BIOMARKERS.length);
};
exports.seedBiomarkers = seedBiomarkers;
exports.default = exports.seedBiomarkers;
