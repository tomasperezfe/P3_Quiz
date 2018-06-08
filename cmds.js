const model = require('./model');

const { log, biglog, errorlog, colorize } = require("./out");


//Muestra la ayuda
exports.helpCmd = rl => {
    log("Comandos");
    log(" h|help - Muestra esta ayuda.");
    log(" list - listar los quizzes existentes");
    log(" show <id> - Muestra la pregunta y la respuesta el quiz indicado ");
    log(" add - Añadir un nuevo quiz interactivamente");
    log(" delete <id> - Borrar el quiz indicado");
    log(" edit <id> - Editar el quiz indicado");
    log(" test <id> - Probar el quiz indicado");
    log(" p|play - Jugar a preguntar aleatoriamente todos los quizzes");
    log(" credits - Creditos.");
    log("q|quit - Salir del programa");
    rl.prompt();

};
//Lista los quizzes
exports.listCmd = rl => {

    model.getAll().forEach((quiz, id) => {
        log(`  [${colorize(id, 'magenta')}]: ${quiz.question} `);
    });

    rl.prompt();
};

//Muestra el quiz indicado en el parametro: pregunta y respuesta
exports.showCmd = (rl,id) => {

    if (typeof id === "undefined") {
        errorlog(`Falta el parametro id.`);

    } else {
        try {
            const quiz = model.getByIndex(id);
            log(`[${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);

        } catch(error) {
            errorlog(error.message);
        }
    }

    rl.prompt();
};

//Añade un nuevo quizz al modelo
exports.addCmd = rl => {

    rl.question(colorize('Introduzca una pregunta: ', 'red'), question => {
        rl.question(colorize('Introduzca la respuesta: ', 'red'), answer => {
            model.add(question, answer);
            log(` ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
            rl.prompt();
        });
    });
};

//Borra un quiz
exports.deleteCmd = (rl,id) => {
    if (typeof id === "undefined") {
        errorlog(`Falta el parametro id.`);

    } else {
        try {
             model.deleteByIndex(id);
            

        } catch (error) {
            errorlog(error.message);
        }
    }

    rl.prompt();
};

//Edita un quiz del modelo
exports.editCmd = (rl, id) => {
    if (typeof id === "undefined") {
        errorlog(`Falta el parametro id.`);

    } else {
        try {

            const quiz = model.getByIndex(id);
            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)}, 0);
            rl.question(colorize('Introduzca una pregunta: ', 'red'), question => {
                process.stdout.isTTY && setTimeout(() => { rl.write(quiz.answer) }, 0);
                    rl.question(colorize('Introduzca la respuesta: ', 'red'), answer => {
                     model.update(id, question, answer);
                     log(` 'Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} `);
                        rl.prompt();
                    });
                });
        } catch (error) {
            errorlog(error.message);
            rl.prompt();
        }
    }
};

//Hace una pregunta del quiz
exports.testCmd = (rl, id) => {
    if (typeof id === "undefined") {
        errorlog(`Debe introducir el parametro id.`);
        rl.prompt();
    } else {
        try {
            const quiz = model.getByIndex(id);
            rl.question(colorize(`${quiz.question}? `, 'blue'), respuesta => {
                if (respuesta.toLowerCase().trim() === quiz.answer.toLowerCase().trim()) {
                    log(`Su respuesta es:`);
                    biglog('CORRECTA', 'green');
        }else {
            log(`Su respuesta es:`);
            biglog('INCORRECTA', 'red');
    }
    rl.prompt();
});
} catch (error) {
    errorlog(error.message);
    rl.prompt();
}
};


    
};

//Pregunta todos los quizes existentes en orden aleatorio
exports.playCmd = rl => {
    let puntos = 0;
    let aResolver = [];
    model.getAll().forEach((quiz, id) => {
        aResolver.push(id);
    });
    const playF= () => {
        if (aResolver.length === 0) {
            errorlog(`No hay mas preguntas`);
            log(`Fin del juego: ${colorize(puntos, 'green')} aciertos`);
            rl.prompt();
        
    }else {
        var random = Math.floor(Math.random() * aResolver.length);
        var randomId = aResolver[random];
    
    let quiz = model.getByIndex(randomId);
    rl.question(colorize(`${quiz.question}? `, 'blue'), respuesta => {

        if (respuesta.toLowerCase().trim() === quiz.answer.toLowerCase().trim()) {
            biglog('CORRECTO', 'green');
            puntos++;

            log(`CORRECTO - Lleva  ${colorize(puntos, 'green')} aciertos.`);
            aResolver.splice(random, 1);

            playF();
        } else {
            log(`Su respuesta es:`);
            biglog('INCORRECTA', 'red');
            log(`GAME OVER. Aciertos: ${colorize(puntos, 'green')} `);
            rl.prompt();
        }
    });
}
}
playF();
};

//Muestra el autor de la practica
exports.creditsCmd = rl => {
    log('Autor de la practica:');
    log('Tomas Perez Fernandez');
    rl.prompt();
};

//Terminar el programa
exports.quitCmd = rl => {
    rl.close();
}