<script>

import { time } from '../../store/stores.js';

const formatter = new Intl.DateTimeFormat('en', {
  hour12: true,
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit'
});

</script>


<h2>Mandatory 2</h2>

<div>
  <p>Denne website er udviklet som en del af Mandatory 2 i valgfaget <strong>Full Stack Development with NodeJS</strong>, ved KEA (Københavns Erhvervsakademi).</p>

  <p>Fokus er centreret omkring at skabe en fuldstack-authentifikationssystem ved hjælp af et webframework. Projektet inkluderer en webapplikation med både frontend og backend-komponenter, der benytter en database, og tillader brugere at oprette konti, logge ind og administrere deres brugeroplysninger. Website'en omfatter også funktionalitet til at sende e-mails, herunder bekræftelses-emails og gendannelses-emails til glemt adgangskode. Desuden er der implementeret beskednotifikationer for at forbedre brugeroplevelsen.</p>

  <p>På forsiden er der en login- og logud-komponent, og website'ens tema kan tilpasses efter ønske. Målet med dette projekt er at demonstrere evnen til at opbygge et komplet autentifikationssystem ved hjælp af moderne teknologier og bevise forståelsen af sikkerhedsaspekter i webudvikling."</p>

  <p>Siden er udviklet af Marcus Holje</p>

  <h2>{formatter.format($time)}</h2>
</div>