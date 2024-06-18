// ==UserScript==
// @name         ChatGPT Save File
// @namespace    https://chatgpt.com/
// @version      0.3
// @description  Add a 'Save File' button and relocate underneath codeblock.
// @author       J-DRD
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js
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

    // Create a checkbox for file selection
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('file-checkbox');
    checkbox.style.marginLeft = '10px';

    // Define the button's functionality
    saveToFileButton.onclick = function() {
      // Extract code text
      const codeContent = codeContainer.querySelector('code').innerText;
      const hostElement = codeContainer.parentElement.parentElement;
      let fnAel = hostElement.querySelector('h3');
      let fnBel = hostElement.querySelector('p code');
      let fnCel = hostElement.querySelector('strong');
      var messageElement = '';
      if (fnAel !== undefined && fnAel !== null) {
        messageElement = fnAel.innerText;
      } else if (fnBel !== undefined && fnBel !== null) {
        messageElement = fnBel.innerText;
      } else if (fnCel !== undefined && fnCel !== null) {
        messageElement = fnCel.innerText;
      }


      const language = codeContainer.querySelector('.flex.items-center.relative span').innerText.toLowerCase();
      let extension = 'txt';
      let mime = 'text/plain';

      switch (language) {
        case 'javascript':
          extension = 'js';
          mime = 'application/javascript';
          break;
        case 'python':
          extension = 'py';
          mime = 'text/x-python';
          break;
        case 'csharp':
          extension = 'cs';
          mime = 'text/plain';
          break;
        case 'json':
          extension = 'json';
          mime = 'application/json';
          break;
        case 'html':
          extension = 'html';
          mime = 'text/html';
          break;
        case 'css':
          extension = 'css';
          mime = 'text/css';
          break;
        case 'java':
          extension = 'java';
          mime = 'text/x-java-source';
          break;
        case 'ruby':
          extension = 'rb';
          mime = 'text/x-ruby';
          break;
        case 'php':
          extension = 'php';
          mime = 'application/x-httpd-php';
          break;
        case 'xml':
          extension = 'xml';
          mime = 'application/xml';
          break;
        case 'yaml':
          extension = 'yaml';
          mime = 'text/yaml';
          break;
        case 'sql':
          extension = 'sql';
          mime = 'application/sql';
          break;
        case 'markdown':
          extension = 'md';
          mime = 'text/markdown';
          break;
        case 'plaintext':
          extension = 'txt';
          mime = 'text/plain';
          break;
        case 'typescript':
          extension = 'ts';
          mime = 'application/typescript';
          break;
        case 'go':
          extension = 'go';
          mime = 'text/x-go';
          break;
        case 'kotlin':
          extension = 'kt';
          mime = 'text/x-kotlin';
          break;
        case 'swift':
          extension = 'swift';
          mime = 'text/x-swift';
          break;
        case 'r':
          extension = 'r';
          mime = 'text/x-rsrc';
          break;
        case 'perl':
          extension = 'pl';
          mime = 'text/x-perl';
          break;
        case 'lua':
          extension = 'lua';
          mime = 'text/x-lua';
          break;
        case 'shell':
          extension = 'sh';
          mime = 'application/x-sh';
          break;
        case 'batch':
          extension = 'bat';
          mime = 'application/x-bat';
          break;
        case 'powershell':
          extension = 'ps1';
          mime = 'application/x-powershell';
          break;
        case 'scala':
          extension = 'scala';
          mime = 'text/x-scala';
          break;
        case 'rust':
          extension = 'rs';
          mime = 'text/x-rustsrc';
          break;
          // Add more cases as needed
        default:
          extension = 'txt';
          mime = 'text/plain';
      }

      const blob = new Blob([codeContent], {
        type: mime
      });
      const url = URL.createObjectURL(blob);

      // Trim any extra spaces and check if the filename already ends with the extension
      let filename = messageElement.trim();
      if (!filename.endsWith(`.${extension}`)) {
        filename += `.${extension}`;
      }

      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}`;
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

    // Append the buttons and checkbox to the button container
    buttonContainer.appendChild(copyCodeButton);
    buttonContainer.appendChild(saveToFileButton);
    buttonContainer.appendChild(checkbox);

    // Append the button container to the code container
    codeContainer.appendChild(buttonContainer);
  }

  function createZipAndDownload() {
    const JSZip = window.JSZip;
    const zip = new JSZip();
    const checkedBoxes = document.querySelectorAll('.file-checkbox:checked');

    checkedBoxes.forEach((checkbox, index) => {
      const codeContainer = checkbox.closest('.prose pre');
      const codeContent = codeContainer.querySelector('code').innerText;
      const hostElement = codeContainer.parentElement.parentElement;
      let fnAel = hostElement.querySelector('h3');
      let fnBel = hostElement.querySelector('p code');
      let fnCel = hostElement.querySelector('strong');
      var messageElement = '';
      if (fnAel !== undefined && fnAel !== null) {
        messageElement = fnAel.innerText;
      } else if (fnBel !== undefined && fnBel !== null) {
        messageElement = fnBel.innerText;
      } else if (fnCel !== undefined && fnCel !== null) {
        messageElement = fnCel.innerText;
      }

      const language = codeContainer.querySelector('.flex.items-center.relative span').innerText.toLowerCase();
      let extension = 'txt';

      switch (language) {
        case 'javascript':
          extension = 'js';
          break;
        case 'python':
          extension = 'py';
          break;
          // Add more cases as needed
        default:
          extension = 'txt';
      }

      let filename = messageElement.trim();
      if (!filename.endsWith(`.${extension}`)) {
        filename += `.${extension}`;
      }

      zip.file(`src/${filename}`, codeContent);
    });

    zip.generateAsync({
      type: 'blob'
    }).then(function(content) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'files.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Create and add the "Download Zip" button
  const downloadZipButton = document.createElement('button');
  downloadZipButton.innerText = 'Download Zip';
  downloadZipButton.style.position = 'fixed';
  downloadZipButton.style.bottom = '10px';
  downloadZipButton.style.right = '10px';
  downloadZipButton.style.zIndex = '1000';
  downloadZipButton.onclick = createZipAndDownload;
  document.body.appendChild(downloadZipButton);

  // Set an interval to check for new code blocks every second
  setInterval(function() {
    const blocks = document.querySelectorAll('.prose pre');
    blocks.forEach(block => {
      addSaveButton(block);
    });
  }, 1000);
})();
