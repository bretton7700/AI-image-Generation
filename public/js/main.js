function onSubmit(e) {
    e.preventDefault();
  
    document.querySelector('.msg').textContent = '';
    document.querySelector('#image').src = '';
  
    const prompt = document.querySelector('#prompt').value;
    const size = document.querySelector('#size').value;
  
    if (prompt === '') {
      alert('Please add some text');
      return;
    }
  
    generateImageRequest(prompt, size);
  }
  
  async function generateImageRequest(prompt, size) {
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
      document.querySelector('#image').src = imageUrl;
  
        
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