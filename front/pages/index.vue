<template>
  <div class="home-page">
    <section class="hero-section" ref="heroSection">
      <div class="hero-content">
        <span class="hero-badge">LES HUMEURS À LA FUNÈS</span>
        <h1 class="hero-title">Suis tes humeurs avec Louis de Funès</h1>
        <p class="handwritten-note">Une humeur, une expression…</p>
        <p class="hero-description">Exprimez vos émotions à travers les expressions légendaires de Louis de Funès</p>
        <button class="cta-button" @click="goToRegister" :disabled="isNavigating">
          <span>{{ isNavigating ? "Chargement..." : "Commencer l'aventure" }}</span><span class="button-icon">→</span>
        </button>
      </div>
      <div class="scroll-indicator"><div class="mouse"><div class="wheel"></div></div></div>
    </section>

    <section class="concept-section" ref="conceptSection">
      <div class="section-header" :class="{ visible: isConceptVisible }">
        <span class="section-kicker">COMMENT ÇA MARCHE ?</span><h2 class="section-title">Le Concept</h2><p class="section-subtitle">Exprimez vos humeurs avec Louis de Funès</p>
      </div>
      <div class="concept-container"><div class="concept-grid">
        <article v-for="(concept,index) in concepts" :key="index" class="concept-card" @mouseenter="hoveredCard=index" @mouseleave="hoveredCard=null">
          <div class="concept-top"><span class="concept-icon" :class="{active:hoveredCard===index}">{{ concept.icon }}</span><span class="concept-number">0{{ index+1 }}</span></div>
          <h3>{{ concept.title }}</h3><p>{{ concept.description }}</p>
        </article>
      </div></div>
    </section>

    <section class="mood-section" ref="moodSection">
      <div class="section-header" :class="{visible:isMoodVisible}"><span class="section-kicker">UN APERÇU</span><h2 class="section-title">Aperçu des Humeurs</h2></div>
      <div v-if="isLoading" class="loading-state"><div class="spinner"></div><p>Chargement des humeurs...</p></div>
      <div v-else-if="errorMessage" class="error-state"><div class="error-icon">!</div><p>{{ errorMessage }}</p><button @click="fetchMoods" class="retry-button">Réessayer</button></div>
      <div v-else class="mood-grid" :class="{visible:isMoodVisible}">
        <article v-for="(mood,index) in moods" :key="mood._id" class="mood-card" :style="{'--delay':`${index*.08}s`}">
          <div class="mood-image-wrapper"><div class="image-placeholder" v-if="!mood.imageLoaded"></div><img :src="mood.image" :alt="mood.title" class="mood-image" :class="{loaded:mood.imageLoaded}" @load="mood.imageLoaded=true"/><span class="mood-index">0{{ index+1 }}</span></div>
          <div class="mood-content"><h3 class="mood-title">{{ mood.title }}</h3><p class="mood-subtitle">{{ mood.subtitle }}</p><p class="mood-film"><span>Film :</span> {{ mood.film }}</p></div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import {ref,onMounted,onUnmounted} from "vue";
const isNavigating=ref(false),isLoading=ref(true),errorMessage=ref(""),moods=ref([]),hoveredCard=ref(null),isConceptVisible=ref(false),isMoodVisible=ref(false);
const concepts=[
 {title:"Exprimez-vous",description:"Exprimez facilement votre humeur à travers des images de Louis de Funès",icon:"🎭"},
 {title:"Suivez",description:"Suivez votre humeur de façon journalière et hebdomadaire",icon:"📊"},
 {title:"Améliorez",description:"Améliorez votre humeur grâce à des vidéos et citations",icon:"⭐"},
 {title:"Partagez",description:"Partagez votre humeur avec votre entourage",icon:"🤝"}
];
const fetchMoods=async()=>{try{isLoading.value=true;errorMessage.value="";const response=await fetch("https://suivi-humeurs-funes.onrender.com/api/humeurs",{method:"GET",headers:{"Content-Type":"application/json"}});if(!response.ok)throw new Error("Impossible de récupérer les humeurs");const data=await response.json();moods.value=data.slice(0,4).map(mood=>({...mood,imageLoaded:false}));}catch(error){errorMessage.value="Une erreur est survenue lors du chargement des humeurs.";console.error(error);}finally{isLoading.value=false;}};
const checkSectionVisibility=()=>{const c=document.querySelector(".concept-section"),m=document.querySelector(".mood-section");isConceptVisible.value=!!c&&c.getBoundingClientRect().top<window.innerHeight*.92;isMoodVisible.value=!!m&&m.getBoundingClientRect().top<window.innerHeight*.92;};
onMounted(()=>{window.addEventListener("scroll",checkSectionVisibility);checkSectionVisibility();fetchMoods();});onUnmounted(()=>window.removeEventListener("scroll",checkSectionVisibility));
const goToRegister=async()=>{isNavigating.value=true;try{await navigateTo("/register");}finally{isNavigating.value=false;}};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&display=swap');
.home-page{--brown:#2c1810;--brown-soft:#5a3a2d;--cream:#f4e4bc;--cream-light:#fffaf0;--gold:#e9b949;min-height:100vh;background:var(--cream-light);color:var(--brown)}
.hero-section{position:relative;min-height:calc(100vh - 64px);display:flex;align-items:center;justify-content:center;padding:3rem 1.25rem;background-image:url('/background.jpg');background-size:cover;background-position:center;background-attachment:fixed;color:white;overflow:hidden}.hero-section:before{content:"";position:absolute;inset:0;background:linear-gradient(110deg,rgba(25,12,7,.78),rgba(44,24,16,.58),rgba(25,12,7,.72))}.hero-section:after{content:"";position:absolute;width:420px;height:420px;border-radius:50%;border:1px solid rgba(244,228,188,.18);right:-170px;top:-150px;box-shadow:0 0 0 55px rgba(244,228,188,.035)}
.hero-content{position:relative;z-index:2;text-align:center;max-width:850px;width:100%}.hero-badge,.section-kicker{display:inline-flex;align-items:center;padding:.48rem 1rem;border-radius:999px;font-size:.72rem;font-weight:800;letter-spacing:.2em}.hero-badge{color:var(--cream);background:rgba(244,228,188,.12);border:1px solid rgba(244,228,188,.24);backdrop-filter:blur(8px);margin-bottom:1.4rem}.hero-title{font-family:"Sora",sans-serif;font-size:clamp(2.4rem,6vw,4.8rem);line-height:1.04;font-weight:800;max-width:820px;margin:0 auto .35rem;text-wrap:balance;animation:fadeInUp .8s ease both}.handwritten-note{font-family:"Caveat",cursive;font-size:clamp(2rem,4.5vw,3.25rem);font-weight:500;color:#f6d778;line-height:1.05;margin:.15rem auto 1.2rem;transform:rotate(-2deg);width:max-content;max-width:100%;animation:fadeInUp .8s .1s ease both;position:relative}.handwritten-note:after{content:"";display:block;width:72%;height:7px;margin:-.05rem auto 0;border-bottom:3px solid rgba(246,215,120,.85);border-radius:50%;transform:rotate(-1deg)}.hero-description{font-size:clamp(1rem,2vw,1.25rem);line-height:1.7;max-width:640px;margin:0 auto 2rem;color:rgba(255,255,255,.88);animation:fadeInUp .8s .15s ease both}.cta-button{display:inline-flex;align-items:center;gap:.9rem;padding:.95rem 1.45rem;border:0;border-radius:999px;background:var(--cream);color:var(--brown);font-weight:800;font-size:1rem;cursor:pointer;box-shadow:0 12px 30px rgba(0,0,0,.18);transition:.25s ease;animation:fadeInUp .8s .3s ease both}.cta-button:hover{transform:translateY(-3px);background:#fff3d2}.button-icon{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--brown);color:var(--cream)}.scroll-indicator{position:absolute;z-index:2;bottom:25px;left:50%;transform:translateX(-50%)}.mouse{width:24px;height:38px;border:1.5px solid rgba(255,255,255,.6);border-radius:15px;display:flex;justify-content:center;padding-top:7px}.wheel{width:3px;height:7px;background:white;border-radius:3px;animation:scrollWheel 1.5s infinite}
.concept-section{position:relative;padding:clamp(4.5rem,8vw,7rem) 1rem;background:linear-gradient(180deg,#fffaf0 0%,#f8edcf 100%);overflow:hidden}.concept-section:before{content:"";position:absolute;width:230px;height:230px;border-radius:50%;background:rgba(233,185,73,.1);left:-100px;top:70px}.section-header{position:relative;z-index:1;text-align:center;max-width:720px;margin:0 auto clamp(2.4rem,5vw,4rem);opacity:0;transform:translateY(22px);transition:.6s ease}.section-header.visible{opacity:1;transform:none}.section-kicker{color:var(--brown-soft);background:rgba(255,255,255,.72);border:1px solid rgba(44,24,16,.08);margin-bottom:.9rem}.section-title{font-family:"Sora",sans-serif;font-size:clamp(2rem,4vw,3.15rem);line-height:1.1;margin:0 0 .8rem}.section-subtitle{color:rgba(44,24,16,.66);font-size:clamp(1rem,2vw,1.15rem)}.concept-container{max-width:1200px;margin:auto;position:relative;z-index:1}.concept-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}.concept-card{position:relative;min-height:245px;padding:1.5rem;border-radius:26px;background:rgba(255,255,255,.78);border:1px solid rgba(44,24,16,.09);box-shadow:0 12px 35px rgba(44,24,16,.06);transition:.3s ease}.concept-card:hover{transform:translateY(-6px);box-shadow:0 18px 38px rgba(44,24,16,.1)}.concept-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem}.concept-icon{display:grid;place-items:center;width:52px;height:52px;border-radius:17px;background:#fff3d4;font-size:1.55rem;transition:.25s}.concept-icon.active{transform:rotate(-5deg) scale(1.08)}.concept-number{font-family:"Sora",sans-serif;font-size:2.1rem;font-weight:800;color:rgba(44,24,16,.1)}.concept-card h3{font-family:"Sora",sans-serif;font-size:1.15rem;margin-bottom:.65rem}.concept-card p{color:rgba(44,24,16,.66);line-height:1.65;font-size:.94rem}
.mood-section{position:relative;padding:clamp(4.5rem,8vw,7rem) 1.25rem;background:#fff;overflow:hidden}.mood-section:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 5% 12%,rgba(244,228,188,.38),transparent 22%),radial-gradient(circle at 95% 80%,rgba(233,185,73,.12),transparent 24%)}.mood-grid{position:relative;z-index:1;display:grid;grid-template-columns:repeat(4,1fr);gap:1.15rem;max-width:1180px;margin:auto}.mood-card{background:#fffdf8;border:1px solid rgba(44,24,16,.1);border-radius:25px;overflow:hidden;box-shadow:0 12px 32px rgba(44,24,16,.08);opacity:0;transform:translateY(22px);transition:.45s ease;transition-delay:var(--delay)}.mood-grid.visible .mood-card{opacity:1;transform:none}.mood-grid.visible .mood-card:hover{transform:translateY(-7px);box-shadow:0 20px 42px rgba(44,24,16,.13)}.mood-image-wrapper{position:relative;aspect-ratio:1/1;overflow:hidden;background:#eee7d7}.image-placeholder{position:absolute;inset:0;background:#eee7d7}.mood-image{width:100%;height:100%;object-fit:cover;opacity:0;transition:.35s}.mood-image.loaded{opacity:1}.mood-index{position:absolute;top:12px;right:12px;padding:.35rem .6rem;border-radius:999px;background:rgba(255,250,240,.9);font-size:.75rem;font-weight:800}.mood-content{padding:1.25rem}.mood-title{font-family:"Sora",sans-serif;font-size:1.08rem;margin-bottom:.45rem}.mood-subtitle{color:rgba(44,24,16,.67);line-height:1.5;font-size:.91rem;margin-bottom:.8rem}.mood-film{font-size:.8rem;color:rgba(44,24,16,.5);padding-top:.75rem;border-top:1px solid rgba(44,24,16,.08)}.mood-film span{font-weight:700}.loading-state,.error-state{text-align:center;padding:2rem}.spinner{width:38px;height:38px;margin:0 auto 1rem;border:3px solid #eee7d7;border-top-color:var(--brown);border-radius:50%;animation:spin 1s linear infinite}.error-icon{margin:auto;width:42px;height:42px;display:grid;place-items:center;border-radius:50%;background:var(--cream)}.retry-button{margin-top:1rem;border:0;border-radius:999px;padding:.75rem 1.1rem;background:var(--brown);color:white}
@media(max-width:1024px){.concept-grid,.mood-grid{grid-template-columns:repeat(2,1fr)}.hero-section{background-attachment:scroll}}
@media(max-width:600px){.hero-section{min-height:78vh;padding:4rem 1.2rem}.hero-title{font-size:clamp(2.25rem,11vw,3.2rem)}.handwritten-note{font-size:clamp(1.8rem,9vw,2.55rem);margin:.35rem auto 1rem}.hero-badge,.section-kicker{font-size:.62rem;letter-spacing:.14em}.scroll-indicator{display:none}.concept-section,.mood-section{padding:4rem 1rem}.concept-grid{grid-template-columns:1fr 1fr;gap:.75rem}.concept-card{min-height:210px;padding:1.05rem;border-radius:21px}.concept-top{margin-bottom:1.2rem}.concept-icon{width:43px;height:43px;font-size:1.25rem}.concept-number{font-size:1.5rem}.concept-card h3{font-size:1rem}.concept-card p{font-size:.82rem}.mood-grid{display:flex;overflow-x:auto;gap:.85rem;margin:0 -1rem;padding:0 1rem 1rem;scroll-snap-type:x mandatory;scrollbar-width:none}.mood-card{flex:0 0 78%;max-width:290px;scroll-snap-align:center}.section-header{margin-bottom:2.2rem}}
@media(max-width:380px){.concept-grid{grid-template-columns:1fr}.concept-card{min-height:auto}}
@keyframes fadeInUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes scrollWheel{0%{opacity:0;transform:translateY(0)}40%{opacity:1}100%{opacity:0;transform:translateY(10px)}}
</style>