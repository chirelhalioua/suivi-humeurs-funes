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
      <div class="preview-poster">
        <div class="poster-heading">
          <span class="project-pill"><i></i> PROJET</span>
          <h2><span>Les humeurs</span><strong>à la Funès</strong></h2>
          <p>Une application ludique pour suivre tes humeurs et prendre soin de toi, avec humour !</p>
        </div>

        <p class="poster-note note-left">Des émotions<br>au quotidien…</p>
        <p class="poster-note note-right">Et aujourd’hui,<br>quelle est ton<br>humeur ? <span>↙</span></p>

        <div class="poster-left">
          <div class="color-portrait">
            <img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/RabbiJacob-couleur.png" alt="Louis de Funès dans Rabbi Jacob" />
          </div>
          <div class="poster-quote">
            <span class="quote-mark">“</span>
            <p>Une humeur, une expression… avec une bonne dose d’humour.</p>
            <small>Louis de Funès</small>
          </div>
        </div>

        <div class="poster-phone-wrap">
          <div class="poster-phone">
            <div class="poster-notch"></div>
            <div class="poster-screen">
              <div class="poster-nav">
                <b>Les Humeurs à la Funès</b>
                <span>🌙 &nbsp; ☰</span>
              </div>
              <div class="poster-body">
                <h3>Bonjour ! 👋</h3>
                <p class="poster-question">Alors, quelle est ton humeur aujourd’hui ?</p>

                <div class="poster-mood-card">
                  <div class="poster-movie-image">
                    <img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Louis_de_Fun%C3%A8s_%E2%80%94_Le_Gendarme_et_les_Extra-terrestres.jpg" alt="Louis de Funès dans Le Gendarme et les Extra-terrestres" />
                    <span class="image-spark spark-one"></span>
                    <span class="image-spark spark-two"></span>
                  </div>
                  <p class="poster-caption">« Une humeur, une expression… »</p>
                  <div class="poster-emojis">
                    <span>🤩<small>Génial</small></span>
                    <span>😌<small>Bien</small></span>
                    <span>😐<small>Moyen</small></span>
                    <span>😢<small>Pas top</small></span>
                    <span>😡<small>Nul</small></span>
                  </div>
                  <div class="poster-save">Enregistrer mon humeur</div>
                </div>

                <div class="poster-track">
                  <h4>📊 Mon suivi</h4>
                  <div class="poster-tabs"><b>Semaine</b><span>Mois</span><span>Année</span></div>
                  <div class="poster-bars"><i></i><i></i><i></i><i></i><i></i></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="poster-benefits">
          <div class="benefit-card"><span>📊</span><b>Suivi de tes humeurs</b></div>
          <div class="benefit-card"><span>💛</span><b>Conseils bien-être</b></div>
          <div class="benefit-card"><span>🙂</span><b>Une dose d’humour au quotidien</b></div>
          <p class="poster-note benefit-note">… avec une touche<br>de bonne humeur ! ♡</p>
        </div>

        <div class="poster-footer">
          <button class="poster-cta" @click="goToRegister">Voir le projet <span>→</span></button>
          <div class="tech-pills">
            <span>Nuxt</span><span>MongoDB</span><span>Express</span><span>Tailwind CSS</span>
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
.concept-section,.mood-section{padding:clamp(4.5rem,8vw,7rem) 1rem}
.concept-section{background:linear-gradient(180deg,#fffaf0,#f8edcf)}
.mood-section{background:#fff}
.section-header{text-align:center;max-width:720px;margin:0 auto clamp(2.4rem,5vw,4rem)}
.section-kicker{color:var(--brown-soft);background:rgba(255,255,255,.72);border:1px solid rgba(44,24,16,.08);margin-bottom:.9rem}
.section-title{font-size:clamp(2rem,4vw,3.15rem);line-height:1.1;margin:0 0 .8rem;font-weight:800}
.section-subtitle{color:rgba(44,24,16,.66)}

/* CONCEPT */
.concept-grid,.mood-grid{max-width:1180px;margin:auto;display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}
.concept-card{position:relative;min-height:245px;padding:1.5rem;border-radius:26px;background:rgba(255,255,255,.8);border:1px solid rgba(44,24,16,.09);box-shadow:0 12px 35px rgba(44,24,16,.06);transition:transform .25s,box-shadow .25s}
.concept-card::before,.benefit-card::before{content:'';position:absolute;inset:0;padding:2px;box-sizing:border-box;border-radius:inherit;background:conic-gradient(from var(--border-angle),transparent 0 62%,var(--green) 72%,#a8c99b 82%,transparent 92%);opacity:0;pointer-events:none;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
.concept-card:hover{transform:translateY(-5px) scale(1.015);box-shadow:0 16px 38px rgba(44,24,16,.09)}
.concept-card:hover::before,.benefit-card:hover::before{opacity:1;animation:greenBorderTrace 1.25s linear infinite}
.concept-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem}
.concept-icon{display:grid;place-items:center;width:52px;height:52px;border-radius:17px;background:#fff3d4;font-size:1.55rem}
.concept-number{font-size:2rem;font-weight:800;color:rgba(44,24,16,.1)}
.concept-card h3{font-size:1.15rem;margin-bottom:.65rem}
.concept-card p{color:rgba(44,24,16,.66);line-height:1.65;font-size:.94rem}

/* APP PREVIEW — inspired by the reference poster */
.app-preview-section{padding:clamp(4rem,7vw,6.5rem) 1rem;background:#fffaf0;overflow:hidden}
.preview-poster{position:relative;max-width:1120px;min-height:760px;margin:auto;padding:2.3rem 2.4rem 2rem;border:1px solid rgba(44,24,16,.07);border-radius:38px;background:
  radial-gradient(circle at 6% 38%,rgba(246,190,53,.15) 0 12%,transparent 12.5%),
  radial-gradient(circle at 92% 7%,rgba(246,190,53,.14) 0 17%,transparent 17.5%),
  radial-gradient(circle at 96% 92%,rgba(246,190,53,.12) 0 17%,transparent 17.5%),
  #fffdf8;
box-shadow:0 24px 60px rgba(67,42,18,.08);display:grid;grid-template-columns:1fr 1.18fr .95fr;grid-template-rows:auto 1fr auto;gap:1rem 1.6rem;align-items:center}
.poster-heading{grid-column:1/-1;text-align:center;z-index:3}
.project-pill{display:inline-flex;align-items:center;gap:.65rem;padding:.5rem 1rem;border-radius:999px;background:#fff;border:1px solid rgba(233,185,73,.35);box-shadow:0 8px 22px rgba(78,48,20,.07);font-size:.69rem;font-weight:800;letter-spacing:.22em}
.project-pill i{width:13px;height:13px;border-radius:50%;background:#f6b72d}
.poster-heading h2{margin:1.1rem 0 .8rem;font-size:clamp(2.6rem,6vw,5.4rem);line-height:.86;letter-spacing:-.045em}
.poster-heading h2 span,.poster-heading h2 strong{display:block}
.poster-heading h2 strong{color:#f1b42b;font-weight:800}
.poster-heading p{max-width:620px;margin:auto;color:#4f4643;font-size:clamp(.96rem,1.7vw,1.18rem);line-height:1.55}
.poster-note{position:absolute;z-index:4;font-family:'Caveat',cursive;font-weight:600;color:#241516;line-height:1.03}
.note-left{left:3.4%;top:43%;font-size:1.5rem;transform:rotate(-8deg)}
.note-right{right:4.6%;top:11%;font-size:1.45rem;transform:rotate(-7deg);text-align:center}
.note-right span{display:block;font-family:'Sora',sans-serif;font-size:1.8rem;margin-top:.3rem}

.poster-left{position:relative;align-self:end;min-height:360px;display:flex;align-items:flex-end;justify-content:center}
.color-portrait{position:relative;width:220px;height:285px;border-radius:28px;overflow:hidden;border:7px solid #fff;box-shadow:0 18px 38px rgba(44,24,16,.16);transform:rotate(-4deg);background:#f5ead3}
.color-portrait:before{content:'';position:absolute;inset:0;border:1px solid rgba(44,24,16,.08);border-radius:21px;z-index:2;pointer-events:none}
.color-portrait img{width:100%;height:100%;display:block;object-fit:cover;object-position:center 24%}
.poster-quote{position:absolute;z-index:5;left:4%;bottom:-10px;width:220px;padding:1rem 1.1rem;border-radius:20px;background:linear-gradient(145deg,#2d160f,#482317);color:#fff7e8;box-shadow:0 16px 30px rgba(44,24,16,.22);transform:rotate(-3deg)}
.quote-mark{position:absolute;right:13px;top:6px;font-size:2.5rem;opacity:.7}
.poster-quote p{font-family:'Caveat',cursive;font-size:1.13rem;line-height:1.12;margin:.2rem 0 .55rem}
.poster-quote small{opacity:.78;font-size:.68rem}

.poster-phone-wrap{position:relative;z-index:3;display:flex;justify-content:center;align-self:end}
.poster-phone{position:relative;width:330px;height:600px;border:9px solid #141111;border-radius:49px;background:#111;padding:7px;box-shadow:0 28px 58px rgba(44,24,16,.24);transform:rotate(-2.2deg)}
.poster-notch{position:absolute;z-index:5;top:7px;left:50%;transform:translateX(-50%);width:112px;height:24px;border-radius:0 0 17px 17px;background:#111}
.poster-screen{height:100%;border-radius:34px;overflow:hidden;background:#fffaf2}
.poster-nav{height:62px;background:#3b1b10;color:#fff6de;display:flex;justify-content:space-between;align-items:flex-end;padding:0 17px 12px;font-size:.78rem}
.poster-body{padding:19px 15px;color:#2d2020}
.poster-body h3{font-size:1.03rem;margin:0}
.poster-question{font-size:.7rem;margin:.18rem 0 .8rem}
.poster-mood-card,.poster-track{background:#fff;border:1px solid #eee5d8;border-radius:20px;padding:11px;box-shadow:0 7px 18px rgba(44,24,16,.055)}
.poster-movie-image{position:relative;height:155px;border-radius:16px;overflow:hidden;background:#f7e6a8}
.poster-movie-image img{width:100%;height:100%;display:block;object-fit:cover;object-position:center 28%;filter:saturate(1.05) contrast(1.02)}
.poster-movie-image:after{content:'';position:absolute;inset:auto 0 0;height:35%;background:linear-gradient(transparent,rgba(53,27,14,.18))}
.image-spark{position:absolute;width:2px;height:22px;background:#361c13;right:17px;top:14px;transform:rotate(20deg)}
.spark-two{right:6px;top:29px;transform:rotate(65deg);height:17px}
.poster-caption{text-align:center;font-family:'Caveat',cursive;font-size:.84rem;margin:.42rem 0}
.poster-emojis{display:grid;grid-template-columns:repeat(5,1fr);gap:4px}
.poster-emojis span{display:flex;flex-direction:column;align-items:center;padding:5px 1px;background:#fff9e9;border:1px solid rgba(233,185,73,.18);border-radius:10px;font-size:1rem}
.poster-emojis small{font-size:.43rem;margin-top:2px}
.poster-save{margin-top:9px;padding:8px;border-radius:999px;text-align:center;background:linear-gradient(90deg,#f4ad20,#ffd15d);font-size:.65rem;font-weight:800}
.poster-track{margin-top:10px}
.poster-track h4{margin:0 0 7px;font-size:.86rem}
.poster-tabs{display:flex;background:#f4efe8;border-radius:999px;font-size:.5rem}
.poster-tabs>*{flex:1;text-align:center;padding:6px}
.poster-tabs b{background:var(--brown);color:#fff;border-radius:999px}
.poster-bars{height:72px;display:flex;align-items:flex-end;justify-content:space-around;padding-top:8px}
.poster-bars i{width:15px;border-radius:5px 5px 2px 2px;background:#f2bd45}
.poster-bars i:nth-child(1){height:28%}.poster-bars i:nth-child(2){height:62%;background:#91b97f}.poster-bars i:nth-child(3){height:43%;background:#b99bd4}.poster-bars i:nth-child(4){height:78%;background:#75c8c2}.poster-bars i:nth-child(5){height:53%}

.poster-benefits{align-self:center;display:flex;flex-direction:column;gap:1rem}
.benefit-card{position:relative;display:flex;align-items:center;gap:.9rem;padding:1rem 1.05rem;border-radius:22px;background:#fff;border:1px solid rgba(44,24,16,.07);box-shadow:0 10px 26px rgba(44,24,16,.06);font-size:.83rem;transition:transform .25s,box-shadow .25s}
.benefit-card:hover{transform:translateY(-3px) scale(1.015);box-shadow:0 14px 30px rgba(44,24,16,.09)}
.benefit-card>span{display:grid;place-items:center;width:46px;height:46px;flex:none;border-radius:50%;background:#fff0bd;font-size:1.25rem}
.benefit-note{position:static!important;font-size:1.4rem!important;text-align:center;transform:rotate(-5deg);margin:.8rem 0 0}

.poster-footer{grid-column:1/-1;text-align:center;z-index:5}
.poster-cta{border:0;border-radius:999px;background:linear-gradient(90deg,#2d160f,#492217);color:white;padding:.9rem 2rem;font:inherit;font-weight:700;cursor:pointer;box-shadow:0 12px 28px rgba(44,24,16,.18)}
.poster-cta span{margin-left:.7rem}
.tech-pills{display:flex;justify-content:center;gap:.55rem;flex-wrap:wrap;margin-top:1rem}
.tech-pills span{padding:.5rem .9rem;border-radius:999px;background:#fff;border:1px solid rgba(44,24,16,.08);font-size:.75rem;box-shadow:0 5px 14px rgba(44,24,16,.04)}
.tech-pills span:nth-child(1),.tech-pills span:nth-child(2){color:#397e4c;background:#f5fbf4}

/* MOOD CARDS */
.mood-card{background:#fffdf8;border:1px solid rgba(44,24,16,.1);border-radius:22px;overflow:hidden;box-shadow:0 10px 26px rgba(44,24,16,.07);transition:.25s}
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
  .preview-poster{grid-template-columns:.8fr 1.25fr;min-height:unset;padding:2rem;gap:1.2rem}
  .poster-heading{grid-column:1/-1}
  .poster-left{grid-column:1}
  .poster-phone-wrap{grid-column:2;grid-row:2}
  .poster-benefits{grid-column:1/-1;display:grid;grid-template-columns:repeat(3,1fr)}
  .benefit-note{display:none}
  .poster-footer{grid-column:1/-1}
  .note-right{right:3%;top:13%;font-size:1.2rem}
  .note-left{display:none}
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

  .preview-poster{display:flex;flex-direction:column;min-height:unset;padding:1.35rem .8rem 1.4rem;border-radius:28px;gap:1.2rem}
  .poster-heading h2{font-size:clamp(2.5rem,15vw,4rem);margin:.9rem 0 .7rem}
  .poster-heading p{font-size:.82rem;max-width:310px}
  .project-pill{font-size:.6rem;padding:.42rem .75rem}
  .project-pill i{width:11px;height:11px}
  .note-right{position:static;font-size:1.15rem;transform:rotate(-4deg);order:2;margin:.15rem 0 -.3rem}
  .note-right span{font-size:1.4rem}
  .poster-phone-wrap{order:3;width:100%}
  .poster-phone{width:245px;height:460px;border-width:7px;border-radius:39px}
  .poster-notch{width:82px;height:18px}
  .poster-screen{border-radius:28px}
  .poster-nav{height:50px;padding:0 11px 9px;font-size:.58rem}
  .poster-body{padding:12px 10px}
  .poster-body h3{font-size:.8rem}
  .poster-question{font-size:.53rem;margin-bottom:.55rem}
  .poster-movie-image{height:108px}
  .poster-caption{font-size:.67rem;margin:.3rem 0}
  .poster-emojis span{font-size:.82rem;padding:4px 1px}
  .poster-emojis small{font-size:.34rem}
  .poster-save{padding:6px;font-size:.48rem;margin-top:6px}
  .poster-track{margin-top:7px;padding:8px}
  .poster-track h4{font-size:.65rem;margin-bottom:5px}
  .poster-tabs{font-size:.38rem}
  .poster-tabs>*{padding:4px}
  .poster-bars{height:45px}
  .poster-bars i{width:10px}

  .poster-left{order:4;min-height:240px;width:100%;align-self:auto}
  .color-portrait{width:165px;height:210px;border-width:5px}
  .poster-quote{width:170px;left:calc(50% - 118px);bottom:-6px;padding:.75rem .85rem}
  .poster-quote p{font-size:.92rem}
  .poster-benefits{order:5;width:100%;display:grid;grid-template-columns:1fr 1fr;gap:.6rem}
  .benefit-card{padding:.7rem;border-radius:16px;font-size:.67rem;text-align:left}
  .benefit-card:last-of-type{grid-column:1/-1;justify-self:center;width:calc(50% - .3rem)}
  .benefit-card>span{width:34px;height:34px;font-size:.95rem}
  .poster-footer{order:6}
  .poster-cta{padding:.75rem 1.45rem;font-size:.82rem}
  .tech-pills{gap:.4rem;margin-top:.8rem}
  .tech-pills span{font-size:.62rem;padding:.4rem .65rem}
  .note-left{display:none}

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
  .poster-phone{width:225px;height:430px}
  .poster-left{min-height:220px}
  .color-portrait{width:150px;height:195px}
  .poster-quote{width:155px;left:calc(50% - 108px)}
  .poster-benefits{grid-template-columns:1fr}
  .benefit-card:last-of-type{grid-column:auto;width:100%;justify-self:stretch}
  .mood-card{flex-basis:60%;min-width:175px}
}

@property --border-angle{syntax:'<angle>';inherits:false;initial-value:0deg}
@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
@keyframes scrollWheel{0%{opacity:0;transform:translateY(0)}40%{opacity:1}100%{opacity:0;transform:translateY(10px)}}
@keyframes greenBorderTrace{to{--border-angle:360deg}}
</style>