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
