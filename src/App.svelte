<script>
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import { createClient } from "@supabase/supabase-js";

  const supabaseUrl = "https://fprjchxstoxsyhwwwnhn.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwcmpjaHhzdG94c3lod3d3bmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI4NDY4MjYsImV4cCI6MjAxODQyMjgyNn0.S0qAV5Ky7J1yyVr2dsfHzrkOSY-DbyXI548INZB4HwQ"; // Replace with your Supabase key
  const supabase = createClient(supabaseUrl, supabaseKey);

  onMount(async () => {
    let { data, error } = await supabase.storage
      .from("images")
      .list("public", { limit: 100, offset: 0 });

    if (error) {
      console.error("Error loading images:", error);
      return;
    }

    console.log(data);

    const imageUrls = data.map(
      (file) =>
        supabase.storage.from("images").getPublicUrl(`public/${file.name}`).data
          .publicUrl
    );
    images.set(imageUrls);
  });

  const images = writable([]);

  let fileInput;

  function selectImage(event) {
    console.log(event.target.files[0]);
    fileInput.value = "";
  }

  async function submitImage() {
    const file = fileInput.files[0];
    if (file) {
      // Generate a unique file name
      const uniqueId = Date.now() + "-" + Math.floor(Math.random() * 1e9);
      let filePath = `public/${uniqueId}`;

      let { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        return;
      }

      const publicUrl = await supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      images.update((currentImages) => [
        publicUrl.data.publicUrl,
        ...currentImages,
      ]);
    }
  }
</script>

<h1>Camera app web2lab5</h1>

<input
  type="file"
  accept="image/*"
  capture="environment"
  bind:this={fileInput}
  onchange={selectImage}
/>
<button on:click={submitImage}>Submit</button>

{#each $images as image, index (index)}
  <img src={image} alt={`User submitted image ${index}`} />
{/each}

<style>
  h1,
  input,
  button,
  img {
    display: block; /* Makes each element a block-level element */
    width: 100%; /* Each element takes the full width */
    margin-bottom: 10px; /* Adds some space below each element */
  }

  img {
    height: 400px; /* Fixed height for images */
    width: 400px; /* Fixed width for images */
    object-fit: cover; /* Ensures the images are nicely cropped to fit the box */
  }
</style>
