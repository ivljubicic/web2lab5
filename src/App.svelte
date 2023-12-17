<script>
  let images = [];

  function handleImageCapture(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        images = [e.target.result, ...images];
      };
      reader.readAsDataURL(file);
    }
  }
</script>

<input
  type="file"
  accept="image/*"
  capture="environment"
  onchange={handleImageCapture}
/>
{#each images as image}
  <img src={image} alt="User submited" />
{/each}
