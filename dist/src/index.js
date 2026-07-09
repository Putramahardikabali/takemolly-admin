"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     *
     * This gives you an opportunity to extend code.
     */
    register({ strapi }) { },
    /**
     * An asynchronous bootstrap function that runs before
     * your application gets started.
     *
     * This gives you an opportunity to set up your data model,
     * run jobs, or perform some special logic.
     */
    async bootstrap({ strapi }) {
        var _a;
        // Check if we should run seeders (optional: only run in dev mode)
        const shouldSeed = process.env.NODE_ENV === "development" &&
            process.env.RUN_SEEDERS === "true";
        if (!shouldSeed) {
            console.log("⏭️  Skipping seeders (set RUN_SEEDERS=true to enable)");
            return;
        }
        // SEED_TARGET selects which tables to wipe + re-seed.
        // Values: "all" (default), or any comma-separated combination of
        // "results", "papers", "supplements", "biomarkers". Example:
        //   SEED_TARGET=results
        const targetEnv = ((_a = process.env.SEED_TARGET) !== null && _a !== void 0 ? _a : "all").toLowerCase();
        const targets = new Set(targetEnv.split(",").map((s) => s.trim()));
        const wantAll = targets.has("all");
        const wantResults = wantAll || targets.has("results");
        const wantPapers = wantAll || targets.has("papers");
        const wantSupplements = wantAll || targets.has("supplements");
        const wantBiomarkers = wantAll || targets.has("biomarkers");
        if (!wantResults && !wantPapers && !wantSupplements && !wantBiomarkers) {
            console.log(`⚠️  SEED_TARGET="${targetEnv}" matched nothing. Valid: all, results, papers, supplements, biomarkers`);
            return;
        }
        console.log(`🌱 SEED_TARGET=${targetEnv} → results:${wantResults} papers:${wantPapers} supplements:${wantSupplements} biomarkers:${wantBiomarkers}`);
        try {
            console.log("🌱 Starting database seeding...");
            // ===== STEP 0: Clean existing data =====
            console.log("\n🧹 Step 0: Cleaning existing data...");
            // Delete in reverse order to avoid foreign key constraints.
            // Results have relations to supplements and papers, so when wiping
            // papers or supplements, results must also be cleared first.
            const mustClearResults = wantResults || wantPapers || wantSupplements;
            try {
                if (mustClearResults) {
                    const results = await strapi.entityService.findMany("api::result.result", {
                        fields: ["id"],
                        limit: -1,
                    });
                    for (const result of results) {
                        await strapi.entityService.delete("api::result.result", result.id);
                    }
                    console.log(`✓ Deleted ${results.length} results`);
                }
                if (wantPapers) {
                    const papers = await strapi.entityService.findMany("api::research-paper.research-paper", {
                        fields: ["id"],
                        limit: -1,
                    });
                    for (const paper of papers) {
                        await strapi.entityService.delete("api::research-paper.research-paper", paper.id);
                    }
                    console.log(`✓ Deleted ${papers.length} research papers`);
                }
                if (wantSupplements) {
                    const supplements = await strapi.entityService.findMany("api::supplement.supplement", {
                        fields: ["id"],
                        limit: -1,
                    });
                    for (const supplement of supplements) {
                        await strapi.entityService.delete("api::supplement.supplement", supplement.id);
                    }
                    console.log(`✓ Deleted ${supplements.length} supplements`);
                }
                if (wantBiomarkers) {
                    const biomarkers = await strapi.entityService.findMany("api::biomarker.biomarker", {
                        fields: ["id"],
                        limit: -1,
                    });
                    for (const biomarker of biomarkers) {
                        await strapi.entityService.delete("api::biomarker.biomarker", biomarker.id);
                    }
                    console.log(`✓ Deleted ${biomarkers.length} biomarkers`);
                }
                console.log("✅ Database cleaned successfully!");
            }
            catch (cleanError) {
                console.error("⚠️  Warning: Error during cleanup:", cleanError);
                console.log("Continuing with seeding anyway...");
            }
            // ===== Seed data =====
            // Import only the seeders we need
            if (wantBiomarkers) {
                const { seedBiomarkers } = await Promise.resolve().then(() => __importStar(require("./seeders/biomarkers")));
                console.log("\n🌱 Seeding biomarkers...");
                await seedBiomarkers(strapi);
            }
            if (wantSupplements) {
                const { seedSupplements } = await Promise.resolve().then(() => __importStar(require("./seeders/supplements")));
                console.log("\n🌱 Seeding supplements...");
                await seedSupplements(strapi);
            }
            if (wantPapers) {
                const { seedResearchPapers } = await Promise.resolve().then(() => __importStar(require("./seeders/research-papers")));
                console.log("\n🌱 Seeding research papers...");
                await seedResearchPapers(strapi);
            }
            if (wantResults) {
                const { seedResults } = await Promise.resolve().then(() => __importStar(require("./seeders/results")));
                console.log("\n🌱 Seeding results (with relations)...");
                await seedResults(strapi);
            }
            console.log("\n✅ All seeders completed successfully!");
        }
        catch (error) {
            console.error("❌ Seeder failed:", error);
            // Don't throw error to prevent Strapi from crashing
            // throw error // Uncomment if you want Strapi to stop on seed failure
        }
    },
};
