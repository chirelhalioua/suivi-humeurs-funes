<template>
  <div class="terms">
    <h1>Conditions d'utilisation</h1>
    <p>Bienvenue sur <strong>Les Humeurs à la Funès</strong> ! En utilisant notre site, vous acceptez pleinement et sans réserve les conditions d'utilisation suivantes.</p>

    <h2>1. Objet du site</h2>
    <p>Ce site a pour vocation de suivre et partager les humeurs journalières et hebdomadaires, avec une touche d'humour inspirée par l'esprit de Louis de Funès.</p>

    <h2>2. Utilisation du contenu</h2>
    <p>Tout le contenu publié sur ce site (textes, images, humeurs) est la propriété de <strong>Les humeurs à la Funès</strong> ou de ses contributeurs. Toute reproduction, diffusion ou utilisation sans autorisation préalable est interdite.</p>

    <h2>3. Responsabilité de l'utilisateur</h2>
    <p>En utilisant ce site, vous vous engagez à respecter les lois en vigueur et à ne pas publier de contenu offensant, diffamatoire ou illégal.</p>

    <h2>4. Collecte et utilisation des données</h2>
    <p>Dans le cadre de l'utilisation de notre site <strong>Les humeurs à la Funès</strong>, nous collectons certaines données personnelles afin de vous offrir une expérience optimale et de permettre le suivi des humeurs. Les données collectées sont les suivantes :</p>
    <ul>
      <li>Nom</li>
      <li>Prénom</li>
      <li>Adresse e-mail</li>
      <li>Humeurs journalières et hebdomadaires</li>
    </ul>
    <p>Ces informations sont strictement utilisées dans le but de suivre et d'afficher les humeurs, et ne seront en aucun cas utilisées à d'autres fins ni partagées avec des tiers sans votre consentement explicite.</p>

    <h2>5. Modification des conditions</h2>
    <p>Les présentes conditions peuvent être modifiées à tout moment. Nous vous encourageons à les consulter régulièrement.</p>

    <h2>6. Contact</h2>
    <p>Pour toute question concernant ces conditions d'utilisation, vous pouvez nous contacter à l'adresse suivante : contact@leshumeursfunès.fr</p>
  </div>
</template>

<script>
export default {
  name: 'TermsPage'
}
</script>

<style scoped>
.terms {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

h1 {
  text-align: center;
  font-size: 2.5rem;
}

h2 {
  margin-top: 20px;
  font-size: 1.8rem;
}

p {
  margin: 10px 0;
}

ul {
  list-style-type: disc;
  margin: 10px 0;
  padding-left: 20px;
}

li {
  margin-bottom: 5px;
}
</style>
