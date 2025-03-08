import express from "express";
import fs from "fs";
import path from "path";
import { PDFDocument, rgb } from "pdf-lib";
import User from "../models/User.js"; // Import your User model

const router = express.Router();

// 📌 Generate Certificate Route
router.get("/generate-certificate/:userId/:course", async (req, res) => {
    try {
        const { userId, course } = req.params;

        // Fetch user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Load PDF template
        const templatePath = path.join(__dirname, "../templates/certificate-template.pdf");
        const templateBytes = fs.readFileSync(templatePath);
        const pdfDoc = await PDFDocument.load(templateBytes);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        // Customize certificate with user details
        firstPage.drawText(user.username, { x: 250, y: 400, size: 24, color: rgb(0, 0, 0) });
        firstPage.drawText(course, { x: 250, y: 350, size: 20, color: rgb(0.2, 0.2, 0.8) });
        firstPage.drawText(new Date().toLocaleDateString(), { x: 250, y: 300, size: 16, color: rgb(0, 0, 0) });

        // Save modified PDF
        const modifiedPdfBytes = await pdfDoc.save();
        const certificatePath = path.join(__dirname, `../certificates/${user.username}-${course}.pdf`);
        fs.writeFileSync(certificatePath, modifiedPdfBytes);

        // Send PDF as response for download
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${user.username}-certificate.pdf"`);
        res.send(modifiedPdfBytes);

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;
