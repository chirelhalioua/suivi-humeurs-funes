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
      <div class="concept-flow">
        <article v-for="(concept,index) in concepts" :key="concept.title" class="concept-step">
          <div class="concept-step-content">
            <span class="concept-number">0{{ index+1 }}</span>
            <h3>{{ concept.title }}</h3>
            <p>{{ concept.description }}</p>
          </div>

          <div class="concept-marker">
            <span>{{ concept.icon }}</span>
          </div>
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
                  </div>

                  <div class="preview-mood-name">Heureux</div>

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
      <div class="mood-list">
        <article v-for="(mood,index) in moods" :key="mood._id" class="mood-row">
          <div class="mood-row-number">0{{ index+1 }}</div>

          <div class="mood-image-wrapper">
            <img :src="mood.image" :alt="mood.title" class="mood-image" loading="eager" decoding="async" fetchpriority="high" referrerpolicy="no-referrer"/>
          </div>

          <div class="mood-content">
            <span class="mood-film">{{ mood.film }}</span>
            <h3>{{ mood.title }}</h3>
            <p>{{ mood.subtitle }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="final-cta-section">
      <div class="final-cta-card">
        <span class="final-cta-note">Et toi, aujourd’hui ?</span>
        <h2>Quelle est ton humeur ?</h2>
        <p>Choisis ton humeur, suis son évolution et retrouve une touche de Louis de Funès au quotidien.</p>
        <button class="final-cta-button" @click="goToRegister" :disabled="isNavigating">
          <span>{{ isNavigating ? 'Chargement...' : "Commencer l’aventure" }}</span>
          <span>→</span>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isNavigating = ref(false)

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
    image:'https://media.gettyimages.com/id/1193495368/fr/photo/lacteur-fran%C3%A7ais-louis-de-funes-invit%C3%A9-de-l%C3%A9mission-les-rendez-vous-du-dimanche-pr%C3%A9sent%C3%A9e-par.jpg?s=2048x2048&w=gi&k=20&c=UljXJU8EOKgAe2_bIQ9TXxO9lMOvvJ76fJRoNw4KdWo='
  },
  {
    _id:'60b6c48f0c9c9f67a15a6b71',
    title:'Énervé',
    subtitle:'C’était pas mauvais, c’était très mauvais !',
    film:'La Grande Vadrouille',
    image:'https://media.gettyimages.com/id/1190192831/fr/photo/lacteur-fran%C3%A7ais-louis-de-funes-sur-le-tournage-du-film-la-grande-vadrouille.jpg?s=1024x1024&w=gi&k=20&c=eQKhJTznlLbW3XzdiCbtNDOihpJ8MYQq2nC1xB-tfaE='
  },
  {
    _id:'60b6c48f0c9c9f67a15a6b72',
    title:'Triste',
    subtitle:'Je suis triste, tout ça me fatigue, tout ça me dépasse...',
    film:'Rabbi Jacob',
    image:'https://media.gettyimages.com/id/1175705018/fr/photo/louis-de-funes-on-the-set-of-les-aventures-de-rabbi-jacob-directed-by-gerard-oury-28th-march.jpg?s=1024x1024&w=gi&k=20&c=gk3H9CdG4r-zUeZUjel60HNKBM-UBPMcNTn-Yeg8kJA='
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
.concept-section,.app-preview-section,.mood-section,.final-cta-section{
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
.concept-flow{
  position:relative;
  max-width:1080px;
  margin:auto;
  padding:.35rem 0;
}
.concept-flow::before{
  content:'';
  position:absolute;
  top:18px;
  bottom:18px;
  left:50%;
  width:1px;
  background:linear-gradient(180deg,transparent,rgba(44,24,16,.16) 8%,rgba(44,24,16,.16) 92%,transparent);
  transform:translateX(-50%);
}
.concept-step{
  position:relative;
  display:grid;
  grid-template-columns:1fr 72px 1fr;
  align-items:center;
  min-height:138px;
}
.concept-step:nth-child(odd) .concept-step-content{
  grid-column:1;
  text-align:right;
  padding:1rem 1.15rem;
  margin-right:1.2rem;
}
.concept-step:nth-child(even) .concept-step-content{
  grid-column:3;
  text-align:left;
  padding:1rem 1.15rem;
  margin-left:1.2rem;
}
.concept-step-content{
  position:relative;
  border-radius:18px;
  background:rgba(255,255,255,.78);
  border:1px solid rgba(44,24,16,.075);
  box-shadow:0 8px 20px rgba(44,24,16,.035);
  transition:transform .25s,box-shadow .25s;
}
.concept-step-content::before{
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
.concept-step:hover .concept-step-content{
  transform:translateY(-3px);
  box-shadow:0 12px 26px rgba(44,24,16,.06);
}
.concept-step:hover .concept-step-content::before{
  opacity:1;
  animation:greenBorderTrace 1.25s linear infinite;
}

.concept-marker{
  grid-column:2;
  grid-row:1;
  position:relative;
  z-index:2;
  display:grid;
  place-items:center;
  width:48px;
  height:48px;
  margin:auto;
  border-radius:50%;
  background:#fffaf0;
  border:1px solid rgba(44,24,16,.12);
  box-shadow:0 5px 14px rgba(44,24,16,.06);
  transition:transform .25s,border-color .25s,box-shadow .25s;
}
.concept-marker::after{
  content:'';
  position:absolute;
  inset:5px;
  border-radius:50%;
  background:#fff1bd;
  z-index:-1;
}
.concept-marker span{
  font-size:1.08rem;
}
.concept-step:hover .concept-marker{
  transform:scale(1.07);
  border-color:rgba(120,152,106,.55);
  box-shadow:0 7px 18px rgba(44,24,16,.09);
}
.concept-number{
  display:block;
  margin-bottom:.2rem;
  color:rgba(44,24,16,.34);
  font-size:.62rem;
  font-weight:800;
  letter-spacing:.16em;
}
.concept-step h3{
  margin:0 0 .28rem;
  font-size:1rem;
}
.concept-step p{
  max-width:340px;
  margin:0;
  color:rgba(44,24,16,.62);
  font-size:.77rem;
  line-height:1.5;
}
.concept-step:nth-child(odd) p{
  margin-left:auto;
}

/* APP PREVIEW */
.preview-stage{
  position:relative;
  max-width:1080px;
  margin:auto;
  padding:2rem 2.2rem;
  border:0;
  border-radius:34px;
  background:linear-gradient(135deg,rgba(255,250,242,.72),rgba(244,228,188,.44));
  box-shadow:0 14px 34px rgba(67,42,18,.035),inset 0 0 0 1px rgba(255,255,255,.48);
  display:grid;
  grid-template-columns:.78fr 1fr .9fr;
  align-items:center;
  gap:1.65rem;
}
.preview-quote-card{
  position:relative;
  width:158px;
  justify-self:end;
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
  border:6px solid #5a3426;
  border-radius:38px;
  background:#5a3426;
  padding:5px;
  box-shadow:0 16px 28px rgba(44,24,16,.12);
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
  background:#5a3426;
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
.preview-mood-name{
  margin:5px 0 4px;
  color:#3b1b10;
  font-size:.52rem;
  font-weight:800;
  text-align:center;
}
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
  gap:1rem;
  max-width:240px;
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
.mood-section{
  background:linear-gradient(180deg,#fff 0%,#fffaf0 100%);
}
.mood-list{
  max-width:1080px;
  margin:auto;
  display:flex;
  flex-direction:column;
  gap:.9rem;
}
.mood-row{
  position:relative;
  display:grid;
  grid-template-columns:58px 250px 1fr;
  align-items:center;
  gap:1.15rem;
  min-height:160px;
  padding:.8rem 1.15rem .8rem .8rem;
  background:#fffdf8;
  border:1px solid rgba(44,24,16,.075);
  border-radius:20px;
  box-shadow:0 8px 22px rgba(44,24,16,.045);
  transition:transform .25s,box-shadow .25s;
}
.mood-row::before{
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
.mood-row:hover{
  transform:translateY(-3px);
  box-shadow:0 12px 28px rgba(44,24,16,.075);
}
.mood-row:hover::before{
  opacity:1;
  animation:greenBorderTrace 1.25s linear infinite;
}
.mood-row-number{
  align-self:start;
  display:grid;
  place-items:center;
  width:34px;
  height:34px;
  margin-top:.15rem;
  border-radius:50%;
  background:#fff3d4;
  color:var(--brown);
  font-size:.62rem;
  font-weight:800;
}
.mood-image-wrapper{
  position:relative;
  height:136px;
  overflow:hidden;
  border-radius:15px;
  background:linear-gradient(145deg,#efe6d2,#f8f3e8);
  padding:.35rem;
}
.mood-image{
  width:100%;
  height:100%;
  object-fit:contain;
  object-position:center;
  border-radius:11px;
  background:#e9e2d4;
  display:block;
}
.mood-content{
  min-width:0;
  padding:.15rem .15rem .15rem .2rem;
}
.mood-film{
  display:inline-flex;
  align-items:center;
  padding:.28rem .5rem;
  margin-bottom:.55rem;
  border-radius:999px;
  background:#fff3d4;
  color:rgba(44,24,16,.72);
  font-size:.58rem;
  font-weight:700;
}
.mood-content h3{
  margin:0 0 .35rem;
  font-size:1.05rem;
}
.mood-content p{
  margin:0;
  color:rgba(44,24,16,.64);
  font-family:'Caveat',cursive;
  font-size:1rem;
  line-height:1.25;
}

/* FINAL CTA */
.final-cta-section{
  position:relative;
  background:linear-gradient(135deg,#f0ddb5 0%,#f8ebcb 52%,#ead2a2 100%);
  padding:3.2rem 1rem 3.45rem;
  border-top:1px solid rgba(44,24,16,.08);
}
.final-cta-section::before{
  content:'';
  position:absolute;
  top:0;
  left:50%;
  width:72px;
  height:3px;
  border-radius:999px;
  background:linear-gradient(90deg,transparent,var(--green),transparent);
  transform:translateX(-50%);
  opacity:.7;
}
.final-cta-card{
  position:relative;
  max-width:820px;
  margin:auto;
  padding:0;
  text-align:center;
  color:var(--brown);
}
.final-cta-note{
  display:inline-block;
  margin-bottom:.25rem;
  font-family:'Caveat',cursive;
  font-size:1.15rem;
  color:rgba(90,58,45,.82);
  transform:rotate(-1.5deg);
}
.final-cta-card h2{
  margin:0 0 .5rem;
  font-size:clamp(1.65rem,3vw,2.2rem);
  line-height:1.12;
  font-weight:800;
}
.final-cta-card p{
  max-width:590px;
  margin:0 auto 1.25rem;
  color:rgba(44,24,16,.62);
  font-size:.84rem;
  line-height:1.55;
}
.final-cta-button{
  display:inline-flex;
  align-items:center;
  gap:.65rem;
  border:0;
  border-radius:999px;
  padding:.7rem .85rem .7rem 1.1rem;
  background:var(--brown);
  color:#fff8e9;
  font:inherit;
  font-size:.8rem;
  font-weight:800;
  cursor:pointer;
  box-shadow:0 8px 18px rgba(44,24,16,.12);
  transition:transform .25s,box-shadow .25s,background .25s;
}
.final-cta-button:hover{
  transform:translateY(-2px);
  background:#3b2016;
  box-shadow:0 11px 22px rgba(44,24,16,.16);
}
.final-cta-button span:last-child{
  display:grid;
  place-items:center;
  width:22px;
  height:22px;
  border-radius:50%;
  background:#f4e4bc;
  color:var(--brown);
}

/* RESPONSIVE */
@media(max-width:1024px){
  .hero-section{background-attachment:scroll}
  .concept-flow{max-width:calc(100% - 1rem)}
  .preview-stage{
    max-width:calc(100% - 1rem);
    grid-template-columns:.75fr 1fr .88fr;
    padding:1.6rem;
    gap:1rem;
  }
  .mood-list{max-width:calc(100% - 1rem)}
}

@media(max-width:860px){
  .concept-section,.app-preview-section,.mood-section{
    padding:3rem .85rem;
  }
  .final-cta-section{
    padding:2.8rem .9rem 3rem;
  }
  .section-header{margin-bottom:1.8rem}
  .section-title{font-size:clamp(1.5rem,7vw,1.95rem)}
  .section-subtitle{font-size:.84rem}

  .concept-flow{
    max-width:520px;
    padding-left:14px;
  }
  .concept-flow::before{
    left:38px;
    transform:none;
  }
  .concept-step{
    display:grid;
    grid-template-columns:56px 1fr;
    min-height:112px;
  }
  .concept-step:nth-child(odd) .concept-step-content,
  .concept-step:nth-child(even) .concept-step-content{
    grid-column:2;
    grid-row:1;
    text-align:left;
    padding:.85rem .95rem;
    margin:0 0 0 .8rem;
  }
  .concept-marker{
    grid-column:1;
    grid-row:1;
    width:44px;
    height:44px;
    margin:0;
  }
  .concept-step:nth-child(odd) p{
    margin-left:0;
  }
  .concept-step p{
    max-width:360px;
    font-size:.74rem;
  }

  .preview-stage{
    display:flex;
    flex-direction:column;
    max-width:680px;
    padding:1.35rem 1rem;
    gap:1.05rem;
    background:rgba(255,250,242,.52);
    box-shadow:inset 0 0 0 1px rgba(255,255,255,.42);
  }
  .preview-quote-card{
    width:150px;
    margin:0 auto;
    justify-self:center;
  }
  .preview-side{
    max-width:380px;
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

  .mood-list{
    max-width:680px;
    gap:.75rem;
  }
  .mood-row{
    grid-template-columns:42px 170px 1fr;
    gap:.7rem;
    min-height:132px;
    padding:.65rem .75rem .65rem .6rem;
    border-radius:17px;
  }
  .mood-row-number{
    width:30px;
    height:30px;
    font-size:.56rem;
  }
  .mood-image-wrapper{
    height:112px;
    padding:.3rem;
  }
  .mood-content h3{font-size:.92rem}
  .mood-content p{font-size:.9rem}
  .mood-film{font-size:.52rem;margin-bottom:.4rem}
}

@media(max-width:600px){
  .concept-section,.app-preview-section,.mood-section{
    padding:2.7rem .75rem;
  }

  .concept-flow{
    max-width:100%;
    padding-left:2px;
    display:flex;
    flex-direction:column;
    gap:.55rem;
  }
  .concept-flow::before{
    left:22px;
  }
  .concept-step{
    grid-template-columns:44px 1fr;
    min-height:122px;
    align-items:flex-start;
  }
  .concept-marker{
    width:38px;
    height:38px;
    margin-top:10px;
  }
  .concept-marker span{
    font-size:.95rem;
  }
  .concept-step:nth-child(odd) .concept-step-content,
  .concept-step:nth-child(even) .concept-step-content{
    margin-left:.7rem;
    padding:1rem 1rem;
    border-radius:18px;
  }
  .concept-step h3{
    font-size:1rem;
    margin-bottom:.35rem;
  }
  .concept-step p{
    max-width:none;
    font-size:.8rem;
    line-height:1.5;
  }

  .mood-list{
    max-width:100%;
  }
  .mood-row{
    grid-template-columns:1fr;
    gap:.6rem;
    padding:.75rem;
  }
  .mood-row-number{
    position:absolute;
    z-index:2;
    top:12px;
    right:12px;
    margin:0;
    background:rgba(255,250,240,.94);
  }
  .mood-image-wrapper{
    width:100%;
    height:190px;
  }
  .mood-content{
    padding:.25rem .2rem .35rem;
  }
  .mood-content h3{
    font-size:1rem;
  }
  .mood-content p{
    font-size:.96rem;
  }

  .preview-stage{
    width:100%;
    max-width:100%;
    padding:.8rem .15rem;
    border-radius:0;
    background:transparent;
    box-shadow:none;
  }
  .preview-side{
    max-width:100%;
  }
  .preview-benefits{
    grid-template-columns:1fr;
  }
  .preview-benefit:last-child{
    grid-column:auto;
    width:100%;
    justify-self:stretch;
  }

  .final-cta-section{
    padding:2.65rem .85rem 2.9rem;
  }
  .final-cta-card h2{
    font-size:clamp(1.55rem,8vw,1.95rem);
  }
  .final-cta-card p{
    max-width:440px;
    font-size:.81rem;
    line-height:1.5;
  }
  .final-cta-button{
    font-size:.77rem;
  }
}

@media(max-width:420px){
  .final-cta-note{font-size:1.05rem}
  .final-cta-card p{font-size:.8rem}
  .final-cta-button{font-size:.76rem}

  .concept-flow,.mood-list,.preview-stage{max-width:100%}
  .mood-row{
    grid-template-columns:1fr;
    gap:.55rem;
    padding:.7rem;
  }
  .mood-row-number{
    position:absolute;
    z-index:2;
    top:10px;
    right:10px;
    margin:0;
    background:rgba(255,250,240,.92);
  }
  .mood-image-wrapper{
    height:165px;
    width:100%;
  }
  .mood-content{padding:.2rem .15rem .25rem}
  .mood-film{margin-bottom:.35rem}
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