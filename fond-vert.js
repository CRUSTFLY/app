        const fileInput = document.getElementById('fileInput');
        const imageContainer = document.getElementById('imageContainer');

        // Charger le modèle BodyPix
        async function loadModel() {
            const net = await bodyPix.load();
            console.log('BodyPix model loaded');
            return net;
        }

        // Appliquer la segmentation et dessiner l'image modifiée
        async function detectBody(net, image) {
            // Détection de la personne
            const segmentation = await net.segmentPerson(image);
            console.log('Segmentation effectuée');

            // Création d'un canvas pour afficher le résultat
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;

            // Dessiner l'image originale
            ctx.drawImage(image, 0, 0);

            // Récupérer les données de pixels
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;

            // Appliquer le fond vert là où il n'y a pas de personne
            for (let i = 0; i < pixels.length; i += 4) {
                const offset = i / 4;
                if (!segmentation.data[offset]) {
                    // Si le pixel n'appartient pas au corps
                    pixels[i] = 0;     // Rouge
                    pixels[i + 1] = 255; // Vert
                    pixels[i + 2] = 0;   // Bleu
                }
            }

            // Mettre à jour le canvas avec les nouveaux pixels
            ctx.putImageData(imageData, 0, 0);

            // Ajouter le résultat au container
            imageContainer.innerHTML = '';
            imageContainer.appendChild(canvas);
            console.log('Fond changé et image mise à jour');
        }

        // Gestion du changement de fichier
        fileInput.addEventListener('change', async function(event) {
            const file = event.target.files[0];
            if (file) {
                console.log('Fichier sélectionné:', file.name);

                const reader = new FileReader();

                reader.onload = async function(e) {
                    const img = new Image();
                    img.src = e.target.result;
                    
                    img.onload = async function() {
                        console.log('Image chargée avec succès');
                        
                        // Charger le modèle BodyPix
                        const net = await loadModel();
                        
                        // Détecter le corps et changer le fond
                        await detectBody(net, img);
                    };

                    img.onerror = function() {
                        console.error('Erreur lors du chargement de l\'image');
                    };
                };

                reader.readAsDataURL(file);
                console.log('Lecture de l\'image...');
            } else {
                console.log('Aucun fichier sélectionné');
            }
        });

        const fileInput = document.getElementById('fileInput');
        const imagePreviewContainer = document.getElementById('imagePreviewContainer');

        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                console.log('Fichier sélectionné:', file.name);

                const reader = new FileReader();

                reader.onload = function(e) {
                    const img = new Image();
                    img.src = e.target.result;
                    
                    img.onload = function() {
                        console.log('Image chargée avec succès');
                        
                        // Change le fond d'écran en rgb(0,255,0)
                        imagePreviewContainer.style.backgroundColor = 'rgb(0, 255, 0)';
                        console.log('Le fond d\'écran a été changé en rgb(0, 255, 0)');
                        
                        // Affiche l'image dans le container
                        imagePreviewContainer.innerHTML = '';
                        imagePreviewContainer.appendChild(img);
                        console.log('L\'image a été ajoutée au container');
                    };

                    img.onerror = function() {
                        console.error('Erreur lors du chargement de l\'image');
                    };
                };

                reader.readAsDataURL(file);
                console.log('Lecture de l\'image...');
            } else {
                console.log('Aucun fichier sélectionné');
            }
        });

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
