function onSubmit(e) {
  e.preventDefault();

  document.querySelector('.msg').textContent = '';
  document.querySelector('#image').src = '';

  const prompt = document.querySelector('#prompt').value;
  const size = document.querySelector('#size').value;
  const logoInput = document.querySelector('#logo-upload');
  const addLogo = confirm('Do you want to add your brand logo to the image?');

  if (prompt === '') {
    alert('Please add some text');
    return;
  }

  if (addLogo) {
    const logoFile = logoInput.files[0];
    if (!logoFile) {
      alert('Please upload your logo');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(logoFile);
    reader.onloadend = function () {
      const logoUrl = reader.result;
      generateImageRequest(prompt, size, logoUrl);
    };
  } else {
    generateImageRequest(prompt, size, null);
  }
}




function loadImage(url, crossOrigin = '') {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.onerror = (error) => {
      reject(error);
    };
    if (crossOrigin) {
      image.crossOrigin = crossOrigin;
    }
    image.src = url;
  });
}



async function addLogoToImage(imageUrl, logoUrl) {
  const proxyUrl = (url) => `/proxy/image?url=${encodeURIComponent(url)}`;
  const logoImage = /^data:image\//i.test(logoUrl)
    ? await loadImage(logoUrl) // Handle base64-encoded logo directly
    : await loadImage(proxyUrl(logoUrl), 'anonymous');
  const backgroundImage = await loadImage(proxyUrl(imageUrl));
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const imageSize = backgroundImage.width > backgroundImage.height ? backgroundImage.width : backgroundImage.height;
  canvas.width = imageSize;
  canvas.height = imageSize;

  // Draw the generated image as the background image
  ctx.drawImage(backgroundImage, 0, 0, imageSize, imageSize);

  // Draw the logo image on the bottom left corner of the generated image
  const logoSize = imageSize / 10; // Set the logo size to be 1/10th of the image size
  const logoX = imageSize / 20; // Set the logo position to be in the bottom left corner
  const logoY = imageSize - (imageSize / 10) - (imageSize / 20);
  ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);

  // Convert the canvas to an image URL
  const imageUrlWithLogo = canvas.toDataURL();

  return imageUrlWithLogo;
}

async function setDownloadLink(imageUrl) {
  const downloadLink = document.querySelector('#download-link');
  downloadLink.href = imageUrl;
  downloadLink.setAttribute('download', 'generated-image.png');
  downloadLink.style.display = 'inline-block';
}



async function generateImageRequest(prompt, size, logoUrl) {
  try {
    showSpinner();

    const response = await fetch('/ai/generateimage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        size,
      }),
    });

    if (!response.ok) {
      removeSpinner();
      throw new Error('That image could not be generated');
    }

    const generatedImageData = await response.json();
    const imageUrl = generatedImageData.data;
    const imageUrlWithLogo = logoUrl ? await addLogoToImage(imageUrl, logoUrl) : imageUrl; // Add the logo to the generated image if logoUrl is not null
    // document.querySelector('#image').src = imageUrlWithLogo;
    document.querySelector('#image').src = imageUrlWithLogo;
    await setDownloadLink(imageUrlWithLogo);

    removeSpinner();
  } catch (error) {
    document.querySelector('.msg').textContent = error;
  }
}



function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function removeSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

document.querySelector('#image-form').addEventListener('submit', onSubmit);