window.caseLibrary = window.caseLibrary || {};

window.caseLibrary.tutorial = {
  id: "tutorial",
  title: "Caso Tutorial: El Fantasma del Museo",
  synopsis: "Un valioso artefacto ha desaparecido. ¿Fantasmas o un crimen humano? Aprende a usar tu dinero, gestionar sospechas y deducir la verdad.",
  startScene: "intro",
  mapData: [
    { id: "hall", label: "Vestíbulo", row: 2, col: 2 },
    { id: "exhibit", label: "Sala de Exhibición", row: 1, col: 2 },
    { id: "security", label: "Seguridad", row: 2, col: 1 },
    { id: "lab", label: "Laboratorio", row: 2, col: 3 },
    { id: "basement", label: "Sótano", row: 3, col: 2 }
  ],
  concepts: {
    // Sensoriales
    "Vitrina destrozada": { type: "sensorial", description: "Cristales rotos hacia afuera. El artefacto no está." },
    "Olor a disolvente": { type: "sensorial", description: "Un fuerte olor químico proviene de la vitrina rota." },
    "Huellas de barro": { type: "sensorial", description: "Rastro de botas que va desde el sótano hacia la salida." },
    "Ventana del sótano": { type: "sensorial", description: "Abierta desde el interior. No hay signos de fuerza." },
    "Ticket de apuestas": { type: "objeto", description: "Encontrado en la basura del laboratorio. Muestra una gran deuda." },
    "Cinta borrada": { type: "sensorial", description: "Las cámaras de seguridad no grabaron nada entre las 2:00 y 3:00 AM." },
    
    // Falsos
    "Fantasma del museo": { type: "falso", description: "La teoría del guardia. Ruidos de cadenas y lamentos." },
    
    // Deducidos
    "Robo interno": { type: "deducido", description: "La ventana se abrió desde dentro y las cámaras fueron manipuladas. Alguien con acceso lo hizo." },
    "El Cambiazo": { type: "deducido", description: "El disolvente sugiere que el artefacto fue manipulado o reemplazado antes del robo." },
    "Móvil económico": { type: "deducido", description: "La restauradora tiene deudas de juego urgentes." }
  },
  suspects: [
    {
      name: "Miller, el guardia",
      description: "Supersticioso y algo incompetente. Cree en fantasmas.",
      suspicionLevel: 1,
      associatedConcepts: ["Fantasma del museo"]
    },
    {
      name: "Sarah, la restauradora",
      description: "Meticulosa y defensiva. Tiene acceso a todo el museo.",
      suspicionLevel: 2,
      associatedConcepts: []
    }
  ],
  locations: [
    { name: "Vestíbulo Principal", description: "El centro del museo.", totalProgress: 1 },
    { name: "Sala de Exhibición", description: "Donde ocurrió el crimen.", totalProgress: 3 },
    { name: "Cuarto de Seguridad", description: "Monitores y cafetería.", totalProgress: 2 },
    { name: "Laboratorio de Restauración", description: "Olor a químicos y herramientas.", totalProgress: 2 },
    { name: "Sótano", description: "Oscuro y húmedo.", totalProgress: 2 }
  ],
  endings: [
    {
      scene: "ending-fired",
      conditions: {
        suspicion: { name: "Sarah, la restauradora", min: 5 } // Si la presionas demasiado sin pruebas, te echan.
      }
    }
  ],
  scenes: {
    "intro": {
      location: "hall",
      text: `
        <p><strong>09:00 AM. Museo de Historia.</strong></p>
        <p>El Director Blackwood te ha contratado. "El 'Ojo de Ra' ha desaparecido esta noche. Miller dice que fue un fantasma. Yo digo que quiero mi joya de vuelta antes de que la prensa se entere".</p>
        <p>Tienes $50 para gastos. Úsalos sabiamente.</p>
      `,
      moneyGain: 50,
      notes: ["El 'Ojo de Ra' desapareció anoche.", "Debo investigar antes de acusar."],
      choices: [
        { text: "Comenzar investigación", next: "hub" }
      ]
    },
    "hub": {
      location: "hall",
      text: `
        <p>Estás en el Vestíbulo Principal. Desde aquí puedes acceder a todas las áreas del museo.</p>
      `,
      choices: [
        { text: "Ir a la Sala de Exhibición", next: "exhibit-room" },
        { text: "Ir al Cuarto de Seguridad", next: "security-room" },
        { text: "Ir al Laboratorio de Restauración", next: "lab-room" },
        { text: "Bajar al Sótano", next: "basement-door" },
        { text: "Sacar conclusiones (Finalizar)", next: "deduction-room" }
      ]
    },
    
    // --- SALA DE EXHIBICIÓN ---
    "exhibit-room": {
      location: "exhibit",
      text: `
        <p>La sala está acordonada. En el centro, el pedestal vacío.</p>
      `,
      choices: [
        { text: "Examinar la vitrina", next: "exhibit-case" },
        { text: "Oler el aire", next: "exhibit-smell" },
        { text: "Volver al vestíbulo", next: "hub" }
      ]
    },
    "exhibit-case": {
      location: "exhibit",
      text: `
        <p>Cristales rotos esparcidos por el suelo, hacia afuera. Quien lo hizo, rompió el cristal desde dentro o lo empujó.</p>
      `,
      reward: ["Vitrina destrozada"],
      locationProgress: { location: "Sala de Exhibición", progressGain: 1 },
      choices: [{ text: "Continuar", next: "exhibit-room" }]
    },
    "exhibit-smell": {
      location: "exhibit",
      text: `
        <p>Te acercas al pedestal. Hay un olor penetrante, acre. No huele a limpiador de suelos, huele a disolvente industrial.</p>
      `,
      reward: ["Olor a disolvente"],
      locationProgress: { location: "Sala de Exhibición", progressGain: 1 },
      choices: [{ text: "Continuar", next: "exhibit-room" }]
    },

    // --- CUARTO DE SEGURIDAD ---
    "security-room": {
      location: "security",
      text: `
        <p>Miller, el guardia, está tomando café nerviosamente. Las pantallas muestran las cámaras en vivo.</p>
      `,
      choices: [
        { text: "Preguntar por lo sucedido anoche", next: "security-talk" },
        { text: "Pedir ver las grabaciones", next: "security-tapes" },
        { text: "Sobornar para ver el registro privado ($20)", next: "security-bribe", moneyCost: 20 },
        { text: "Volver al vestíbulo", next: "hub" }
      ]
    },
    "security-talk": {
      location: "security",
      text: `
        <p>"¡Fue el fantasma! Lo juro. Las luces parpadearon, sentí un frío helado y luego... ¡puf! La joya no estaba. No me acerqué, tengo familia."</p>
      `,
      reward: ["Fantasma del museo"],
      suspectAdjustments: [{ name: "Miller, el guardia", change: 1 }],
      choices: [{ text: "Continuar", next: "security-room" }]
    },
    "security-tapes": {
      location: "security",
      text: `
        <p>Miller niega con la cabeza. "El sistema falló justo a esa hora. Interferencia espectral, le digo."</p>
      `,
      choices: [{ text: "Continuar", next: "security-room" }]
    },
    "security-bribe": {
      location: "security",
      text: `
        <p>Miller toma el billete. "Mira, no fue un fantasma lo de las cámaras. Alguien las apagó manualmente desde el panel principal a las 2:05 AM. Solo yo y Sarah tenemos llave de ese panel."</p>
      `,
      reward: ["Cinta borrada"],
      notes: ["Las cámaras fueron apagadas manualmente."],
      locationProgress: { location: "Cuarto de Seguridad", progressGain: 2 },
      choices: [{ text: "Interesante...", next: "security-room" }]
    },

    // --- LABORATORIO ---
    "lab-room": {
      location: "lab",
      text: `
        <p>El dominio de Sarah. Herramientas de precisión, pinturas y disolventes por todas partes.</p>
      `,
      choices: [
        { text: "Hablar con Sarah", next: "lab-talk" },
        { text: "Revisar la papelera (Requiere distracción o $10)", next: "lab-trash-pay", moneyCost: 10 },
        { text: "Presionar sobre el disolvente (Requiere concepto)", next: "lab-pressure", requires: ["Olor a disolvente"] },
        { text: "Volver al vestíbulo", next: "hub" }
      ]
    },
    "lab-talk": {
      location: "lab",
      text: `
        <p>Sarah no levanta la vista de su microscopio. "Estoy ocupada restaurando una vasija. Si buscas fantasmas, habla con Miller."</p>
      `,
      suspectAdjustments: [{ name: "Sarah, la restauradora", change: 1 }],
      choices: [{ text: "Continuar", next: "lab-room" }]
    },
    "lab-trash-pay": {
      location: "lab",
      text: `
        <p>Le ofreces $10 para que vaya a comprar café. En cuanto sale, revisas la papelera. Encuentras un ticket de apuestas arrugado. Debe miles de dólares.</p>
      `,
      reward: ["Ticket de apuestas"],
      notes: ["Sarah tiene deudas de juego."],
      locationProgress: { location: "Laboratorio de Restauración", progressGain: 2 },
      choices: [{ text: "Guardar ticket", next: "lab-room" }]
    },
    "lab-pressure": {
      location: "lab",
      text: `
        <p>Le mencionas el olor en la sala de exhibición. Sarah se tensa. "Uso disolventes todo el tiempo, el olor se impregna en mi ropa. Eso no prueba nada."</p>
        <p>Su nerviosismo es evidente.</p>
      `,
      suspectAdjustments: [{ name: "Sarah, la restauradora", change: 2 }],
      choices: [{ text: "Continuar", next: "lab-room" }]
    },

    // --- SÓTANO ---
    "basement-door": {
      location: "basement",
      text: `
        <p>La puerta del sótano. Está cerrada.</p>
      `,
      choices: [
        { text: "Usar ganzúa (Requiere habilidad o suerte)", next: "basement-enter" }, // Simplificado para tutorial
        { text: "Pedir llave a Miller (Si sospecha < 3)", next: "basement-key", requiresSuspicion: { name: "Miller, el guardia", max: 2 } },
        { text: "Volver", next: "hub" }
      ]
    },
    "basement-key": {
      location: "security",
      text: `
        <p>Miller te da la llave. "Ten cuidado, ahí es donde más se oyen los lamentos."</p>
      `,
      choices: [{ text: "Entrar al sótano", next: "basement-enter" }]
    },
    "basement-enter": {
      location: "basement",
      text: `
        <p>El sótano está lleno de cajas viejas. Al fondo, ves una ventana pequeña.</p>
      `,
      choices: [
        { text: "Examinar ventana", next: "basement-window" },
        { text: "Examinar suelo", next: "basement-floor" },
        { text: "Volver", next: "hub" }
      ]
    },
    "basement-window": {
      location: "basement",
      text: `
        <p>La ventana está abierta. El pestillo no está roto, fue abierto desde este lado.</p>
      `,
      reward: ["Ventana del sótano"],
      locationProgress: { location: "Sótano", progressGain: 1 },
      choices: [{ text: "Continuar", next: "basement-enter" }]
    },
    "basement-floor": {
      location: "basement",
      text: `
        <p>Hay barro seco en el suelo, formando un camino desde la ventana hacia las escaleras que suben al vestíbulo.</p>
      `,
      reward: ["Huellas de barro"],
      locationProgress: { location: "Sótano", progressGain: 1 },
      choices: [{ text: "Continuar", next: "basement-enter" }]
    },

    // --- DEDUCCIONES Y FINAL ---
    "deduction-room": {
      location: "hall",
      text: `
        <p>Es hora de atar cabos. Puedes intentar combinar tus pistas para formar una teoría sólida antes de acusar.</p>
      `,
      combinations: [
        {
          requires: ["Ventana del sótano", "Cinta borrada"],
          result: "Robo interno",
          description: "Alguien con llaves y acceso a seguridad preparó la salida."
        },
        {
          requires: ["Olor a disolvente", "Vitrina destrozada"],
          result: "El Cambiazo",
          description: "El olor sugiere que usaron químicos para envejecer una copia o despegar el original."
        },
        {
          requires: ["Ticket de apuestas", "Robo interno"],
          result: "Móvil económico",
          description: "Sarah necesitaba dinero rápido y tenía el acceso para hacerlo."
        }
      ],
      choices: [
        { text: "Acusar a Miller (El Guardia)", next: "accuse-miller" },
        { text: "Acusar a Sarah (La Restauradora)", next: "accuse-sarah" },
        { text: "Declarar que fue un Fantasma", next: "accuse-ghost" },
        { text: "Seguir investigando", next: "hub" }
      ]
    },

    "accuse-ghost": {
      location: "hall",
      text: `
        <p>Le dices al Director que el museo está embrujado. Él te mira en silencio, te paga la mitad de lo acordado y te pide que no vuelvas.</p>
        <p><strong>FINAL MALO: SUPERSTICIÓN</strong></p>
      `,
      choices: [{ text: "Menú Principal", next: "case-selector" }]
    },
    "accuse-miller": {
      location: "hall",
      text: `
        <p>Acusas a Miller. Él llora y jura inocencia. La policía lo detiene, pero días después el 'Ojo de Ra' aparece en el mercado negro. El verdadero culpable escapó.</p>
        <p><strong>FINAL REGULAR: CHIVO EXPIATORIO</strong></p>
      `,
      choices: [{ text: "Menú Principal", next: "case-selector" }]
    },
    "accuse-sarah": {
      location: "hall",
      text: `
        <p>Confrontas a Sarah. Al principio lo niega, pero...</p>
      `,
      choices: [
        { 
          text: "Presentar prueba del móvil (Ticket + Robo interno)", 
          next: "sarah-confession", 
          requires: ["Móvil económico"] 
        },
        { 
          text: "Presentar prueba del método (El Cambiazo)", 
          next: "sarah-confession-method", 
          requires: ["El Cambiazo"] 
        },
        { 
          text: "Acusar sin pruebas sólidas", 
          next: "sarah-denial" 
        }
      ]
    },
    "sarah-denial": {
      location: "hall",
      text: `
        <p>Sarah se ríe en tu cara. "Sin pruebas, son solo calumnias". El Director, temiendo una demanda, te despide.</p>
        <p><strong>FINAL FALLIDO: FALTA DE EVIDENCIA</strong></p>
      `,
      choices: [{ text: "Menú Principal", next: "case-selector" }]
    },
    "sarah-confession": {
      location: "hall",
      text: `
        <p>Lanzas el ticket de apuestas sobre la mesa. Sarah se derrumba. "Debía demasiado dinero... Hice una copia falsa, cambié el original y rompí la vitrina para simular un robo externo. Miller es tan tonto que se creyó lo del fantasma".</p>
        <p>La policía recupera la joya en su casa.</p>
        <p><strong>FINAL PERFECTO: CASO CERRADO</strong></p>
      `,
      choices: [{ text: "Menú Principal", next: "case-selector" }]
    },
    "sarah-confession-method": {
      location: "hall",
      text: `
        <p>Explicas cómo usó los disolventes. Ella palidece, sabiendo que encontraron restos químicos en su ropa. Confiesa el crimen para intentar reducir su pena.</p>
        <p><strong>FINAL BUENO: DEDUCCIÓN TÉCNICA</strong></p>
      `,
      choices: [{ text: "Menú Principal", next: "case-selector" }]
    },
    
    // Final automático por sospecha excesiva
    "ending-fired": {
      location: "hall",
      text: `
        <p><strong>GAME OVER</strong></p>
        <p>Has acosado tanto a Sarah sin pruebas que ha llamado a su abogado. El Director te echa del museo para evitar un escándalo.</p>
      `,
      choices: [{ text: "Menú Principal", next: "case-selector" }]
    }
  }
};
