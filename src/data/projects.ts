/* =========================================================
   WALO — proyectos
   PLACEHOLDERS: nombres, textos, superficies e imágenes son
   provisionales (fotos de Unsplash). Sustituir por obra real.
   ========================================================= */
import type { Lang } from "../i18n";

export type Accent = "ember" | "ultra" | "aurora";

export interface ProjectCopy {
  name: string;
  type: string;
  place: string;
  status: string;
  summary: string;
  scope: string;
  concept: string;
  systems: string;
  result: string;
  faqs: { q: string; a: string }[];
}

export interface Project {
  slug: string;
  num: string;
  year: number;
  area: string;
  accent: Accent;
  hero: { src: string; pos?: string };
  gallery: { src: string; pos?: string; alt: Record<Lang, string> }[];
  es: ProjectCopy;
  en: ProjectCopy;
}

const img = (n: string) => `/assets/images/walo-${n}.jpg`;

export const projects: Project[] = [
  {
    slug: "museo-ampliacion",
    num: "01",
    year: 2025,
    area: "4.800 m²",
    accent: "ember",
    hero: { src: img("07"), pos: "50% 70%" },
    gallery: [
      { src: img("07"), alt: { es: "Volumen de hormigón iluminado desde la base", en: "Concrete volume lit from its base" } },
      { src: img("02"), alt: { es: "Torre oscura con pocas ventanas encendidas", en: "Dark tower with a few lit windows" } },
      { src: img("10"), alt: { es: "Fachada en retícula con luz interior", en: "Gridded façade with interior light" } },
      { src: img("15"), alt: { es: "Arista de fachada con línea de luz", en: "Façade edge with a line of light" } },
    ],
    es: {
      name: "Museo — Ampliación",
      type: "Cultural",
      place: "Madrid",
      status: "Construido",
      summary: "Una luz que no compite con la obra: el nuevo ala del museo se lee de día como masa y de noche como una grieta encendida.",
      scope: "Concepto, proyecto técnico y dirección de obra de la iluminación de la nueva ala: salas expositivas, patio y fachada.",
      concept: "Planos de luz cenital difusa en las salas para que la obra sea protagonista y un único gesto nocturno en fachada: la grieta de hormigón encendida desde dentro.",
      systems: "Carriles con proyectores de óptica intercambiable (2700–4000 K, CRI 97), bañadores lineales empotrados y control DALI-2 por escenas.",
      result: "Una ampliación que de día se funde con el edificio original y de noche se convierte en referencia del barrio, con un consumo muy inferior al de las salas existentes.",
      faqs: [
        { q: "¿Cómo se ilumina una obra de arte sin dañarla?", a: "Controlando la radiación UV e IR, limitando la iluminancia según la sensibilidad de cada pieza y usando fuentes LED con alta reproducción cromática." },
        { q: "¿Se puede cambiar la iluminación en cada exposición?", a: "Sí. Los carriles, las ópticas intercambiables y las escenas programadas permiten rehacer una sala sin obra." },
        { q: "¿Qué temperatura de color es adecuada para un museo?", a: "Depende de la obra: en torno a 3000 K para pintura y madera, hasta 4000 K para piedra o arte contemporáneo. La clave es la coherencia en todo el recorrido." },
      ],
    },
    en: {
      name: "Museum — Extension",
      type: "Cultural",
      place: "Madrid",
      status: "Built",
      summary: "Light that never competes with the art: the new wing reads as mass by day and as a glowing crack at night.",
      scope: "Concept, technical design and site supervision for the lighting of the new wing: galleries, courtyard and façade.",
      concept: "Planes of diffuse overhead light in the galleries so the work takes centre stage, and a single night-time gesture on the façade: the concrete crack lit from within.",
      systems: "Tracks with interchangeable-optic spotlights (2700–4000 K, CRI 97), recessed linear washers and scene-based DALI-2 control.",
      result: "An extension that merges with the original building by day and becomes a neighbourhood landmark by night, using far less energy than the existing galleries.",
      faqs: [
        { q: "How do you light artwork without damaging it?", a: "By controlling UV and IR radiation, limiting illuminance to each piece’s sensitivity and using high colour-rendering LED sources." },
        { q: "Can the lighting change with every exhibition?", a: "Yes. Tracks, interchangeable optics and programmed scenes let a gallery be relit without building work." },
        { q: "Which colour temperature suits a museum?", a: "It depends on the work: around 3000 K for painting and wood, up to 4000 K for stone or contemporary art. Consistency along the route is what matters." },
      ],
    },
  },
  {
    slug: "torre-norte",
    num: "02",
    year: 2024,
    area: "32.000 m²",
    accent: "ultra",
    hero: { src: img("01"), pos: "50% 50%" },
    gallery: [
      { src: img("12"), alt: { es: "Fachada curva con bandas horizontales de luz", en: "Curved façade with horizontal bands of light" } },
      { src: img("11"), alt: { es: "Retícula de ventanas con luz cálida", en: "Grid of windows with warm light" } },
      { src: img("06"), alt: { es: "Dos torres de oficinas con plantas encendidas", en: "Two office towers with lit floors" } },
      { src: img("01"), alt: { es: "Fachada de vidrio con oficinas iluminadas", en: "Glass façade with lit offices" } },
    ],
    es: {
      name: "Torre Norte",
      type: "Oficinas",
      place: "Madrid",
      status: "Construido",
      summary: "La torre como una linterna ordenada: la retícula de fachada se lee de noche solo con la luz de su interior.",
      scope: "Plan director de iluminación de fachada, vestíbulo de doble altura y plantas tipo de oficinas.",
      concept: "Una luz interior cálida y homogénea que dibuja la retícula de la fachada sin una sola luminaria exterior ni brillos hacia la calle.",
      systems: "Perfiles lineales de bajo deslumbramiento (UGR < 16), iluminación perimetral de cortesía y regulación por aportación de luz natural y presencia.",
      result: "Una imagen nocturna coherente y reconocible y unas oficinas más confortables que consumen menos energía.",
      faqs: [
        { q: "¿Cómo se ilumina una fachada sin luminarias exteriores?", a: "Diseñando la luz interior del perímetro para que se lea desde fuera: temperatura de color, ritmo de encendidos y escenas nocturnas coordinadas." },
        { q: "¿Qué es la regulación por luz natural?", a: "Sensores que miden la luz que entra por la fachada y reducen la artificial lo necesario para mantener el nivel de proyecto." },
        { q: "¿Influye la iluminación en el bienestar en la oficina?", a: "Mucho: el deslumbramiento, la uniformidad y el ritmo de la luz a lo largo del día afectan al confort visual y a la concentración." },
      ],
    },
    en: {
      name: "Torre Norte",
      type: "Workplace",
      place: "Madrid",
      status: "Built",
      summary: "The tower as an ordered lantern: at night its façade grid is read through interior light alone.",
      scope: "Lighting masterplan for the façade, double-height lobby and typical office floors.",
      concept: "Warm, even interior light that draws the façade grid without a single exterior fixture or glare towards the street.",
      systems: "Low-glare linear profiles (UGR < 16), perimeter courtesy lighting and daylight- and presence-based dimming.",
      result: "A coherent, recognisable night-time image and more comfortable offices that use less energy.",
      faqs: [
        { q: "How do you light a façade without exterior fixtures?", a: "By designing the perimeter’s interior light to be read from outside: colour temperature, switching rhythm and coordinated night scenes." },
        { q: "What is daylight-linked dimming?", a: "Sensors measure the daylight entering through the façade and reduce artificial light just enough to hold the design level." },
        { q: "Does lighting affect wellbeing at work?", a: "A great deal: glare, uniformity and the rhythm of light through the day all affect visual comfort and focus." },
      ],
    },
  },
  {
    slug: "convento",
    num: "03",
    year: 2023,
    area: "2.600 m²",
    accent: "aurora",
    hero: { src: img("03"), pos: "50% 35%" },
    gallery: [
      { src: img("03"), alt: { es: "Fachada histórica iluminada de noche", en: "Historic façade lit at night" } },
      { src: img("09"), alt: { es: "Muro blanco con ventanas de luz cálida", en: "White wall with warm-lit windows" } },
      { src: img("13"), alt: { es: "Arista de edificio con líneas cálidas", en: "Building corner with warm lines" } },
    ],
    es: {
      name: "Convento",
      type: "Patrimonio",
      place: "Toledo",
      status: "Construido",
      summary: "Devolver la noche al edificio: luz rasante que dibuja la piedra y fuentes de luz que nunca se ven.",
      scope: "Estudio histórico-lumínico, proyecto de iluminación exterior e interior y coordinación con la administración de Patrimonio.",
      concept: "Luz cálida y rasante que revela la textura de la piedra, respeto por la oscuridad del entorno y ninguna luminaria a la vista.",
      systems: "Proyectores de pequeño formato ocultos en cornisas, fuentes de 2200–2700 K, ópticas asimétricas y control astronómico.",
      result: "Un conjunto que recupera su lectura nocturna sin alterar su fábrica y con una intervención completamente reversible.",
      faqs: [
        { q: "¿Se puede iluminar un edificio protegido?", a: "Sí, con soluciones reversibles, sin anclajes en la fábrica original y validadas por el organismo de Patrimonio competente." },
        { q: "¿Por qué luz cálida en patrimonio?", a: "Porque respeta el color de la piedra y la memoria de la luz de llama, y reduce el impacto sobre fauna y cielo nocturno." },
        { q: "¿Cómo se evita la contaminación lumínica?", a: "Dirigiendo la luz solo hacia donde se necesita, con ópticas precisas, sin flujo hacia el cielo y con horarios de apagado." },
      ],
    },
    en: {
      name: "Convent",
      type: "Heritage",
      place: "Toledo",
      status: "Built",
      summary: "Giving the night back to the building: grazing light that draws the stone and light sources that are never seen.",
      scope: "Historic lighting study, exterior and interior lighting design and coordination with the heritage authority.",
      concept: "Warm grazing light that reveals the texture of the stone, respect for the darkness around it and no visible fixtures.",
      systems: "Small-format projectors hidden in cornices, 2200–2700 K sources, asymmetric optics and astronomical time control.",
      result: "An ensemble that regains its night-time reading without altering its fabric, through a fully reversible intervention.",
      faqs: [
        { q: "Can a listed building be lit?", a: "Yes, with reversible solutions, no fixings into the original fabric and approval from the relevant heritage body." },
        { q: "Why warm light for heritage?", a: "It respects the colour of the stone and the memory of flame light, and reduces the impact on wildlife and the night sky." },
        { q: "How do you avoid light pollution?", a: "By sending light only where it is needed, with precise optics, no upward flux and switch-off schedules." },
      ],
    },
  },
  {
    slug: "pabellon-expo",
    num: "04",
    year: 2023,
    area: "1.900 m²",
    accent: "ember",
    hero: { src: img("05"), pos: "50% 55%" },
    gallery: [
      { src: img("08"), alt: { es: "Esquina de vidrio con línea de luz de color", en: "Glass corner with a coloured line of light" } },
      { src: img("05"), alt: { es: "Edificio con luz de color al anochecer", en: "Building with coloured light at dusk" } },
      { src: img("04"), alt: { es: "Skyline nocturno con torres iluminadas", en: "Night skyline with lit towers" } },
      { src: img("14"), alt: { es: "Torres residenciales con ventanas encendidas", en: "Residential towers with lit windows" } },
    ],
    es: {
      name: "Pabellón EXPO",
      type: "Público · Efímero",
      place: "Lisboa",
      status: "Desmontado",
      summary: "Una envolvente que respira: luz de color dinámica que acompaña el flujo de visitantes y cambia con la hora del día.",
      scope: "Concepto lumínico, diseño de escenas dinámicas, proyecto técnico y programación del sistema de control.",
      concept: "La fachada como una pantalla de baja resolución: la luz de color se mueve lentamente, siguiendo la afluencia y el programa de eventos.",
      systems: "Líneas LED RGBW direccionables, control DMX / Art-Net y escenas sincronizadas con el calendario del pabellón.",
      result: "Un pabellón reconocible desde el río durante toda la exposición y un sistema recuperado y reutilizado tras el desmontaje.",
      faqs: [
        { q: "¿Qué diferencia hay entre RGB y RGBW?", a: "RGBW añade un canal de blanco real, que mejora los tonos pastel y la reproducción de blancos frente a mezclar solo rojo, verde y azul." },
        { q: "¿Se puede reutilizar la iluminación de un pabellón temporal?", a: "Sí, si se diseña para ello: fijaciones mecánicas, cableado modular y equipos estándar que puedan volver a instalarse." },
        { q: "¿Cómo se programan las escenas dinámicas?", a: "Con un servidor de control que dispara escenas por horario, por sensores o manualmente desde una tableta durante los eventos." },
      ],
    },
    en: {
      name: "EXPO Pavilion",
      type: "Public · Temporary",
      place: "Lisbon",
      status: "Dismantled",
      summary: "An envelope that breathes: dynamic coloured light that follows visitor flow and shifts with the time of day.",
      scope: "Lighting concept, dynamic scene design, technical design and control system programming.",
      concept: "The façade as a low-resolution screen: coloured light moves slowly, following footfall and the events programme.",
      systems: "Addressable RGBW LED lines, DMX / Art-Net control and scenes synchronised with the pavilion’s calendar.",
      result: "A pavilion recognisable from the river throughout the expo, and a system recovered and reused after dismantling.",
      faqs: [
        { q: "What is the difference between RGB and RGBW?", a: "RGBW adds a true white channel, improving pastel tones and white rendering compared with mixing red, green and blue alone." },
        { q: "Can a temporary pavilion’s lighting be reused?", a: "Yes, if designed for it: mechanical fixings, modular wiring and standard equipment that can be reinstalled." },
        { q: "How are dynamic scenes programmed?", a: "With a control server that triggers scenes by schedule, by sensors or manually from a tablet during events." },
      ],
    },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
