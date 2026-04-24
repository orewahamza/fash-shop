import 'dotenv/config';
import connectDB from '../config/mongodb.js';
import connectCloudinary from '../config/cloudinary.js';
import { auditAll, applyFixes } from '../services/productAudit.js';

const run = async () => {
  try {
    await connectDB();
    await connectCloudinary();
    const initial = await auditAll();
    await applyFixes(initial);
    const report = await auditAll();
    const fixed = initial.filter(r => !r.nameMatchesImage || r.imageCountAfter !== r.imageCountBefore).length;
    const mismatches = report.filter(r => !r.nameMatchesImage).map(r => ({
      id: r.id,
      name: r.currentName,
      standardized: r.standardizedName,
      detectedType: r.detectedType,
      expectedTypes: r.expectedTypes
    }));
    console.log(JSON.stringify({
      total: report.length,
      fixed,
      checklist: {
        nameMatchesImage: report.every(r => r.nameMatchesImage),
        imagesShowProductOnly: report.every(r => r.imagesShowProductOnly),
        noUnrelatedModelPhotography: report.every(r => r.noUnrelatedModelPhotography),
      },
      mismatches
    }, null, 2));
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

run();
