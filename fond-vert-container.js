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
