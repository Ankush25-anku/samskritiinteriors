// Everything below the Manifesto, in its own chunk: the hero and first sheet paint without waiting for it.
// App starts loading this module on its first render, so it arrives while the visitor is still in the hero.
import Services from './Services.jsx';
import Stats from './Stats.jsx';
import Projects from './Projects.jsx';
import Process from './Process.jsx';
import Materials from './Materials.jsx';
import Team from './Team.jsx';
import Voices from './Voices.jsx';
import Plans from './Plans.jsx';
import Faq from './Faq.jsx';
import Contact from './Contact.jsx';
import Footer from './Footer.jsx';
import { SHOW_TEAM, SHOW_TESTIMONIALS } from '../data.js';

export default function Rest() {
  return (
    <>
      <Services />
      <Stats />
      <Projects />
      <Process />
      <Materials />
      {SHOW_TEAM && <Team />}            {/* hidden until real people are added (src/data.js) */}
      {SHOW_TESTIMONIALS && <Voices />}  {/* hidden until there are real reviews */}
      <Plans />
      <Faq />
      <Contact />
    </>
  );
}

export { Footer };
