
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
let envContent = fs.readFileSync(envPath, 'utf8');

// extract key parts
const keyStart = '-----BEGIN PRIVATE KEY-----';
const keyEnd = '-----END PRIVATE KEY-----';

const startIndex = envContent.indexOf(keyStart);
const endIndex = envContent.indexOf(keyEnd);

if (startIndex !== -1 && endIndex !== -1) {
    // The key might be spread across multiple lines
    // We want to extract the full value including potential quotes
    // But simplistic parsing: find the line with FIREBASE_PRIVATE_KEY
    
    const lines = envContent.split('\n');
    let newLines = [];
    let insideKey = false;
    let keyBuffer = '';
    
    for (let line of lines) {
        if (line.startsWith('FIREBASE_PRIVATE_KEY=')) {
            // Check if it's a single line or starts a multiline block
            if (line.includes(keyEnd)) {
                // Single line key, maybe already correct or needs fixing?
                // If it has actual newlines inside quotes, split() would have separated them.
                // If it's one line in file, it's one line here.
                // Let's assume we want to reformat it anyway.
                const val = line.substring('FIREBASE_PRIVATE_KEY='.length);
                // Remove quotes if present
                let cleanVal = val;
                if (cleanVal.startsWith('"') && cleanVal.endsWith('"')) {
                    cleanVal = cleanVal.slice(1, -1);
                }
                // Replace literal \n with actual newlines to normalize, then back to literal \n
                cleanVal = cleanVal.replace(/\\n/g, '\n'); 
                // Now cleanVal has actual newlines
                // Convert back to literal \n
                const oneline = cleanVal.replace(/\n/g, '\\n');
                newLines.push(`FIREBASE_PRIVATE_KEY="${oneline}"`);
            } else {
                // Starts multiline
                insideKey = true;
                const val = line.substring('FIREBASE_PRIVATE_KEY='.length);
                keyBuffer += val; // might have opening quote
            }
        } else if (insideKey) {
            keyBuffer += '\n' + line;
            if (line.includes(keyEnd)) {
                insideKey = false;
                // Process collected key
                let cleanVal = keyBuffer;
                // Remove opening quote
                if (cleanVal.startsWith('"')) cleanVal = cleanVal.substring(1);
                // Remove closing quote (might be on the last line)
                if (cleanVal.trim().endsWith('"')) {
                     cleanVal = cleanVal.trim().slice(0, -1);
                }
                
                // cleanVal now has the multiline key content.
                // We want to replace actual newlines with literal \n
                const oneline = cleanVal.replace(/\r?\n/g, '\\n');
                newLines.push(`FIREBASE_PRIVATE_KEY="${oneline}"`);
            }
        } else {
            newLines.push(line);
        }
    }
    
    fs.writeFileSync(envPath, newLines.join('\n'));
    console.log('Fixed .env file');
} else {
    console.log('Key not found in .env, maybe already fixed or missing');
}
