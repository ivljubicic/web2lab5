<script>
  import { writable } from "svelte/store";

  const images = writable([]);

  let fileInput; // Reference to the file input element

  function selectImage(event) {
    // Log the selected file for debugging
    console.log(event.target.files[0]);
    // Clear the previous file to ensure the new one can be selected even if it's the same file
    fileInput.value = "";
  }

  function submitImage() {
    // Get the file from the file input
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Update the images store with the new image
        images.update((currentImages) => {
          return [e.target.result, ...currentImages];
        });
      };
      reader.readAsDataURL(file);
    }
  }
</script>

<h1 class="font-bold">Camera app web2lab5</h1>

<!-- Bind the input element to the fileInput variable -->
<input
  type="file"
  accept="image/*"
  capture="environment"
  bind:this={fileInput}
  onchange={selectImage}
/>
<button on:click={submitImage}>Submit</button>

<!-- Display each submitted image -->
{#each $images as image, index (index)}
  <img src={image} alt="User submitted image {index}" />
{/each}
