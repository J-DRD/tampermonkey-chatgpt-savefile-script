// ==UserScript==
// @name         ChatGPT Save File
// @namespace    https://chatgpt.com/
// @version      0.1
// @description  Add a 'Save File' button and relocate underneath codeblock.
// @author       J-DRD
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addSaveButton(codeContainer) {
        // Check if the "Save to File" button is already added
        if (codeContainer.querySelector('.save-to-file-button')) {
            return;
        }

        // Find the "Copy code" button
        const copyCodeButton = codeContainer.querySelector('button.flex.gap-1.items-center');

        // Create the "Save to File" button
        const saveToFileButton = document.createElement('button');
        saveToFileButton.innerText = 'Save to File';
        saveToFileButton.classList.add('save-to-file-button');
        saveToFileButton.style.marginLeft = '10px';

        // Define the button's functionality
        saveToFileButton.onclick = function() {
            // Extract code text
            const codeContent = codeContainer.querySelector('code').innerText;
            const language = codeContainer.querySelector('.flex.items-center.relative span').innerText.toLowerCase();
            let extension = 'txt';

            switch (language) {
                case 'javascript':
                    extension = 'js';
                    break;
                case 'python':
                    extension = 'py';
                    break;
                case 'csharp':
                    extension = 'cs';
                    break;
                case 'json':
                    extension = 'json';
                    break;
                // Add more cases as needed
                default:
                    extension = 'txt';
            }

            const blob = new Blob([codeContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);

            // Create a temporary link to download the file
            const link = document.createElement('a');
            link.href = url;
            link.download = `code.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the blob URL
            URL.revokeObjectURL(url);
        };

        // Create a container for the buttons and append both buttons to it
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.marginTop = '10px';

        // Append the buttons to the button container
        buttonContainer.appendChild(copyCodeButton);
        buttonContainer.appendChild(saveToFileButton);

        // Append the button container to the code container
        codeContainer.appendChild(buttonContainer);
    }

    // Set an interval to check for new code blocks every second
    setInterval(function() {
        const blocks = document.querySelectorAll('.prose pre');
        blocks.forEach(block => {
            addSaveButton(block);
        });
    }, 1000);
})();
