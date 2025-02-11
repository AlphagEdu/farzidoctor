import { createWriteStream } from "fs";
import path from "path";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { name, regDate, sampleCollection, printDate, age, gender } = req.body;

        if (!name || !regDate || !sampleCollection || !printDate || !age || !gender) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Generate a simple text report (can be converted to DOCX)
        const reportContent = `
            Patient Name: ${name}
            Registration Date: ${regDate}
            Sample Collection: ${sampleCollection}
            Print Date: ${printDate}
            Age: ${age}
            Gender: ${gender}
        `;

        // Save the file to Vercel's temporary directory
        const filePath = path.join("/tmp", "report.txt");
        const stream = createWriteStream(filePath);
        stream.write(reportContent);
        stream.end();

        // Send the file as a response
        res.setHeader("Content-Disposition", "attachment; filename=report.txt");
        res.setHeader("Content-Type", "text/plain");
        res.sendFile(filePath);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate report" });
    }
}
