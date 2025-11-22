export const tutorialCase = {
    id: "tutorial",
    title: "Caso Tutorial: El Fantasma del Museo (Redux)",
    synopsis: "El 'Ojo de Ra' ha desaparecido. Miller jura que fue un espectro. Tú sabes que los espectros no necesitan borrar las cintas de seguridad.",
    startScene: "intro",
    startingTime: 540, // 09:00 AM
    mapConfig: {
      type: "svg",
      viewBox: "0 0 400 400"
    },
    mapData: [
      { 
        id: "hall", 
        label: "Vestíbulo", 
        path: "M 160 140 L 240 140 L 260 160 L 260 240 L 240 260 L 160 260 L 140 240 L 140 160 Z", 
        textX: 200, 
        textY: 200 
      },
      { 
        id: "exhibit", 
        label: "Sala de Exhibición", 
        path: "M 120 30 Q 200 5 280 30 L 280 120 L 120 120 Z", 
        textX: 200, 
        textY: 80 
      },
      { 
        id: "security", 
        label: "Seguridad", 
        path: "M 20 140 L 120 140 L 120 260 L 20 260 L 10 200 Z", 
        textX: 70, 
        textY: 200 
      },
      { 
        id: "lab", 
        label: "Laboratorio", 
        path: "M 280 140 L 380 140 L 390 200 L 380 260 L 280 260 Z", 
        textX: 330, 
        textY: 200 
      },
      { 
        id: "basement", 
        label: "Sótano", 
        path: "M 140 280 L 260 280 L 260 360 Q 200 390 140 360 Z", 
        textX: 200, 
        textY: 330 
      }
    ],
    concepts: {
      // Sensoriales
      "Vitrina destrozada": { 
        type: "sensorial", 
        description: "Cristales rotos hacia afuera. El artefacto no está.",
        tags: ["robo", "escena"],
        ponderText: "Los cristales cayeron hacia afuera. Esto no fue un intruso entrando a la fuerza, fue alguien saliendo... o simulándolo."
      },
      "Olor a disolvente": { 
        type: "sensorial", 
        description: "Un fuerte olor químico proviene de la vitrina rota.",
        tags: ["quimico", "robo"],
        ponderText: "Este olor es penetrante. Acetona industrial. Se usa para limpiar pintura... o pegamento."
      },
      "Huellas de barro": { 
        type: "sensorial", 
        description: "Rastro de botas que va desde el sótano hacia la salida.",
        tags: ["robo", "acceso"],
        ponderText: "Barro seco. Alguien entró por el sótano y subió. O bajó al sótano y salió."
      },
      "Ventana del sótano": { 
        type: "sensorial", 
        description: "Abierta desde el interior. No hay signos de fuerza.",
        tags: ["acceso", "robo"],
        ponderText: "El pestillo está intacto. Alguien la abrió desde dentro para dejar entrar a alguien... o para fingir una entrada."
      },
      "Recibo de empeño": { 
        type: "objeto", 
        description: "Recibo de una casa de empeños por equipo de restauración de alto valor.",
        tags: ["movil", "dinero"],
        ponderText: "Nadie empeña sus herramientas de trabajo a menos que esté desesperado por dinero rápido."
      },
      "Cinta borrada": { 
        type: "sensorial", 
        description: "Las cámaras de seguridad no grabaron nada entre las 2:00 y 3:00 AM.",
        tags: ["seguridad", "robo"],
        ponderText: "Un apagón selectivo. Quien hizo esto conocía el sistema y tenía acceso."
      },
      "Registro de acceso": {
        type: "objeto",
        description: "Log del sistema: Solo las tarjetas de Miller y Sarah se usaron anoche.",
        tags: ["seguridad", "sospechoso"],
        ponderText: "Si no hubo entradas forzadas y solo ellos entraron, el círculo se cierra."
      },
      "Audio extraño": {
        type: "sensorial",
        description: "Un archivo MP3 oculto en el PC de seguridad: 'efectos_fantasma.mp3'.",
        tags: ["tecnico", "pista"],
        ponderText: "Alguien reprodujo esto por los altavoces para asustar a Miller."
      },
      
      // Falsos / Teorías iniciales
      "Fantasma del museo": { 
        type: "falso", 
        description: "La teoría del guardia. Ruidos de cadenas y lamentos.",
        tags: ["fantasma"],
        ponderText: "Una explicación conveniente. Demasiado teatral."
      },
      
      // Deducidos
      "Distracción grabada": {
        type: "deducido",
        description: "El 'fantasma' fue un audio reproducido para manipular al guardia.",
        tags: ["teoria", "metodo"]
      },
      "Robo interno": { 
        type: "deducido", 
        description: "El borrado de cintas y el registro de acceso confirman que fue alguien del personal.",
        tags: ["teoria", "robo"]
      },
      "El Cambiazo": { 
        type: "deducido", 
        description: "El disolvente sugiere que el artefacto fue manipulado o reemplazado antes del robo.",
        tags: ["teoria", "metodo"]
      },
      "Móvil económico": { 
        type: "deducido", 
        description: "Sarah está empeñando su sustento. Necesita liquidez ya.",
        tags: ["teoria", "movil"]
      }
    },
    suspects: [
      {
        name: "Miller, el guardia",
        description: "Asustadizo, pero no es tonto. Alguien usó sus miedos contra él.",
        suspicionLevel: 1,
        associatedConcepts: ["Fantasma del museo"]
      },
      {
        name: "Sarah, la restauradora",
        description: "Profesional y fría. Quizás demasiado fría para haber perdido una obra maestra.",
        suspicionLevel: 2,
        associatedConcepts: []
      }
    ],
    locations: [
      { name: "Vestíbulo Principal", description: "El centro del museo.", totalProgress: 1 },
      { name: "Sala de Exhibición", description: "Donde ocurrió el crimen.", totalProgress: 3 },
      { name: "Cuarto de Seguridad", description: "Monitores y cafetería.", totalProgress: 3 },
      { name: "Laboratorio de Restauración", description: "Olor a químicos y herramientas.", totalProgress: 2 },
      { name: "Sótano", description: "Oscuro y húmedo.", totalProgress: 2 }
    ],
    combinations: [
      {
        requires: ["Cinta borrada", "Registro de acceso"],
        result: "Robo interno",
        description: "Acceso exclusivo y sabotaje de seguridad. Fue uno de ellos."
      },
      {
        requires: ["Fantasma del museo", "Audio extraño"],
        result: "Distracción grabada",
        description: "El fantasma era digital. Una cortina de humo perfecta."
      },
      {
        requires: ["Olor a disolvente", "Vitrina destrozada"],
        result: "El Cambiazo",
        description: "El olor sugiere que usaron químicos para envejecer una copia o despegar el original."
      },
      {
        requires: ["Recibo de empeño", "Robo interno"],
        result: "Móvil económico",
        description: "Sarah necesitaba dinero y tenía el acceso. La ecuación es simple."
      }
    ],
    endings: [],
    scenes: {
      "intro": {
        location: "hall",
        text: `
          <p><strong>09:00 AM. Museo de Historia.</strong></p>
          <p>El Director Blackwood no está para bromas. "El 'Ojo de Ra' se esfumó. Miller balbucea sobre fantasmas, pero yo pago por seguridad, no por cuentos de terror. Encuentra mi joya o al culpable."</p>
        `,
        notes: ["El 'Ojo de Ra' desapareció anoche.", "Miller afirma que fue un fantasma."],
        choices: [
          { text: "Comenzar investigación", next: "hub" }
        ]
      },
      "hub": {
        location: "hall",
        text: `
          <p>Estás en el Vestíbulo Principal. Todo parece tranquilo, demasiado tranquilo para una escena del crimen.</p>
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
          <p>La sala está acordonada. El pedestal vacío se burla de la seguridad del museo.</p>
        `,
        choices: [
          { text: "Examinar la vitrina", next: "exhibit-case", timeCost: 15 },
          { text: "Oler el aire", next: "exhibit-smell", timeCost: 5 },
          { text: "Volver al vestíbulo", next: "hub", timeCost: 5 }
        ]
      },
      "exhibit-case": {
        location: "exhibit",
        text: `
          <p>Cristales rotos hacia afuera. Clásico. Quien hizo esto quería que pareciera una entrada forzada, pero olvidó la física básica.</p>
        `,
        reward: ["Vitrina destrozada"],
        locationProgress: { location: "Sala de Exhibición", progressGain: 1 },
        choices: [{ text: "Continuar", next: "exhibit-room" }]
      },
      "exhibit-smell": {
        location: "exhibit",
        text: `
          <p>Un olor acre te golpea la nariz. Acetona industrial. Demasiado fuerte para ser un limpiador estándar.</p>
        `,
        reward: ["Olor a disolvente"],
        locationProgress: { location: "Sala de Exhibición", progressGain: 1 },
        choices: [{ text: "Continuar", next: "exhibit-room" }]
      },
  
      // --- CUARTO DE SEGURIDAD ---
      "security-room": {
        location: "security",
        meetSuspects: ["Miller, el guardia"],
        text: `
          <p>El reino de Miller. Pantallas parpadeantes y tazas de café vacías.</p>
        `,
        choices: [
          { text: "Interrogar a Miller sobre el 'fantasma'", next: "security-talk", timeCost: 10 },
          { text: "Revisar grabaciones de seguridad", next: "security-tapes", timeCost: 10 },
          { text: "Revisar logs del sistema y audio", next: "security-logs", timeCost: 15 },
          { text: "Volver al vestíbulo", next: "hub", timeCost: 5 }
        ]
      },
      "security-talk": {
        location: "security",
        text: `
          <p>"¡Se lo digo, detective! Sonaba como si estuviera en todas partes a la vez. Cadenas, lamentos... y luego las luces se fueron. No me pagan lo suficiente para luchar contra espectros."</p>
        `,
        reward: ["Fantasma del museo"],
        suspectAdjustments: [{ name: "Miller, el guardia", change: 1 }],
        choices: [{ text: "Continuar", next: "security-room" }]
      },
      "security-tapes": {
        location: "security",
        text: `
          <p>Las cámaras 3 y 4 (Sala de Exhibición) están en negro de 02:00 a 03:00. No hay estática, simplemente fueron apagadas.</p>
        `,
        reward: ["Cinta borrada"],
        notes: ["Cámaras apagadas manualmente."],
        locationProgress: { location: "Cuarto de Seguridad", progressGain: 1 },
        choices: [{ text: "Continuar", next: "security-room" }]
      },
      "security-logs": {
        location: "security",
        text: `
          <p>Te sientas en la terminal. Dos hallazgos interesantes:</p>
          <p>1. Registro de puertas: Solo las tarjetas de Miller y Sarah se usaron anoche.</p>
          <p>2. Un archivo 'ghost_sfx.mp3' ejecutado a las 02:05 AM en el sistema de megafonía.</p>
        `,
        reward: ["Registro de acceso", "Audio extraño"],
        notes: ["El fantasma fue una grabación.", "Solo Miller y Sarah entraron."],
        locationProgress: { location: "Cuarto de Seguridad", progressGain: 2 },
        choices: [{ text: "Interesante...", next: "security-room" }]
      },
  
      // --- LABORATORIO ---
      "lab-room": {
        location: "lab",
        meetSuspects: ["Sarah, la restauradora"],
        text: `
          <p>El laboratorio de Sarah. Ordenado, meticuloso, estéril.</p>
        `,
        choices: [
          { text: "Hablar con Sarah", next: "lab-talk", timeCost: 10 },
          { text: "Revisar la papelera discretamente", next: "lab-trash-pay", timeCost: 5 },
          { text: "Presionar sobre el disolvente (Requiere concepto)", next: "lab-pressure", requires: ["Olor a disolvente"], timeCost: 10 },
          { text: "Volver al vestíbulo", next: "hub", timeCost: 5 }
        ]
      },
      "lab-talk": {
        location: "lab",
        text: `
          <p>Sarah limpia una lente con calma forzada. "Miller ve fantasmas en su propia sombra. Yo trabajo con hechos, detective. Y el hecho es que la joya no está."</p>
        `,
        suspectAdjustments: [{ name: "Sarah, la restauradora", change: 1 }],
        choices: [{ text: "Continuar", next: "lab-room" }]
      },
      "lab-trash-pay": {
        location: "lab",
        text: `
          <p>Entre virutas de madera encuentras un papel arrugado. No es basura, es un recibo de empeño reciente. Ha empeñado su propio microscopio de precisión.</p>
        `,
        reward: ["Recibo de empeño"],
        notes: ["Sarah empeñó sus herramientas de trabajo."],
        locationProgress: { location: "Laboratorio de Restauración", progressGain: 2 },
        choices: [{ text: "Guardar recibo", next: "lab-room" }]
      },
      "lab-pressure": {
        location: "lab",
        text: `
          <p>Mencionas el olor a acetona en la escena. Sarah se tensa visiblemente. "Es un museo, detective. Usamos químicos. ¿Va a arrestarme por limpiar cosas?"</p>
          <p>Su defensa es rápida. Demasiado rápida.</p>
        `,
        suspectAdjustments: [{ name: "Sarah, la restauradora", change: 2 }],
        choices: [{ text: "Continuar", next: "lab-room" }]
      },
  
      // --- SÓTANO ---
      "basement-door": {
        location: "basement",
        text: `
          <p>La puerta del sótano. Acceso restringido.</p>
        `,
        choices: [
          { text: "Forzar la cerradura", next: "basement-enter", timeCost: 15 }, 
          { text: "Pedir llave a Miller", next: "basement-key", timeCost: 5 },
          { text: "Volver", next: "hub", timeCost: 5 }
        ]
      },
      "basement-key": {
        location: "security",
        text: `
          <p>Miller te entrega la llave temblando. "Si oye cadenas... corra."</p>
        `,
        choices: [{ text: "Entrar al sótano", next: "basement-enter" }]
      },
      "basement-enter": {
        location: "basement",
        text: `
          <p>Humedad y polvo. Al fondo, una ventana a nivel de calle.</p>
        `,
        choices: [
          { text: "Examinar ventana", next: "basement-window", timeCost: 10 },
          { text: "Examinar suelo", next: "basement-floor", timeCost: 10 },
          { text: "Volver", next: "hub", timeCost: 5 }
        ]
      },
      "basement-window": {
        location: "basement",
        text: `
          <p>Abierta. Pero el polvo en el alféizar exterior está intacto. Nadie entró por aquí. Fue abierta desde dentro para simular una entrada.</p>
        `,
        reward: ["Ventana del sótano"],
        locationProgress: { location: "Sótano", progressGain: 1 },
        choices: [{ text: "Continuar", next: "basement-enter" }]
      },
      "basement-floor": {
        location: "basement",
        text: `
          <p>Huellas de barro. Van DE la ventana HACIA la escalera. Quien lo hizo trajo el barro en sus zapatos para dejar un rastro falso.</p>
        `,
        reward: ["Huellas de barro"],
        locationProgress: { location: "Sótano", progressGain: 1 },
        choices: [{ text: "Continuar", next: "basement-enter" }]
      },
  
      // --- DEDUCCIONES Y FINAL ---
      "deduction-room": {
        location: "hall",
        text: `
          <p>Tienes las piezas. ¿Quién orquestó esta farsa?</p>
        `,
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
          <p>El Director te mira incrédulo. "Contraté a un detective, no a un cazafantasmas". Te despide en el acto.</p>
          <p><strong>FINAL MALO: RIDÍCULO PÚBLICO</strong></p>
        `,
        choices: [{ text: "Menú Principal", next: "case-selector" }]
      },
      "accuse-miller": {
        location: "hall",
        text: `
          <p>Acusas a Miller. La policía encuentra el archivo de audio en el PC, pero Miller no sabe ni usar el correo electrónico. Fue incriminado, y el verdadero culpable escapó.</p>
          <p><strong>FINAL REGULAR: INJUSTICIA</strong></p>
        `,
        choices: [{ text: "Menú Principal", next: "case-selector" }]
      },
      "accuse-sarah": {
        location: "hall",
        text: `
          <p>Miras a Sarah. Ella mantiene la compostura.</p>
        `,
        choices: [
          { 
            text: "Presentar prueba del móvil (Recibo + Robo interno)", 
            next: "sarah-confession", 
            requires: ["Móvil económico"] 
          },
          { 
            text: "Desmontar la coartada del fantasma (Distracción grabada)", 
            next: "sarah-confession-ghost", 
            requires: ["Distracción grabada"] 
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
          <p>"¿Tiene alguna prueba real o solo conjeturas?" El Director interviene antes de que te demanden. Has fallado.</p>
          <p><strong>FINAL FALLIDO: FALTA DE EVIDENCIA</strong></p>
        `,
        choices: [{ text: "Menú Principal", next: "case-selector" }]
      },
      "sarah-confession": {
        location: "hall",
        text: `
          <p>Muestras el recibo de empeño. "Empeñaste tus herramientas. Estabas desesperada". Sarah baja la mirada. "Iba a recuperarlas con el dinero de la venta... Nadie tenía que salir herido".</p>
          <p><strong>FINAL PERFECTO: MOTIVO REVELADO</strong></p>
        `,
        choices: [{ text: "Menú Principal", next: "case-selector" }]
      },
      "sarah-confession-ghost": {
        location: "hall",
        text: `
          <p>Revelas que el fantasma era una grabación. "Miller era fácil de asustar", admite Sarah con frialdad. "Fue una distracción elegante, ¿no cree?".</p>
          <p><strong>FINAL BUENO: MISTERIO RESUELTO</strong></p>
        `,
        choices: [{ text: "Menú Principal", next: "case-selector" }]
      }
    }
};
