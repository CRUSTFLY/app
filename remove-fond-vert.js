document.getElementById('fileInput').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        console.log("Fichier sélectionné:", file.name);
        const reader = new FileReader();
        reader.onload = function (e) {
            console.log("Lecture du fichier terminée.");
            const image = new Image();
            image.onload = function () {
                console.log("Image chargée dans l'objet Image.");
                processImage(image);
            };
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        console.log("Aucun fichier sélectionné.");
    }
}

function processImage(image) {
    console.log("Début du traitement de l'image...");
    // Créer un objet canvas et son contexte
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;

    console.log(`Dimensions de l'image: ${canvas.width}x${canvas.height}`);

    // Dessiner l'image sur le canvas
    ctx.drawImage(image, 0, 0);
    console.log("Image dessinée sur le canvas.");

    // Obtenir les pixels de l'image
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    console.log("Pixels de l'image récupérés.");

    // Couleur de fond à rendre transparent (ici rgb(0, 255, 0))
    const bgColor = { r: 0, g: 255, b: 0 };

    // Suppression de l'arrière-plan spécifique (rgb(0, 255, 0)) et rendre transparent ces pixels
    let transparentPixels = 0;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Vérification si le pixel est exactement de la couleur de fond (rgb(0, 255, 0))
        if (r === bgColor.r && g === bgColor.g && b === bgColor.b) {
            // Rendre transparent le pixel en ajustant le canal alpha à 0
            data[i + 3] = 0; // alpha
            transparentPixels++;
        }
    }

    console.log(`Nombre de pixels rendus transparents: ${transparentPixels}`);

    // Mettre à jour l'image avec les nouveaux pixels
    ctx.putImageData(imageData, 0, 0);
    console.log("Image mise à jour avec les pixels modifiés.");
}
