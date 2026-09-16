<template>
  <div class="home-page">
    <section class="hero-section">
      <span class="blob blob-one"></span><span class="blob blob-two"></span>
      <div class="hero-grid">
        <div class="hero-copy">
          <span class="project-pill"><i></i> PROJET</span>
          <h1>Les humeurs<br><strong>à la Funès</strong><span class="rays">✦</span></h1>
          <p class="hero-lead">Une application ludique pour suivre tes humeurs et prendre soin de toi, avec humour !</p>
          <p class="scribble left-note">Des émotions<br>au quotidien…</p>
          <div class="hero-actions">
            <button class="primary-btn" @click="goToRegister" :disabled="isNavigating">{{ isNavigating ? 'Chargement…' : 'Commencer l’aventure' }} <span>→</span></button>
            <NuxtLink to="/login" class="secondary-link">J’ai déjà un compte</NuxtLink>
          </div>
        </div>

        <div class="phone-zone">
          <p class="scribble question">Et aujourd’hui,<br>quelle est ta humeur ? <span>↙</span></p>
          <div class="phone">
            <div class="phone-notch"></div>
            <div class="phone-screen">
              <div class="mini-nav"><b>Les Humeurs à la Funès</b><span>🌙 ☰</span></div>
              <div class="mini-body">
                <h3>Bonjour ! 👋</h3><p>Alors, quelle est ta humeur aujourd’hui ?</p>
                <div class="preview-card">
                  <div class="preview-face">🎭</div>
                  <p>« Une humeur, une expression… »</p>
                  <div class="emoji-row"><span>🤩<small>Génial</small></span><span>😌<small>Bien</small></span><span>😐<small>Moyen</small></span><span>😢<small>Pas top</small></span><span>😡<small>Nul</small></span></div>
                  <div class="save-demo">Enregistrer mon humeur</div>
                </div>
                <div class="tracking"><h3>📊 Mon suivi</h3><div class="tabs"><b>Semaine</b><span>Mois</span><span>Année</span></div><div class="bars"><i></i><i></i><i></i><i></i><i></i></div></div>
              </div>
            </div>
          </div>
        </div>

        <div class="benefits">
          <div class="benefit"><span>📊</span><b>Suivi de tes<br>humeurs</b></div>
          <div class="benefit"><span>💛</span><b>Conseils<br>bien-être</b></div>
          <div class="benefit"><span>🙂</span><b>Une dose d’humour<br>au quotidien</b></div>
          <p class="scribble bottom-note">… avec une touche<br>de bonne humeur ! ♡</p>
        </div>
      </div>
    </section>

    <section class="concept-section">
      <div class="section-heading"><span>COMMENT ÇA MARCHE ?</span><h2>Le Concept</h2><p>Quelques gestes simples pour suivre ton humeur au quotidien.</p></div>
      <div class="concept-grid">
        <article v-for="(concept,index) in concepts" :key="concept.title" class="concept-card"><div class="concept-top"><span class="concept-icon">{{ concept.icon }}</span><span class="concept-number">0{{ index+1 }}</span></div><h3>{{ concept.title }}</h3><p>{{ concept.description }}</p></article>
      </div>
    </section>

    <section class="mood-section">
      <div class="section-heading"><span>UN APERÇU</span><h2>Aperçu des Humeurs</h2><p>Des expressions pour mettre une image sur ce que tu ressens.</p></div>
      <div class="mood-grid">
        <article v-for="(mood,index) in moods" :key="mood._id" class="mood-card">
          <div class="mood-image-wrapper"><div class="image-placeholder" v-if="!mood.imageLoaded">🎬</div><img :src="mood.image" :alt="mood.title" class="mood-image" :class="{loaded:mood.imageLoaded}" @load="mood.imageLoaded=true"/><span class="mood-index">0{{ index+1 }}</span></div>
          <div class="mood-content"><h3>{{ mood.title }}</h3><p>{{ mood.subtitle }}</p><small>{{ mood.film }}</small></div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const isNavigating=ref(false)
const concepts=[
 {title:'Exprimez-vous',description:'Choisis facilement l’émotion qui ressemble le plus à ta journée.',icon:'🎭'},
 {title:'Suivez',description:'Observe l’évolution de tes humeurs au fil des jours et des semaines.',icon:'📊'},
 {title:'Améliorez',description:'Retrouve des contenus légers pour prendre soin de ton humeur.',icon:'⭐'},
 {title:'Partagez',description:'Garde une trace de tes émotions et partage-les si tu le souhaites.',icon:'🤝'}
]
const moods=ref([
 {_id:'local-joyeux',title:'Joyeux',subtitle:'Aujourd’hui, tout me fait sourire !',film:'L’Homme orchestre · 1970',image:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Louis_de_Fun%C3%A8s_%E2%80%94_L%27Homme_orchestre_%281970%29.jpg',imageLoaded:false},
 {_id:'local-enerve',title:'Énervé',subtitle:'Il ne faudrait pas trop me chercher aujourd’hui…',film:'L’Homme orchestre · 1970',image:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Louis_de_Fun%C3%A8s_2_%E2%80%94_L%27Homme_orchestre_%281970%29.jpg',imageLoaded:false},
 {_id:'local-surpris',title:'Surpris',subtitle:'Alors ça, je ne l’avais vraiment pas vu venir !',film:'L’Homme orchestre · 1970',image:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Louis_de_Fun%C3%A8s_3_%E2%80%94_L%27Homme_orchestre_%281970%29.jpg',imageLoaded:false},
 {_id:'local-fatigue',title:'Fatigué',subtitle:'Aujourd’hui, je tourne clairement au ralenti.',film:'L’Homme orchestre · 1970',image:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Louis_de_Fun%C3%A8s_4_%E2%80%94_L%27Homme_orchestre_%281970%29.jpg',imageLoaded:false}
])
const goToRegister=async()=>{isNavigating.value=true;try{await navigateTo('/register')}finally{isNavigating.value=false}}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
.home-page{--brown:#2b0f12;--brown2:#3b1b10;--yellow:#f6b72d;--cream:#fffaf0;--soft:#fff3c9;min-height:100vh;background:var(--cream);color:var(--brown);font-family:'DM Sans',sans-serif}
.hero-section{position:relative;overflow:hidden;min-height:calc(100vh - 64px);padding:clamp(3rem,6vw,6rem) clamp(1rem,5vw,5rem) 2rem;background:radial-gradient(circle at 55% 45%,#fff 0,#fffaf1 42%,#fff7e3 100%)}
.blob{position:absolute;border-radius:45% 55% 58% 42%;background:rgba(248,196,66,.12);pointer-events:none}.blob-one{width:480px;height:410px;right:-130px;top:-120px;transform:rotate(22deg)}.blob-two{width:340px;height:310px;left:-170px;top:45%;transform:rotate(-20deg)}
.hero-grid{position:relative;z-index:1;max-width:1320px;margin:auto;display:grid;grid-template-columns:1.05fr .9fr .65fr;align-items:center;gap:clamp(1.5rem,4vw,4rem)}
.project-pill{display:inline-flex;align-items:center;gap:.75rem;padding:.65rem 1.1rem;border-radius:999px;background:rgba(255,255,255,.78);border:1px solid rgba(246,183,45,.35);box-shadow:0 8px 22px rgba(73,42,10,.08);font-weight:800;letter-spacing:.22em;font-size:.76rem}.project-pill i{width:15px;height:15px;border-radius:50%;background:var(--yellow)}
.hero-copy h1{font-family:'Playfair Display',serif;font-size:clamp(3.4rem,6.2vw,6.5rem);line-height:.88;margin:1.5rem 0 1.6rem;letter-spacing:-.045em}.hero-copy h1 strong{color:var(--yellow);font-weight:800}.rays{display:inline-block;font-family:sans-serif;font-size:.4em;margin-left:.15em;transform:rotate(18deg)}.hero-lead{max-width:620px;font-size:clamp(1.05rem,1.7vw,1.35rem);line-height:1.55;color:#4e4544}.scribble{font-family:'Caveat',cursive;font-weight:600;color:#251719;line-height:1.05}.left-note{font-size:1.65rem;margin:2rem 0 .7rem;transform:rotate(-4deg)}.hero-actions{display:flex;align-items:center;gap:1.25rem;flex-wrap:wrap;margin-top:1.4rem}.primary-btn{border:0;border-radius:999px;background:var(--brown2);color:white;padding:1rem 1.45rem;font-size:1rem;font-weight:700;box-shadow:0 12px 30px rgba(59,27,16,.2);cursor:pointer;transition:.25s}.primary-btn:hover{transform:translateY(-3px)}.primary-btn span{margin-left:.65rem}.secondary-link{color:var(--brown2);font-weight:700;text-decoration:none;border-bottom:1px solid rgba(59,27,16,.25)}
.phone-zone{position:relative;display:flex;justify-content:center;padding-top:5rem}.question{position:absolute;right:-45%;top:0;font-size:1.55rem;transform:rotate(-5deg);text-align:center}.question span{display:block;font-family:sans-serif;font-size:2rem;margin-top:.5rem}.phone{position:relative;width:min(330px,100%);height:620px;border:9px solid #181414;border-radius:48px;background:#111;padding:7px;box-shadow:0 30px 55px rgba(50,30,20,.23);transform:rotate(-3deg)}.phone-notch{position:absolute;z-index:3;top:7px;left:50%;transform:translateX(-50%);width:115px;height:25px;border-radius:0 0 18px 18px;background:#111}.phone-screen{height:100%;overflow:hidden;border-radius:34px;background:#fffaf1}.mini-nav{height:60px;background:var(--brown2);color:#fff5d8;display:flex;align-items:flex-end;justify-content:space-between;padding:0 17px 12px;font-size:.8rem}.mini-body{padding:20px 16px;color:#2e2020}.mini-body h3{margin:0;font-size:1.05rem}.mini-body>p{font-size:.75rem;margin:.2rem 0 .9rem}.preview-card,.tracking{background:#fff;border:1px solid #f0e8d9;border-radius:20px;padding:12px;box-shadow:0 8px 20px rgba(55,34,20,.06)}.preview-face{height:135px;border-radius:15px;background:radial-gradient(circle,#ffe8a3 0 45%,#fff9ec 46%);display:grid;place-items:center;font-size:4.5rem}.preview-card>p{text-align:center;font-size:.73rem}.emoji-row{display:grid;grid-template-columns:repeat(5,1fr);gap:4px}.emoji-row span{display:flex;flex-direction:column;align-items:center;background:#fff9e9;border-radius:10px;padding:6px 2px;font-size:1.15rem}.emoji-row small{font-size:.48rem;margin-top:3px}.save-demo{margin-top:10px;text-align:center;background:linear-gradient(90deg,#ffbd25,#ffd15d);padding:9px;border-radius:999px;font-size:.7rem;font-weight:800}.tracking{margin-top:10px}.tracking h3{font-size:.9rem}.tabs{display:flex;justify-content:space-between;align-items:center;background:#f8f3ee;border-radius:999px;margin-top:9px;font-size:.55rem}.tabs>*{padding:7px 12px}.tabs b{background:var(--brown2);color:white;border-radius:999px}.bars{height:65px;display:flex;align-items:flex-end;justify-content:space-around;padding:8px 10px 0}.bars i{width:17px;border-radius:6px 6px 2px 2px;background:#ffd56a}.bars i:nth-child(1){height:25%}.bars i:nth-child(2){height:68%;background:#a9d873}.bars i:nth-child(3){height:45%;background:#c3a6df}.bars i:nth-child(4){height:80%;background:#7ed4cf}.bars i:nth-child(5){height:55%}
.benefits{display:flex;flex-direction:column;gap:1rem}.benefit{display:flex;align-items:center;gap:1rem;background:rgba(255,255,255,.82);border:1px solid rgba(73,42,10,.08);border-radius:25px;padding:1rem 1.15rem;box-shadow:0 10px 28px rgba(73,42,10,.07)}.benefit span{display:grid;place-items:center;flex:0 0 50px;height:50px;border-radius:50%;background:#fff3c9;font-size:1.45rem}.benefit b{font-size:.95rem;line-height:1.3}.bottom-note{font-size:1.5rem;text-align:center;margin-top:1.5rem;transform:rotate(-5deg)}
.concept-section,.mood-section{padding:clamp(4.5rem,8vw,7rem) clamp(1rem,5vw,4rem);position:relative}.concept-section{background:linear-gradient(180deg,#fff7e5,#fffaf0)}.mood-section{background:#fff}.section-heading{text-align:center;max-width:680px;margin:0 auto 3rem}.section-heading>span{display:inline-block;font-size:.7rem;letter-spacing:.2em;font-weight:800;padding:.5rem .9rem;background:#fff;border:1px solid rgba(43,15,18,.08);border-radius:999px}.section-heading h2{font-family:'Playfair Display',serif;font-size:clamp(2.4rem,4.5vw,4rem);margin:.8rem 0 .5rem}.section-heading p{color:#6c5d59}.concept-grid,.mood-grid{max-width:1180px;margin:auto;display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}.concept-card{background:rgba(255,255,255,.82);border:1px solid rgba(43,15,18,.07);border-radius:27px;padding:1.5rem;box-shadow:0 12px 30px rgba(65,39,15,.05);transition:.25s}.concept-card:hover{transform:translateY(-5px)}.concept-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.6rem}.concept-icon{display:grid;place-items:center;width:50px;height:50px;background:#fff1bd;border-radius:17px;font-size:1.4rem}.concept-number{font-family:'Playfair Display',serif;font-size:2rem;color:rgba(43,15,18,.12)}.concept-card h3{font-family:'Playfair Display',serif;font-size:1.3rem;margin:.4rem 0}.concept-card p{font-size:.9rem;line-height:1.6;color:#71625d}.mood-card{overflow:hidden;background:#fffaf2;border:1px solid rgba(43,15,18,.08);border-radius:25px;box-shadow:0 12px 28px rgba(43,15,18,.07);transition:.25s}.mood-card:hover{transform:translateY(-5px)}.mood-image-wrapper{position:relative;aspect-ratio:1/1;overflow:hidden;background:#f4ead6}.image-placeholder{position:absolute;inset:0;display:grid;place-items:center;font-size:2rem}.mood-image{width:100%;height:100%;object-fit:cover;opacity:0;transition:.3s}.mood-image.loaded{opacity:1}.mood-index{position:absolute;top:12px;right:12px;background:rgba(255,250,240,.9);padding:.35rem .6rem;border-radius:999px;font-size:.72rem;font-weight:800}.mood-content{padding:1.15rem}.mood-content h3{font-family:'Playfair Display',serif;font-size:1.3rem;margin:0 0 .35rem}.mood-content p{font-size:.86rem;color:#6e5e59;line-height:1.45;margin:0 0 .8rem}.mood-content small{color:#9a857c}
@media(max-width:1050px){.hero-grid{grid-template-columns:1fr 1fr}.benefits{grid-column:1/-1;display:grid;grid-template-columns:repeat(3,1fr)}.bottom-note{display:none}.question{right:-15%}.concept-grid,.mood-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:700px){.hero-section{padding:2.2rem 1rem 3.5rem}.hero-grid{display:flex;flex-direction:column;text-align:center}.hero-copy h1{font-size:clamp(3.25rem,16vw,5rem);margin-top:1.2rem}.hero-lead{font-size:1rem}.left-note{font-size:1.35rem;margin:1.4rem 0}.hero-actions{justify-content:center}.phone-zone{padding-top:4.5rem;width:100%}.question{top:0;right:5%;font-size:1.25rem}.phone{width:285px;height:545px}.benefits{display:grid;grid-template-columns:1fr;width:100%;max-width:420px}.benefit{text-align:left}.concept-section,.mood-section{padding:4rem 1rem}.concept-grid{grid-template-columns:1fr 1fr;gap:.75rem}.concept-card{padding:1.05rem;border-radius:21px}.concept-card p{font-size:.8rem}.mood-grid{display:flex;overflow-x:auto;gap:.85rem;margin:0 -1rem;padding:0 1rem 1rem;scroll-snap-type:x mandatory;scrollbar-width:none}.mood-card{flex:0 0 78%;max-width:290px;scroll-snap-align:center}}
@media(max-width:390px){.concept-grid{grid-template-columns:1fr}.project-pill{font-size:.66rem}.phone{width:265px;height:520px}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
</style>