<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="hero-content">
        <span class="hero-badge">LES HUMEURS À LA FUNÈS</span>
        <h1 class="hero-title">Suis tes humeurs avec Louis de Funès</h1>
        <p class="handwritten-note">Une humeur, une expression…</p>
        <p class="hero-description">Exprimez vos émotions à travers les expressions légendaires de Louis de Funès</p>
        <button class="cta-button" @click="goToRegister" :disabled="isNavigating">
          <span>{{ isNavigating ? 'Chargement...' : "Commencer l'aventure" }}</span>
          <span class="button-icon">→</span>
        </button>
      </div>
      <div class="scroll-indicator"><div class="mouse"><div class="wheel"></div></div></div>
    </section>

    <section class="concept-section">
      <div class="section-header concept-section-header">
        <span class="section-kicker">COMMENT ÇA MARCHE ?</span>
        <h2 class="section-title">Le Concept</h2>
        <p class="section-subtitle">Exprimez vos humeurs avec Louis de Funès</p>
      </div>
      <div class="concept-grid">
        <article v-for="(concept,index) in concepts" :key="concept.title" class="concept-card">
          <div class="concept-top">
            <span class="concept-icon">{{ concept.icon }}</span>
            <span class="concept-number">0{{ index+1 }}</span>
          </div>
          <h3>{{ concept.title }}</h3>
          <p>{{ concept.description }}</p>
        </article>
      </div>
    </section>

    <section class="app-preview-section">
      <div class="section-header preview-section-header">
        <span class="section-kicker">L’EXPÉRIENCE</span>
        <h2 class="section-title">Dans l’application</h2>
        <p class="section-subtitle">Ton humeur, ton suivi et une touche de Louis de Funès.</p>
      </div>

      <div class="preview-stage">
        <div class="preview-quote-card">
          <span class="quote-mark">“</span>
          <p>« Le bonheur, c’est comme une belle paire de lunettes, ça fait tout de suite voir la vie plus claire ! »</p>
          <small>Louis de Funès</small>
        </div>

        <div class="preview-phone-wrap">
          <div class="preview-phone">
            <div class="preview-notch"></div>
            <div class="preview-screen">
              <div class="preview-nav">
                <b>Les Humeurs à la Funès</b>
                <span>🌙 &nbsp; ☰</span>
              </div>

              <div class="preview-body">
                <h3>Bonjour ! 👋</h3>
                <p class="preview-question">Alors, quelle est ton humeur aujourd’hui ?</p>

                <div class="preview-mood-card">
                  <div class="preview-movie-image">
                    <img src="https://media.gettyimages.com/id/1193495368/fr/photo/lacteur-fran%C3%A7ais-louis-de-funes-invit%C3%A9-de-l%C3%A9mission-les-rendez-vous-du-dimanche-pr%C3%A9sent%C3%A9e-par.jpg?s=2048x2048&w=gi&k=20&c=UljXJU8EOKgAe2_bIQ9TXxO9lMOvvJ76fJRoNw4KdWo=" alt="Louis de Funès" />
                    <div class="preview-image-label">
                      <span>Humeur du jour</span>
                      <b>Heureux</b>
                    </div>
                  </div>

                  <div class="preview-emojis">
                    <span>🤩<small>Génial</small></span>
                    <span>😌<small>Bien</small></span>
                    <span>😐<small>Moyen</small></span>
                    <span>😢<small>Pas top</small></span>
                    <span>😡<small>Nul</small></span>
                  </div>

                  <div class="preview-save">Enregistrer mon humeur</div>
                </div>

                <div class="preview-track">
                  <h4>📊 Mon suivi</h4>
                  <div class="preview-tabs"><b>Semaine</b><span>Mois</span><span>Année</span></div>
                  <div class="preview-bars"><i></i><i></i><i></i><i></i><i></i></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="preview-side">
          <p class="preview-handwritten">Et aujourd’hui,<br>quelle est ton humeur ? <span>↙</span></p>

          <div class="preview-benefits">
            <div class="preview-benefit"><span>📊</span><b>Suivi de tes humeurs</b></div>
            <div class="preview-benefit"><span>💛</span><b>Conseils bien-être</b></div>
            <div class="preview-benefit"><span>🙂</span><b>Une dose d’humour</b></div>
          </div>
        </div>
      </div>
    </section>

    <section class="mood-section">
      <div class="section-header mood-section-header">
        <span class="section-kicker">LES HUMEURS</span>
        <h2 class="section-title">Quelques humeurs</h2>
      </div>
      <div class="mood-grid">
        <article v-for="(mood,index) in moods" :key="mood._id" class="mood-card">
          <div class="mood-image-wrapper">
            <div class="image-placeholder" v-if="!mood.imageLoaded"></div>
            <img :src="mood.image" :alt="mood.title" class="mood-image" :class="{loaded:mood.imageLoaded}" loading="eager" decoding="async" fetchpriority="high" @load="mood.imageLoaded=true"/>
            <span class="mood-index">0{{ index+1 }}</span>
          </div>
          <div class="mood-content">
            <h3>{{ mood.title }}</h3>
            <p>{{ mood.subtitle }}</p>
            <small>{{ mood.film }}</small>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isNavigating = ref(false)

useHead({
  link: [
    { rel: 'preconnect', href: 'https://media.gettyimages.com', crossorigin: '' },
    { rel: 'dns-prefetch', href: 'https://media.gettyimages.com' },
    { rel: 'preload', as: 'image', href: 'https://media.gettyimages.com/id/1193495368/fr/photo/lacteur-fran%C3%A7ais-louis-de-funes-invit%C3%A9-de-l%C3%A9mission-les-rendez-vous-du-dimanche-pr%C3%A9sent%C3%A9e-par.jpg?s=2048x2048&w=gi&k=20&c=UljXJU8EOKgAe2_bIQ9TXxO9lMOvvJ76fJRoNw4KdWo=' },
    { rel: 'preload', as: 'image', href: 'https://media.gettyimages.com/id/1190192831/fr/photo/lacteur-fran%C3%A7ais-louis-de-funes-sur-le-tournage-du-film-la-grande-vadrouille.jpg?s=1024x1024&w=gi&k=20&c=eQKhJTznlLbW3XzdiCbtNDOihpJ8MYQq2nC1xB-tfaE=' },
    { rel: 'preload', as: 'image', href: 'https://media.gettyimages.com/id/1175705018/fr/photo/louis-de-funes-on-the-set-of-les-aventures-de-rabbi-jacob-directed-by-gerard-oury-28th-march.jpg?s=1024x1024&w=gi&k=20&c=gk3H9CdG4r-zUeZUjel60HNKBM-UBPMcNTn-Yeg8kJA=' }
  ]
})

const concepts = [
  {title:'Exprimez-vous',description:'Exprimez facilement votre humeur à travers des images de Louis de Funès',icon:'🎭'},
  {title:'Suivez',description:'Suivez votre humeur de façon journalière et hebdomadaire',icon:'📊'},
  {title:'Améliorez',description:'Améliorez votre humeur grâce à des vidéos et citations',icon:'⭐'},
  {title:'Partagez',description:'Partagez votre humeur avec votre entourage',icon:'🤝'}
]

const moods = ref([
  {
    _id:'60b6c48f0c9c9f67a15a6b67',
    title:'Heureux',
    subtitle:'Mais c’est formidable !',
    film:'Le Corniaud',
    image:'https://media.gettyimages.com/id/1193495368/fr/photo/louis-de-funes.jpg',
    imageLoaded:false
  },
  {
    _id:'60b6c48f0c9c9f67a15a6b71',
    title:'Énervé',
    subtitle:'C’était pas mauvais, c’était très mauvais !',
    film:'La Grande Vadrouille',
    image:'https://media.gettyimages.com/id/1190192831/fr/photo/louis-de-funes.jpg',
    imageLoaded:false
  },
  {
    _id:'60b6c48f0c9c9f67a15a6b72',
    title:'Triste',
    subtitle:'Je suis triste, tout ça me fatigue, tout ça me dépasse...',
    film:'Rabbi Jacob',
    image:'https://media.gettyimages.com/id/1175705018/fr/photo/louis-de-funes.jpg',
    imageLoaded:false
  }
])

const goToRegister = async () => {
  isNavigating.value = true
  try { await navigateTo('/register') }
  finally { isNavigating.value = false }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Sora:wght@400;600;700;800&display=swap');

.home-page{--brown:#2c1810;--brown-soft:#5a3a2d;--cream:#f4e4bc;--cream-light:#fffaf0;--gold:#e9b949;--green:#78986a;min-height:100vh;background:var(--cream-light);color:var(--brown);font-family:'Sora',sans-serif}

/* HERO */
.hero-section{position:relative;min-height:78vh;display:flex;align-items:center;justify-content:center;padding:2.5rem 1.25rem;background-image:url('/background.jpg');background-size:cover;background-position:center;background-attachment:fixed;color:white;overflow:hidden}
.hero-section:before{content:'';position:absolute;inset:0;background:linear-gradient(110deg,rgba(25,12,7,.78),rgba(44,24,16,.58),rgba(25,12,7,.72))}
.hero-section:after{content:'';position:absolute;width:420px;height:420px;border-radius:50%;border:1px solid rgba(244,228,188,.18);right:-170px;top:-150px;box-shadow:0 0 0 55px rgba(244,228,188,.035)}
.hero-content{position:relative;z-index:2;text-align:center;max-width:850px;width:100%}
.hero-badge,.section-kicker{display:inline-flex;align-items:center;padding:.48rem 1rem;border-radius:999px;font-size:.72rem;font-weight:800;letter-spacing:.2em}
.hero-badge{color:var(--cream);background:rgba(244,228,188,.12);border:1px solid rgba(244,228,188,.24);backdrop-filter:blur(8px);margin-bottom:1.4rem}
.hero-title{font-size:clamp(2rem,4.8vw,3.9rem);line-height:1.04;font-weight:800;max-width:820px;margin:0 auto .35rem}
.handwritten-note{font-family:'Caveat',cursive;font-size:clamp(1rem,1.8vw,1.3rem);font-weight:500;color:rgba(255,255,255,.92);margin:.35rem auto 1.25rem;transform:rotate(-1deg);width:max-content;max-width:100%}
.hero-description{font-size:clamp(.9rem,1.6vw,1.05rem);line-height:1.7;max-width:640px;margin:0 auto 2rem;color:rgba(255,255,255,.88)}
.cta-button{display:inline-flex;align-items:center;gap:.7rem;padding:.78rem 1.2rem;border:0;border-radius:999px;background:var(--cream);color:var(--brown);font:inherit;font-weight:800;cursor:pointer;box-shadow:0 12px 30px rgba(0,0,0,.18);transition:.25s}
.cta-button:hover{transform:translateY(-3px);background:#fff3d2}
.button-icon{display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:var(--brown);color:var(--cream)}
.scroll-indicator{position:absolute;z-index:2;bottom:25px;left:50%;transform:translateX(-50%)}
.mouse{width:24px;height:38px;border:1.5px solid rgba(255,255,255,.6);border-radius:15px;display:flex;justify-content:center;padding-top:7px}
.wheel{width:3px;height:7px;background:white;border-radius:3px;animation:scrollWheel 1.5s infinite}

/* COMMON SECTIONS */
.concept-section,.app-preview-section,.mood-section{
  padding:clamp(3.8rem,6vw,5.5rem) 1rem;
}
.concept-section{background:#fffaf0}
.app-preview-section{background:#f7edcf}
.mood-section{background:#fff}

.section-header{
  text-align:center;
  max-width:660px;
  margin:0 auto 2.4rem;
}
.section-kicker{
  color:var(--brown-soft);
  background:rgba(255,255,255,.78);
  border:1px solid rgba(44,24,16,.08);
  margin-bottom:.7rem;
  font-size:.62rem;
  padding:.42rem .8rem;
}
.section-title{
  font-size:clamp(1.75rem,3vw,2.45rem);
  line-height:1.12;
  margin:0 0 .65rem;
  font-weight:800;
}
.section-subtitle{
  color:rgba(44,24,16,.63);
  line-height:1.55;
  font-size:.88rem;
  margin:0;
}
.concept-section-header,
.preview-section-header,
.mood-section-header{
  text-align:center;
  max-width:660px;
}

/* CONCEPT */
.concept-grid{
  max-width:900px;
  margin:auto;
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:1rem;
}
.concept-card{
  position:relative;
  min-height:180px;
  padding:1.15rem;
  border-radius:20px;
  background:#fff;
  border:1px solid rgba(44,24,16,.08);
  box-shadow:0 10px 26px rgba(44,24,16,.045);
  transition:transform .25s,box-shadow .25s;
}
.concept-card::before,.preview-benefit::before{
  content:'';
  position:absolute;
  inset:0;
  padding:2px;
  box-sizing:border-box;
  border-radius:inherit;
  background:conic-gradient(from var(--border-angle),transparent 0 62%,var(--green) 72%,#a8c99b 82%,transparent 92%);
  opacity:0;
  pointer-events:none;
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
  -webkit-mask-composite:xor;
  mask-composite:exclude;
}
.concept-card:hover{
  transform:translateY(-4px);
  box-shadow:0 14px 30px rgba(44,24,16,.075);
}
.concept-card:hover::before,.preview-benefit:hover::before{
  opacity:1;
  animation:greenBorderTrace 1.25s linear infinite;
}
.concept-top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:1rem;
}
.concept-icon{
  display:grid;
  place-items:center;
  width:42px;
  height:42px;
  border-radius:14px;
  background:#fff3d4;
  font-size:1.15rem;
}
.concept-number{
  font-size:1.45rem;
  font-weight:800;
  color:rgba(44,24,16,.1);
}
.concept-card h3{
  font-size:.98rem;
  margin:0 0 .42rem;
}
.concept-card p{
  color:rgba(44,24,16,.64);
  line-height:1.5;
  font-size:.78rem;
  margin:0;
}

/* APP PREVIEW */
.preview-stage{
  max-width:900px;
  margin:auto;
  padding:1.7rem;
  border:1px solid rgba(44,24,16,.075);
  border-radius:28px;
  background:#fffaf2;
  box-shadow:0 16px 38px rgba(67,42,18,.055);
  display:grid;
  grid-template-columns:.72fr 1fr .88fr;
  align-items:center;
  gap:1.35rem;
}
.preview-quote-card{
  position:relative;
  width:150px;
  justify-self:center;
  padding:.72rem .8rem;
  border-radius:16px;
  background:linear-gradient(145deg,#2d160f,#482317);
  color:#fff7e8;
  box-shadow:0 10px 22px rgba(44,24,16,.14);
  transform:rotate(-2deg);
}
.preview-quote-card .quote-mark{
  position:absolute;
  right:10px;
  top:2px;
  font-size:2rem;
  opacity:.55;
}
.preview-quote-card p{
  font-family:'Caveat',cursive;
  font-size:.8rem;
  line-height:1.14;
  margin:.1rem 1rem .45rem 0;
}
.preview-quote-card small{
  font-size:.58rem;
  opacity:.78;
}
.preview-phone-wrap{
  display:flex;
  justify-content:center;
  align-items:center;
}
.preview-phone{
  position:relative;
  width:250px;
  height:455px;
  border:8px solid #141111;
  border-radius:38px;
  background:#111;
  padding:5px;
  box-shadow:0 22px 44px rgba(44,24,16,.18);
  transform:rotate(-1deg);
}
.preview-notch{
  position:absolute;
  z-index:5;
  top:5px;
  left:50%;
  transform:translateX(-50%);
  width:82px;
  height:18px;
  border-radius:0 0 16px 16px;
  background:#111;
}
.preview-screen{
  height:100%;
  border-radius:27px;
  overflow:hidden;
  background:#fffaf2;
}
.preview-nav{
  height:48px;
  background:#3b1b10;
  color:#fff6de;
  display:flex;
  justify-content:space-between;
  align-items:flex-end;
  padding:0 12px 9px;
  font-size:.58rem;
}
.preview-body{padding:11px 9px;color:#2d2020}
.preview-body h3{font-size:.82rem;margin:0}
.preview-question{font-size:.55rem;margin:.18rem 0 .75rem}
.preview-mood-card,.preview-track{
  background:#fff;
  border:1px solid #eee5d8;
  border-radius:15px;
  padding:8px;
  box-shadow:0 7px 18px rgba(44,24,16,.055);
}
.preview-movie-image{
  position:relative;
  height:122px;
  border-radius:14px;
  overflow:hidden;
  background:#f3e6c5;
}
.preview-movie-image img{
  width:100%;
  height:100%;
  display:block;
  object-fit:cover;
  object-position:center 32%;
  filter:saturate(1.02) contrast(1.01);
}
.preview-image-label{
  position:absolute;
  left:7px;
  bottom:7px;
  display:flex;
  align-items:center;
  gap:.35rem;
  padding:.28rem .45rem;
  border-radius:999px;
  background:rgba(44,24,16,.82);
  color:#fff8e9;
  backdrop-filter:blur(5px);
}
.preview-image-label span{font-size:.34rem;opacity:.8}
.preview-image-label b{font-size:.43rem}
.preview-emojis{
  display:grid;
  grid-template-columns:repeat(5,1fr);
  gap:4px;
}
.preview-emojis span{
  display:flex;
  flex-direction:column;
  align-items:center;
  padding:4px 1px;
  background:#fff9e9;
  border:1px solid rgba(233,185,73,.18);
  border-radius:8px;
  font-size:.78rem;
}
.preview-emojis small{font-size:.34rem;margin-top:2px}
.preview-save{
  margin-top:7px;
  padding:6px;
  border-radius:999px;
  text-align:center;
  background:linear-gradient(90deg,#f4ad20,#ffd15d);
  font-size:.5rem;
  font-weight:800;
}
.preview-track{margin-top:10px}
.preview-track h4{margin:0 0 5px;font-size:.68rem}
.preview-tabs{
  display:flex;
  background:#f4efe8;
  border-radius:999px;
  font-size:.4rem;
}
.preview-tabs>*{flex:1;text-align:center;padding:6px}
.preview-tabs b{background:var(--brown);color:#fff;border-radius:999px}
.preview-bars{
  height:42px;
  display:flex;
  align-items:flex-end;
  justify-content:space-around;
  padding-top:7px;
}
.preview-bars i{
  width:10px;
  border-radius:5px 5px 2px 2px;
  background:#f2bd45;
}
.preview-bars i:nth-child(1){height:28%}
.preview-bars i:nth-child(2){height:62%;background:#91b97f}
.preview-bars i:nth-child(3){height:43%;background:#b99bd4}
.preview-bars i:nth-child(4){height:78%;background:#75c8c2}
.preview-bars i:nth-child(5){height:53%}
.preview-side{
  display:flex;
  flex-direction:column;
  justify-content:center;
  gap:.9rem;
}
.preview-handwritten{
  font-family:'Caveat',cursive;
  font-size:1.12rem;
  line-height:1.05;
  text-align:center;
  transform:rotate(-3deg);
  margin:0 0 .25rem;
}
.preview-handwritten span{
  display:block;
  font-family:'Sora',sans-serif;
  font-size:1.3rem;
  margin-top:.3rem;
}
.preview-benefits{
  display:flex;
  flex-direction:column;
  gap:.65rem;
}
.preview-benefit{
  position:relative;
  display:flex;
  align-items:center;
  gap:.6rem;
  background:#fff;
  border:1px solid rgba(44,24,16,.07);
  border-radius:15px;
  padding:.58rem;
  box-shadow:0 7px 18px rgba(44,24,16,.04);
  font-size:.66rem;
  transition:transform .25s,box-shadow .25s;
}
.preview-benefit:hover{
  transform:translateY(-3px);
  box-shadow:0 10px 22px rgba(44,24,16,.07);
}
.preview-benefit>span{
  display:grid;
  place-items:center;
  width:31px;
  height:31px;
  flex:none;
  background:#fff1bd;
  border-radius:50%;
  font-size:.95rem;
}

/* MOOD CARDS */
.mood-grid{
  max-width:850px;
  margin:auto;
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:.9rem;
}
.mood-card{
  background:#fffdf8;
  border:1px solid rgba(44,24,16,.08);
  border-radius:18px;
  overflow:hidden;
  box-shadow:0 9px 22px rgba(44,24,16,.05);
  transition:transform .25s,box-shadow .25s;
}
.mood-card:hover{
  transform:translateY(-4px);
  box-shadow:0 13px 28px rgba(44,24,16,.08);
}
.mood-image-wrapper{
  position:relative;
  aspect-ratio:4/3;
  overflow:hidden;
  background:#eee7d7;
}
.image-placeholder{position:absolute;inset:0;background:linear-gradient(110deg,#eee7d7 8%,#f7f1e6 18%,#eee7d7 33%);background-size:200% 100%;animation:imageShimmer 1.15s linear infinite}
.mood-image{
  width:100%;
  height:100%;
  object-fit:cover;
  opacity:0;
  transition:.35s;
}
.mood-image.loaded{opacity:1}
.mood-index{
  position:absolute;
  top:8px;
  right:8px;
  padding:.25rem .45rem;
  border-radius:999px;
  background:rgba(255,250,240,.92);
  font-size:.6rem;
  font-weight:800;
}
.mood-content{padding:.75rem}
.mood-content h3{margin:0 0 .25rem;font-size:.9rem}
.mood-content p{
  font-size:.7rem;
  line-height:1.4;
  color:rgba(44,24,16,.65);
  margin:.2rem 0 .5rem;
}
.mood-content small{
  font-size:.59rem;
  color:rgba(44,24,16,.5);
}

/* RESPONSIVE */
@media(max-width:1024px){
  .hero-section{background-attachment:scroll}
  .concept-grid{max-width:760px}
  .preview-stage{
    max-width:760px;
    grid-template-columns:.72fr 1fr .88fr;
    padding:1.4rem;
    gap:1rem;
  }
  .mood-grid{max-width:760px}
}

@media(max-width:760px){
  .concept-section,.app-preview-section,.mood-section{
    padding:3rem .85rem;
  }
  .section-header{margin-bottom:1.8rem}
  .section-title{font-size:clamp(1.5rem,7vw,1.95rem)}
  .section-subtitle{font-size:.84rem}

  .concept-grid{
    grid-template-columns:1fr;
    gap:.75rem;
    max-width:520px;
  }
  .concept-card{
    min-height:145px;
    padding:.9rem;
  }

  .preview-stage{
    display:flex;
    flex-direction:column;
    max-width:520px;
    padding:1.2rem .85rem;
    gap:1rem;
  }
  .preview-quote-card{
    width:150px;
    margin:0 auto;
  }
  .preview-phone{width:210px;height:390px;border-width:6px;border-radius:34px}
  .preview-notch{width:72px;height:16px}
  .preview-screen{border-radius:25px}
  .preview-nav{height:43px;padding:0 10px 8px;font-size:.52rem}
  .preview-body{padding:10px 8px}
  .preview-body h3{font-size:.75rem}
  .preview-question{font-size:.5rem;margin-bottom:.5rem}
  .preview-movie-image{height:98px}
  .preview-caption{font-size:.62rem;margin:.3rem 0}
  .preview-emojis span{font-size:.72rem;padding:3px 1px}
  .preview-emojis small{font-size:.31rem}
  .preview-save{font-size:.45rem;padding:5px}
  .preview-track{padding:7px;margin-top:7px}
  .preview-track h4{font-size:.6rem}
  .preview-tabs{font-size:.34rem}
  .preview-tabs>*{padding:4px}
  .preview-bars{height:36px}
  .preview-bars i{width:9px}
  .preview-side{width:100%;max-width:350px;margin:auto}
  .preview-handwritten{font-size:1.05rem}
  .preview-benefits{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:.55rem;
  }
  .preview-benefit:last-child{
    grid-column:1/-1;
    justify-self:center;
    width:calc(50% - .28rem);
  }

  .mood-grid{
    grid-template-columns:1fr;
    max-width:520px;
    gap:.75rem;
  }
  .mood-card{
    display:grid;
    grid-template-columns:130px 1fr;
  }
  .mood-image-wrapper{
    aspect-ratio:auto;
    height:100%;
    min-height:135px;
  }
  .mood-content{
    display:flex;
    flex-direction:column;
    justify-content:center;
  }
}

@media(max-width:420px){
  .concept-grid,.mood-grid,.preview-stage{max-width:100%}
  .mood-card{grid-template-columns:110px 1fr}
  .mood-image-wrapper{min-height:128px}
  .preview-phone{width:198px;height:370px}
  .preview-benefits{grid-template-columns:1fr}
  .preview-benefit:last-child{
    grid-column:auto;
    width:100%;
    justify-self:stretch;
  }
}

@property --border-angle{syntax:'<angle>';inherits:false;initial-value:0deg}
@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
@keyframes scrollWheel{0%{opacity:0;transform:translateY(0)}40%{opacity:1}100%{opacity:0;transform:translateY(10px)}}
@keyframes greenBorderTrace{to{--border-angle:360deg}}
@keyframes imageShimmer{to{background-position-x:-200%}}
</style>