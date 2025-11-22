window.caseLibrary = window.caseLibrary || {};

window.caseLibrary.principal = {
  id: "principal",
  title: "Caso principal",
  synopsis: "Mara Lys desaparece tras cerrar la biblioteca; un mapa oculto y los túneles de correo tensan a Ashwick.",
  startScene: "square-arrival",
  scenes: {
      "square-arrival": {
        text: `
          <p>La niebla perla la Plaza de Ashwick. La archivera Mara Lys cerró la biblioteca anoche después de hora y nunca volvió a casa. Te llamaron porque coleccionas motivos, no recuerdos.</p>
          <p>Tu libreta está vacía y tus bolsillos también. Lo único que puedes cargar son los conceptos que detectes.</p>
        `,
        choices: [
          { text: "Inspeccionar los adoquines oscurecidos por la lluvia junto a la fuente", next: "square-footprints" },
          { text: "Escuchar los chismes de la vendedora de té", next: "square-rumor" },
          { text: "Ir a la Biblioteca", next: "library-entry" },
          { text: "Caminar hacia la Casa Antigua en la colina", next: "house-porch" },
          { text: "Presentar lo que sabes al alcalde ahora", next: "resolution" }
        ]
      },
      "square-footprints": {
        text: `
          <p>Te arrodillas junto al borde seco de la fuente. La lluvia conservó medias lunas de botas estrechas, girando una y otra vez. Quien estuvo aquí se movió despacio, esperando con una caja pesada.</p>
        `,
        reward: ["Patrón de huellas"],
        choices: [
          { text: "Volver al centro de la plaza", next: "square-arrival" },
          { text: "Llevar el patrón a los estantes de la biblioteca", next: "library-entry" },
          { text: "Seguir los arcos hacia la colina y la Casa Antigua", next: "house-porch" }
        ]
      },
      "square-rumor": {
        text: `
          <p>La vendedora de té te sirve una taza. "La bibliotecaria Inez cerró antes," susurra. "Dijo que la caldera perdía, pero la vi cargar una caja de madera cuesta arriba antes de que dieran las diez."</p>
        `,
        reward: ["Rumor sobre la bibliotecaria"],
        choices: [
          { text: "Ir directo a la Biblioteca", next: "library-entry" },
          { text: "Seguir el rumor hacia la Casa Antigua", next: "house-porch" },
          { text: "Quedarte en la plaza y pensar", next: "square-arrival" }
        ]
      },
      "library-entry": {
        text: `
          <p>El aire de la biblioteca huele a pino y papel añejo. La bibliotecaria Inez te mira por encima de sus gafas. "Ya le dije todo al sheriff", dice, demasiado rápido.</p>
        `,
        choices: [
          { text: "Preguntar a Inez por la última noche de Mara aquí", next: "library-ask" },
          { text: "Revisar tú mismo el libro de devoluciones", next: "library-log" },
          { text: "Observar las estanterías por rastros de polvo", next: "library-shelves" },
          { text: "Volver a la Plaza", next: "square-arrival" },
          { text: "Caminar hacia la Casa Antigua", next: "house-porch" },
          { text: "Presentar lo que sabes al alcalde", next: "resolution" }
        ]
      },
      "library-ask": {
        text: `
          <p>"Mara archivó las últimas donaciones y se fue", insiste Inez. Su tono es demasiado firme. Pasa páginas de un cuaderno en blanco como si fuera un escudo.</p>
        `,
        choices: [
          { text: "Insistir en por qué cerró la biblioteca antes", next: "library-contradiction", requires: ["Rumor sobre la bibliotecaria"] },
          { text: "Pedir ver el escritorio de Mara en busca de pistas", next: "library-shelves" },
          { text: "Volver al vestíbulo y vigilar las puertas", next: "library-entry" },
          { text: "Salir a la plaza para despejar la cabeza", next: "square-arrival" }
        ]
      },
      "library-contradiction": {
        text: `
          <p>Inez afirma que cerró a las diez en punto. Pero el libro de devoluciones en su mesa marca un registro a las 10:45. "Un viajero lo dejó por la ranura", tartamudea, aunque la letra es suya.</p>
        `,
        reward: ["Contradicción en la cronología"],
        choices: [
          { text: "Revisar la sala de lectura que evitó", next: "library-shelves" },
          { text: "Salir antes de que se recomponga", next: "square-arrival" },
          { text: "Ir a la Casa Antigua con esta contradicción en mente", next: "house-porch" },
          { text: "Llevar la contradicción al alcalde", next: "resolution" }
        ]
      },
      "library-log": {
        text: `
          <p>El libro de devoluciones huele a tinta fresca. Una entrada a las 10:45 dice "caja devuelta desde la colina", firmada con el trazo amplio de Inez. Una nota al margen en letra de Mara menciona "corriente en el sótano, el mapa no se mantiene seco".</p>
        `,
        choices: [
          { text: "Seguir la nota marginal hacia el sótano de la Casa Antigua", next: "house-porch" },
          { text: "Comparar las huellas con los pasillos polvorientos", next: "library-shelves" },
          { text: "Volver al vestíbulo", next: "library-entry" }
        ]
      },
      "library-shelves": {
        text: `
          <p>La sala de lectura está vacía. Un estante rodante queda ligeramente torcido. El polvo alrededor de sus ruedas traza un arco cerrado, como si alguien lo hubiera movido y devuelto.</p>
        `,
        choices: [
          { text: "Seguir el rastro curvo de polvo y mover el estante", next: "library-hiddenmap", requires: ["Patrón de huellas"] },
          { text: "Anotar los títulos y dirigirte a la Casa Antigua", next: "house-porch" },
          { text: "Volver al vestíbulo", next: "library-entry" }
        ]
      },
      "library-hiddenmap": {
        text: `
          <p>Detrás del estante hay un mapa enrollado, sellado con cera húmeda. Una línea roja de tiza conecta la biblioteca con la Casa Antigua y desciende hacia un sótano. Falta una esquina rasgada, como si alguien hubiera dejado la pieza gemela en otro lugar.</p>
        `,
        reward: ["Pista del mapa oculto"],
        choices: [
          { text: "Guardar la idea y dirigirte a la Casa Antigua", next: "house-porch" },
          { text: "Salir a la plaza para planear", next: "square-arrival" },
          { text: "Llevar tu prueba al alcalde", next: "resolution" }
        ]
      },
      "house-porch": {
        text: `
          <p>La Casa Antigua se inclina sobre el camino de la colina, las tablas del porche hinchadas por la lluvia. Cada ventana está cruzada con cinta. En algún lugar dentro, un farol se balancea y chirría.</p>
        `,
        choices: [
          { text: "Colarte por una ventana suelta hacia el salón", next: "house-parlor" },
          { text: "Golpear las tablas del porche y escuchar huecos", next: "house-creak" },
          { text: "Buscar la trampilla marcada en el mapa", next: "house-cellar", requires: ["Pista del mapa oculto"] },
          { text: "Volver a la Plaza", next: "square-arrival" },
          { text: "Regresar a la Biblioteca", next: "library-entry" }
        ]
      },
      "house-creak": {
        text: `
          <p>Presionas con el talón una tabla. Un golpe hueco responde cerca del escalón trasero, justo donde los arcos de lodo imitan el patrón que viste en la plaza. Alguien se plantó aquí, girando con peso, antes de meterse.</p>
        `,
        choices: [
          { text: "Trepar por la ventana hacia el salón", next: "house-parlor" },
          { text: "Volver a la plaza", next: "square-arrival" }
        ]
      },
      "house-parlor": {
        text: `
          <p>Dentro, el salón es un estudio de polvo y sombra. Los muebles reposan bajo sábanas, cada esquina sujeta con libros pesados. Un único farol lanza luz ámbar sobre un escritorio lleno de escamas de pegamento.</p>
        `,
        choices: [
          { text: "Registrar los cajones del escritorio en busca de restos", next: "house-desk" },
          { text: "Llamar suavemente a Mara", next: "house-call" },
          { text: "Arrastrarte hacia la junta del piso junto a la estufa", next: "house-cellar", requires: ["Pista del mapa oculto"] },
          { text: "Retroceder al exterior", next: "house-porch" }
        ]
      },
      "house-desk": {
        text: `
          <p>Encuentras una esquina de mapa rasgada sujeta bajo una piedra. La línea roja coincide con el fragmento de la biblioteca y apunta hacia una puerta de sótano. Una nota a lápiz dice: "Inez no me siguió. Escóndete hasta que alguien note el error en su historia".</p>
        `,
        reward: ["Pista del mapa oculto"],
        choices: [
          { text: "Seguir la flecha de tiza al sótano", next: "house-cellar", requires: ["Pista del mapa oculto"] },
          { text: "Guardar la idea y volver al salón", next: "house-parlor" },
          { text: "Salir y repensar en la plaza", next: "square-arrival" }
        ]
      },
      "house-call": {
        text: `
          <p>Tu voz se hunde en el papel pintado. Desde las tablas, un susurro: "Si tienes el mapa, sigue la flecha. Si no, deja que Inez crea que desaparecí".</p>
        `,
        choices: [
          { text: "Buscar de nuevo esa flecha", next: "house-desk" },
          { text: "Salir de la casa con inquietud", next: "square-arrival" }
        ]
      },
      "house-cellar": {
        text: `
          <p>Una escalera estrecha gime bajo tus pies. En el sótano, la luz del farol se acumula alrededor de pilas de libros. Mara sale detrás de un estante, dedo en los labios. "Inez vende el mapa a un promotor", dice. "Me escondí antes de que pudiera entregarlo."</p>
        `,
        choices: [
          { text: "Escoltar a Mara a la plaza bajo la lluvia", next: "resolution" },
          { text: "Exigir la historia completa antes de moverla", next: "cellar-explain" },
          { text: "Dejarla oculta y presentar el informe en solitario", next: "ending-cold" }
        ]
      },
      "cellar-explain": {
        text: `
          <p>Mara pasea sobre el piso de piedra. "Los túneles bajo la ciudad llevan correo viejo. El mapa muestra cada acceso. Inez mintió sobre su horario para mover el mapa a la Casa Antigua y pasarlo en silencio. Fingí mi desaparición para frenarla."</p>
        `,
        choices: [
          { text: "Llevarla directo con el alcalde y contar todo", next: "resolution" },
          { text: "Dejarla escondida y enfrentar sola a Inez", next: "ending-press", requires: ["Contradicción en la cronología"] },
          { text: "Salir y repensar en la plaza", next: "square-arrival" }
        ]
      },
      "resolution": {
        text: `
          <p>La noche cae sobre Ashwick. El alcalde espera en una oficina iluminada, pluma lista. La forma en que presentes el caso decidirá si termina como rumor o revelación.</p>
        `,
        choices: [
          { text: "Enviar un informe escaso de persona desaparecida y dejar el pueblo en silencio", next: "ending-cold" },
          { text: "Confrontar a la bibliotecaria Inez con su cronología rota", next: "ending-press", requires: ["Contradicción en la cronología"] },
          { text: "Guiar una búsqueda en los túneles usando la pista del mapa oculto", next: "ending-cellar", requires: ["Pista del mapa oculto"] },
          { text: "Combinar ambas pruebas y exponer todo el plan", next: "ending-true", requires: ["Pista del mapa oculto", "Contradicción en la cronología"] }
        ]
      },
      "ending-cold": {
        text: `
          <p>Presentas un informe con poco más que un rumor y papeles húmedos. El alcalde promete "investigar". Ashwick guarda sus secretos y el nombre de Mara se vuelve una advertencia susurrada sobre el té.</p>
          <p>Sin los conceptos adecuados, el misterio permanece cerrado.</p>
        `,
        choices: [
          { text: "Reiniciar la investigación", next: "restart" }
        ]
      },
      "ending-press": {
        text: `
          <p>Enfrentas a Inez con la contradicción del libro de devoluciones. Acorralada, admite que mintió sobre el horario pero insiste en que Mara solo huyó. Sin el rastro del mapa, el alcalde lo toma como torpeza, no sabotaje.</p>
          <p>Mara sigue escondida y los túneles permanecen sin sellar. La verdad queda a medias y tu caso también.</p>
        `,
        choices: [
          { text: "Reiniciar y buscar la pista que falta", next: "restart" }
        ]
      },
      "ending-cellar": {
        text: `
          <p>Guiado por la pista del mapa oculto, llevas al alcalde al sótano de la Casa Antigua. Está vacío; Mara se escapa por una salida lateral en cuanto oye funcionarios. Aseguras los túneles ante el promotor, pero sin una contradicción para culpar a Inez, el pueblo se encoge de hombros y sigue.</p>
          <p>La desaparición se vuelve historia de fantasmas; los túneles, un secreto vigilado.</p>
        `,
        choices: [
          { text: "Reiniciar e intentar confrontar la cronología", next: "restart" }
        ]
      },
      "ending-true": {
        text: `
          <p>Con el fragmento del mapa en mano y la contradicción horario registrada, guías al alcalde y a un ayudante hasta el sótano. Mara sale y muestra cómo Inez usó los túneles de correo para transportar el mapa. Entre la prueba y la testigo, Inez confiesa: planeaba vender las rutas a un promotor a cambio de fondos.</p>
          <p>El giro: Mara fingió su desaparición para que alguien notara la mentira. El pueblo protege sus rutas enterradas, el mapa vuelve al archivo, y tu inventario de conceptos parece la columna del caso.</p>
        `,
        choices: [
          { text: "Reiniciar para ver los otros hilos", next: "restart" }
        ]
      }
  }
};
