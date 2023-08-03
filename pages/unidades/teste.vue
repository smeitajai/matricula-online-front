<template>
  {{data}}
  </template>
  
  <script setup>

     const { data, pending, error, refresh } = await useGET('https://api.nuxtjs.dev/mountains',
        {
          method: "GET",
        });
  
    console.log(data.value);
    if (error.value) {
      console.log(error.value);
    }

  </script>