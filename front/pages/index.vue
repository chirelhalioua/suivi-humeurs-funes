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
      <div class="section-header">
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
        <span class="section-kicker">UN APERÇU</span>
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
                    <img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/RabbiJacob-couleur.png" alt="Louis de Funès dans Rabbi Jacob" />
                  </div>

                  <p class="preview-caption">« Une humeur, une expression… »</p>

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
      <div class="section-header">
        <span class="section-kicker">UN APERÇU</span>
        <h2 class="section-title">Aperçu des Humeurs</h2>
      </div>
      <div class="mood-grid">
        <article v-for="(mood,index) in moods" :key="mood._id" class="mood-card">
          <div class="mood-image-wrapper">
            <div class="image-placeholder" v-if="!mood.imageLoaded"></div>
            <img :src="mood.image" :alt="mood.title" class="mood-image" :class="{loaded:mood.imageLoaded}" @load="mood.imageLoaded=true"/>
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

const concepts = [
  {title:'Exprimez-vous',description:'Exprimez facilement votre humeur à travers des images de Louis de Funès',icon:'🎭'},
  {title:'Suivez',description:'Suivez votre humeur de façon journalière et hebdomadaire',icon:'📊'},
  {title:'Améliorez',description:'Améliorez votre humeur grâce à des vidéos et citations',icon:'⭐'},
  {title:'Partagez',description:'Partagez votre humeur avec votre entourage',icon:'🤝'}
]

const moods = ref([
  {_id:'local-joyeux',title:'Joyeux',subtitle:'Aujourd’hui, tout me fait sourire !',film:'L’Homme orchestre · 1970',image:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Louis_de_Fun%C3%A8s_%E2%80%94_L%27Homme_orchestre_%281970%29.jpg',imageLoaded:false},
  {_id:'local-enerve',title:'Énervé',subtitle:'Il ne faudrait pas trop me chercher aujourd’hui…',film:'L’Homme orchestre · 1970',image:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Louis_de_Fun%C3%A8s_2_%E2%80%94_L%27Homme_orchestre_%281970%29.jpg',imageLoaded:false},
  {_id:'local-surpris',title:'Surpris',subtitle:'Alors ça, je ne l’avais vraiment pas vu venir !',film:'L’Homme orchestre · 1970',image:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Louis_de_Fun%C3%A8s_3_%E2%80%94_L%27Homme_orchestre_%281970%29.jpg',imageLoaded:false},
  {_id:'local-fatigue',title:'Fatigué',subtitle:'Aujourd’hui, je tourne clairement au ralenti.',film:'L’Homme orchestre · 1970',image:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Louis_de_Fun%C3%A8s_4_%E2%80%94_L%27Homme_orchestre_%281970%29.jpg',imageLoaded:false}
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
.hero-section{position:relative;min-height:calc(100vh - 64px);display:flex;align-items:center;justify-content:center;padding:3rem 1.25rem;background-image:url('/background.jpg');background-size:cover;background-position:center;background-attachment:fixed;color:white;overflow:hidden}
.hero-section:before{content:'';position:absolute;inset:0;background:linear-gradient(110deg,rgba(25,12,7,.78),rgba(44,24,16,.58),rgba(25,12,7,.72))}
.hero-section:after{content:'';position:absolute;width:420px;height:420px;border-radius:50%;border:1px solid rgba(244,228,188,.18);right:-170px;top:-150px;box-shadow:0 0 0 55px rgba(244,228,188,.035)}
.hero-content{position:relative;z-index:2;text-align:center;max-width:850px;width:100%}
.hero-badge,.section-kicker{display:inline-flex;align-items:center;padding:.48rem 1rem;border-radius:999px;font-size:.72rem;font-weight:800;letter-spacing:.2em}
.hero-badge{color:var(--cream);background:rgba(244,228,188,.12);border:1px solid rgba(244,228,188,.24);backdrop-filter:blur(8px);margin-bottom:1.4rem}
.hero-title{font-size:clamp(2.4rem,6vw,4.8rem);line-height:1.04;font-weight:800;max-width:820px;margin:0 auto .35rem}
.handwritten-note{font-family:'Caveat',cursive;font-size:clamp(1.15rem,2.2vw,1.55rem);font-weight:500;color:rgba(255,255,255,.92);margin:.35rem auto 1.25rem;transform:rotate(-1deg);width:max-content;max-width:100%}
.hero-description{font-size:clamp(1rem,2vw,1.25rem);line-height:1.7;max-width:640px;margin:0 auto 2rem;color:rgba(255,255,255,.88)}
.cta-button{display:inline-flex;align-items:center;gap:.9rem;padding:.95rem 1.45rem;border:0;border-radius:999px;background:var(--cream);color:var(--brown);font:inherit;font-weight:800;cursor:pointer;box-shadow:0 12px 30px rgba(0,0,0,.18);transition:.25s}
.cta-button:hover{transform:translateY(-3px);background:#fff3d2}
.button-icon{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--brown);color:var(--cream)}
.scroll-indicator{position:absolute;z-index:2;bottom:25px;left:50%;transform:translateX(-50%)}
.mouse{width:24px;height:38px;border:1.5px solid rgba(255,255,255,.6);border-radius:15px;display:flex;justify-content:center;padding-top:7px}
.wheel{width:3px;height:7px;background:white;border-radius:3px;animation:scrollWheel 1.5s infinite}

/* COMMON SECTIONS */
.concept-section,.mood-section{padding:clamp(4.25rem,7vw,6rem) 1rem}
.concept-section{background:linear-gradient(180deg,#fffaf0 0%,#f8edcf 100%)}
.mood-section{background:linear-gradient(180deg,#fffaf0 0%,#fff 100%)}
.section-header{text-align:center;max-width:720px;margin:0 auto clamp(2.2rem,4.5vw,3.4rem)}
.section-kicker{color:var(--brown-soft);background:rgba(255,255,255,.72);border:1px solid rgba(44,24,16,.08);margin-bottom:.9rem}
.section-title{font-size:clamp(2rem,4vw,3.15rem);line-height:1.1;margin:0 0 .8rem;font-weight:800}
.section-subtitle{color:rgba(44,24,16,.66);line-height:1.6}.preview-section-header{margin-bottom:2.4rem}

/* CONCEPT */
.concept-grid,.mood-grid{max-width:1180px;margin:auto;display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}
.concept-card{position:relative;min-height:215px;padding:1.35rem;border-radius:22px;background:rgba(255,255,255,.88);border:1px solid rgba(44,24,16,.08);box-shadow:0 10px 28px rgba(44,24,16,.05);transition:transform .25s,box-shadow .25s}
.concept-card::before,.preview-benefit::before{content:'';position:absolute;inset:0;padding:2px;box-sizing:border-box;border-radius:inherit;background:conic-gradient(from var(--border-angle),transparent 0 62%,var(--green) 72%,#a8c99b 82%,transparent 92%);opacity:0;pointer-events:none;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
.concept-card:hover{transform:translateY(-5px) scale(1.015);box-shadow:0 16px 38px rgba(44,24,16,.09)}
.concept-card:hover::before,.preview-benefit:hover::before{opacity:1;animation:greenBorderTrace 1.25s linear infinite}
.concept-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.45rem}
.concept-icon{display:grid;place-items:center;width:52px;height:52px;border-radius:17px;background:#fff3d4;font-size:1.55rem}
.concept-number{font-size:2rem;font-weight:800;color:rgba(44,24,16,.1)}
.concept-card h3{font-size:1.15rem;margin-bottom:.65rem}
.concept-card p{color:rgba(44,24,16,.66);line-height:1.65;font-size:.94rem}

/* APP PREVIEW */
.app-preview-section{padding:clamp(4.25rem,7vw,6rem) 1rem;background:#f7edcf;overflow:hidden}
.preview-stage{position:relative;max-width:1080px;min-height:560px;margin:auto;padding:2rem;border:1px solid rgba(44,24,16,.075);border-radius:30px;background:
  radial-gradient(circle at 5% 18%,rgba(246,190,53,.11) 0 12%,transparent 12.5%),
  radial-gradient(circle at 97% 84%,rgba(120,152,106,.08) 0 16%,transparent 16.5%),
  #fffaf2;box-shadow:0 18px 46px rgba(67,42,18,.065);display:grid;grid-template-columns:.72fr 1.08fr .82fr;align-items:center;gap:1.35rem}
.preview-quote-card{position:relative;align-self:center;justify-self:center;width:170px;margin:0;padding:.72rem .8rem;border-radius:16px;background:linear-gradient(145deg,#2d160f,#482317);color:#fff7e8;box-shadow:0 10px 22px rgba(44,24,16,.16);transform:rotate(-2deg)}
.preview-quote-card .quote-mark{position:absolute;right:10px;top:2px;font-size:2rem;opacity:.58}
.preview-quote-card p{font-family:'Caveat',cursive;font-size:.94rem;line-height:1.14;margin:.1rem 1rem .45rem 0}
.preview-quote-card small{font-size:.58rem;opacity:.78}
.preview-phone-wrap{display:flex;justify-content:center;align-items:center}
.preview-phone{position:relative;width:300px;height:545px;border:8px solid #141111;border-radius:44px;background:#111;padding:6px;box-shadow:0 24px 48px rgba(44,24,16,.2);transform:rotate(-1.5deg)}
.preview-notch{position:absolute;z-index:5;top:6px;left:50%;transform:translateX(-50%);width:98px;height:22px;border-radius:0 0 16px 16px;background:#111}
.preview-screen{height:100%;border-radius:31px;overflow:hidden;background:#fffaf2}
.preview-nav{height:57px;background:#3b1b10;color:#fff6de;display:flex;justify-content:space-between;align-items:flex-end;padding:0 15px 11px;font-size:.7rem}
.preview-body{padding:15px 13px;color:#2d2020}
.preview-body h3{font-size:1.02rem;margin:0}
.preview-question{font-size:.7rem;margin:.18rem 0 .75rem}
.preview-mood-card,.preview-track{background:#fff;border:1px solid #eee5d8;border-radius:20px;padding:11px;box-shadow:0 7px 18px rgba(44,24,16,.055)}
.preview-movie-image{height:142px;border-radius:14px;overflow:hidden;background:#f3e6c5}
.preview-movie-image img{width:100%;height:100%;display:block;object-fit:cover;object-position:center 18%;filter:saturate(1.05) contrast(1.02)}
.preview-caption{text-align:center;font-family:'Caveat',cursive;font-size:.84rem;margin:.42rem 0}
.preview-emojis{display:grid;grid-template-columns:repeat(5,1fr);gap:4px}
.preview-emojis span{display:flex;flex-direction:column;align-items:center;padding:5px 1px;background:#fff9e9;border:1px solid rgba(233,185,73,.18);border-radius:10px;font-size:1rem}
.preview-emojis small{font-size:.43rem;margin-top:2px}
.preview-save{margin-top:9px;padding:8px;border-radius:999px;text-align:center;background:linear-gradient(90deg,#f4ad20,#ffd15d);font-size:.65rem;font-weight:800}
.preview-track{margin-top:10px}
.preview-track h4{margin:0 0 7px;font-size:.86rem}
.preview-tabs{display:flex;background:#f4efe8;border-radius:999px;font-size:.5rem}
.preview-tabs>*{flex:1;text-align:center;padding:6px}
.preview-tabs b{background:var(--brown);color:#fff;border-radius:999px}
.preview-bars{height:56px;display:flex;align-items:flex-end;justify-content:space-around;padding-top:7px}
.preview-bars i{width:15px;border-radius:5px 5px 2px 2px;background:#f2bd45}
.preview-bars i:nth-child(1){height:28%}.preview-bars i:nth-child(2){height:62%;background:#91b97f}.preview-bars i:nth-child(3){height:43%;background:#b99bd4}.preview-bars i:nth-child(4){height:78%;background:#75c8c2}.preview-bars i:nth-child(5){height:53%}
.preview-side{align-self:stretch;display:flex;flex-direction:column;justify-content:center;gap:1rem}
.preview-handwritten{font-family:'Caveat',cursive;font-size:1.42rem;line-height:1.05;text-align:center;transform:rotate(-4deg);margin:0 0 .35rem}
.preview-handwritten span{display:block;font-family:'Sora',sans-serif;font-size:1.8rem;margin-top:.35rem}
.preview-benefits{display:flex;flex-direction:column;gap:.85rem}
.preview-benefit{position:relative;display:flex;align-items:center;gap:.75rem;background:#fff;border:1px solid rgba(44,24,16,.07);border-radius:17px;padding:.78rem;box-shadow:0 7px 18px rgba(44,24,16,.045);font-size:.75rem;transition:transform .25s,box-shadow .25s}
.preview-benefit:hover{transform:translateY(-3px) scale(1.015);box-shadow:0 11px 24px rgba(44,24,16,.08)}
.preview-benefit>span{display:grid;place-items:center;width:39px;height:39px;flex:none;background:#fff1bd;border-radius:50%;font-size:1.05rem}

/* MOOD CARDS */
.mood-card{background:#fffdf8;border:1px solid rgba(44,24,16,.08);border-radius:22px;overflow:hidden;box-shadow:0 9px 24px rgba(44,24,16,.055);transition:.25s}
.mood-card:hover{transform:translateY(-5px)}
.mood-image-wrapper{position:relative;aspect-ratio:1/1;overflow:hidden;background:#eee7d7}
.image-placeholder{position:absolute;inset:0;background:#eee7d7}
.mood-image{width:100%;height:100%;object-fit:cover;opacity:0;transition:.35s}
.mood-image.loaded{opacity:1}
.mood-index{position:absolute;top:10px;right:10px;padding:.3rem .52rem;border-radius:999px;background:rgba(255,250,240,.9);font-size:.68rem;font-weight:800}
.mood-content{padding:1rem}
.mood-content h3{margin:0 0 .3rem;font-size:1rem}
.mood-content p{font-size:.8rem;line-height:1.45;color:rgba(44,24,16,.67);margin:.2rem 0 .55rem}
.mood-content small{font-size:.68rem;color:rgba(44,24,16,.5)}

/* RESPONSIVE */
@media(max-width:1024px){
  .hero-section{background-attachment:scroll}
  .concept-grid,.mood-grid{grid-template-columns:repeat(2,1fr)}
  .preview-stage{grid-template-columns:.7fr 1.1fr;min-height:unset;padding:1.8rem}
  .preview-side{grid-column:1/-1;display:grid;grid-template-columns:.55fr 1.45fr;align-items:center}
  .preview-benefits{display:grid;grid-template-columns:repeat(3,1fr)}
}

@media(max-width:650px){
  .hero-section{min-height:76vh;padding:3.5rem 1rem}
  .hero-title{font-size:clamp(2rem,9.5vw,2.9rem);line-height:1.08}
  .hero-description{font-size:.92rem;line-height:1.55;max-width:330px;margin-bottom:1.55rem}
  .handwritten-note{font-size:1.08rem;margin:.45rem auto 1rem}
  .hero-badge{font-size:.58rem;letter-spacing:.12em;padding:.42rem .75rem;margin-bottom:1rem}
  .cta-button{font-size:.88rem;padding:.78rem 1rem;gap:.65rem}
  .button-icon{width:24px;height:24px}
  .scroll-indicator{display:none}

  .concept-section,.mood-section,.app-preview-section{padding:3.4rem .85rem}
  .section-header{margin-bottom:2rem}
  .section-title{font-size:clamp(1.75rem,8vw,2.25rem)}
  .section-kicker{font-size:.58rem;letter-spacing:.12em;padding:.4rem .7rem}
  .section-subtitle{font-size:.88rem}

  .concept-grid{grid-template-columns:1fr 1fr;gap:.65rem}
  .concept-card{min-height:185px;padding:.9rem;border-radius:19px}
  .concept-top{margin-bottom:.85rem}
  .concept-icon{width:40px;height:40px;border-radius:13px;font-size:1.15rem}
  .concept-number{font-size:1.35rem}
  .concept-card h3{font-size:.9rem;margin-bottom:.4rem}
  .concept-card p{font-size:.74rem;line-height:1.45}

  .preview-stage{display:flex;flex-direction:column;min-height:unset;padding:1.35rem .85rem;border-radius:24px;gap:1rem}
  .preview-phone-wrap{order:1;width:100%}
  .preview-side{display:flex;flex-direction:column;order:2;width:100%;gap:.75rem}
  .preview-handwritten{font-size:1.12rem;order:0;margin:.15rem 0}
  .preview-handwritten span{font-size:1.3rem}

  .preview-phone{width:238px;height:445px;border-width:7px;border-radius:38px}
  .preview-notch{width:82px;height:18px}
  .preview-screen{border-radius:28px}
  .preview-nav{height:49px;padding:0 11px 9px;font-size:.58rem}
  .preview-body{padding:12px 10px}
  .preview-body h3{font-size:.8rem}
  .preview-question{font-size:.53rem;margin-bottom:.55rem}
  .preview-movie-image{height:112px}
  .preview-caption{font-size:.67rem;margin:.3rem 0}
  .preview-emojis span{font-size:.82rem;padding:4px 1px}
  .preview-emojis small{font-size:.34rem}
  .preview-save{padding:6px;font-size:.48rem;margin-top:6px}
  .preview-track{margin-top:7px;padding:8px}
  .preview-track h4{font-size:.65rem;margin-bottom:5px}
  .preview-tabs{font-size:.38rem}
  .preview-tabs>*{padding:4px}
  .preview-bars{height:44px}
  .preview-bars i{width:10px}
  .preview-quote-card{order:3;width:155px;margin:0 auto;transform:rotate(-2deg);padding:.68rem .74rem}
  .preview-quote-card p{font-size:.78rem}
  .preview-benefits{order:1;display:grid;grid-template-columns:1fr 1fr;width:100%;max-width:360px;margin:auto;gap:.6rem}
  .preview-benefit{padding:.65rem;border-radius:15px;font-size:.68rem;text-align:left}
  .preview-benefit:last-child{grid-column:1/-1;justify-self:center;width:calc(50% - .3rem)}
  .preview-benefit>span{width:32px;height:32px;font-size:.9rem}

  .mood-grid{display:flex;overflow-x:auto;gap:.7rem;margin:0 -.85rem;padding:0 .85rem 1rem;scroll-snap-type:x mandatory;scrollbar-width:none}
  .mood-grid::-webkit-scrollbar{display:none}
  .mood-card{flex:0 0 62%;max-width:225px;min-width:190px;border-radius:18px;scroll-snap-align:start}
  .mood-content{padding:.8rem}
  .mood-content h3{font-size:.9rem}
  .mood-content p{font-size:.72rem}
  .mood-content small{font-size:.6rem}
}

@media(max-width:390px){
  .hero-section{min-height:72vh}
  .hero-title{font-size:2rem}
  .concept-card{min-height:170px;padding:.8rem}
  .concept-card p{font-size:.7rem}
  .preview-phone{width:225px;height:425px}
  .preview-benefits{grid-template-columns:1fr}
  .preview-benefit:last-child{grid-column:auto;width:100%;justify-self:stretch}
  .mood-card{flex-basis:60%;min-width:175px}
}

@property --border-angle{syntax:'<angle>';inherits:false;initial-value:0deg}
@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
@keyframes scrollWheel{0%{opacity:0;transform:translateY(0)}40%{opacity:1}100%{opacity:0;transform:translateY(10px)}}
@keyframes greenBorderTrace{to{--border-angle:360deg}}
</style>