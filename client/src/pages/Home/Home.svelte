<script>
  import { time } from '../../store/stores.js';

  const formatter = new Intl.DateTimeFormat('da-DK', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
</script>

<h2>Mandatory 2</h2>

<div>
  <p>This website has been developed as part of Mandatory 2 in the elective course <strong>Full Stack Development with NodeJS</strong> at KEA (Copenhagen School of Design and Technology).</p>

  <p>
    The focus is centered around creating a full-stack authentication system using a web framework. The project includes a web application with both frontend and backend components, utilizing two different databases (mySQL and sqlite). Users can create accounts, log in, and explore the hidden
    features of the site. The website also features functionality to send emails (contact us). Additionally, message notifications have been implemented to enhance the user experience with svelte-toast.
  </p>

  <p>
    Time is precious, and so is your journey through the world of Full Stack Development! Our clock not only keeps you on schedule but also symbolizes the timely progression of skills and knowledge as you explore the intricacies of building a complete authentication system. Embrace every moment, and
    let the ticking seconds inspire your coding adventures!
  </p>

  <h2>{formatter.format($time)}</h2>

  <p>This page has been developed by Marcus Holje, a computer science student (datamatiker) at KEA.</p>
</div>

<svelte:head>
  <title>Mandatory 2</title>
</svelte:head>
