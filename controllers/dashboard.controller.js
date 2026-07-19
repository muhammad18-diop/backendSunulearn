export const addCourse = async (req, res) => {
    try {
        const { titre, description, categorie } = req.body;

        
        if (!titre || !description) {
            return res.status(400).json({
                success: false,
                message: "Titre et description obligatoires"
            });
        }

        if (!req.files?.pdfFile?.[0]) {
            return res.status(400).json({
                success: false,
                message: "PDF obligatoire"
            });
        }

        
        console.log(req.files);
        
        const pdfUrl = req.files.pdfFile[0].path;
        const imageUrl = req.files.imageFile?.[0]?.path || null;

        
        const newCourse = {
            titre,
            description,
            categorie,
            pdfUrl,
            imageUrl
        };

        return res.status(201).json({
            success: true,
            message: "Cours uploadé avec succès",
            course: newCourse
        });

    } catch (error) {
        console.error("UPLOAD ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error: error.message
        });
    }
};