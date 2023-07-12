window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const colorInfo = document.getElementById('colorInfo');

    // Handle file input change event
    document.getElementById('uploadInput').addEventListener('change', handleFileSelect, false);

    // Handle file selection
    function handleFileSelect(evt) {
        const file = evt.target.files[0];

        // Check if the file is an image
        if (file.type.match('image.*')) {
            const reader = new FileReader();

            reader.onload = (function(theFile) {
                return function(e) {
                    // Create a new image element
                    const img = new Image();
                    img.src = e.target.result;

                    // When the image has loaded, draw it on the canvas
                    img.onload = function() {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0, img.width, img.height);

                        // Extract dominant colors from the image
                        const colorThief = new ColorThief();
                        const colorPalette = colorThief.getPalette(img, 5);

                        // Listen for mousemove event on the canvas
                        canvas.addEventListener('mousemove', handleMouseMove, false);

                        // Display color information
                        displayColorPalette(colorPalette);
                    };
                };
            })(file);

            // Read the file as a data URL
            reader.readAsDataURL(file);
        }
    }

    // Handle mousemove event on the canvas
    function handleMouseMove(evt) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor(evt.clientX - rect.left);
        const y = Math.floor(evt.clientY - rect.top);

        // Get the pixel color at the mouse position
        const pixelData = ctx.getImageData(x, y, 1, 1).data;
        const hex = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);

        // Display the color hex code
        colorInfo.textContent = `Color: ${hex}`;
    }

    // Convert RGB to hexadecimal color
    function rgbToHex(r, g, b) {
        return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
    }

    // Convert single color component to hexadecimal
    function componentToHex(c) {
        const hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    // Display color palette
    function displayColorPalette(palette) {
        colorInfo.innerHTML = '';

        for (let i = 0; i < palette.length; i++) {
            const color = palette[i];
            const hex = rgbToHex(color[0], color[1], color[2]);
            const colorBox = `<div style="background-color: ${hex}; width: 50px; height: 50px; display: inline-block;"></div>`;
            const colorInfoText = `<span>${colorBox} ${hex}</span>`;
            colorInfo.innerHTML += colorInfoText;
        }
    }
});
