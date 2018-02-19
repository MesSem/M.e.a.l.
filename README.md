# M.e.a.L. (Management Exchange And Loan)
Piattaforma sviluppata con lo stack Mean per lo scambio di denaro e la possibilità di ricevere e fare prestiti. Tecnologia utilizzate:
- autenticazione JWT
- Middleware per controllo ruolo sulle route Admin
- Mongoose per gli schemi DB
- Promesse con il modello "q"
- Organizzazione route divisa in diversi Router di Express

# User Story
Indicate dalla traccia:
- come utente voglio poter accedere ad un’area privata tramite username e password
- come utente voglio poter inviare del denaro ad un altro utente
- come utente voglio poter richiedere un prestito P2P dentro l’app rispettando le leggi italiane
- come utente voglio poter investire in un prestito chiesto da un altro utente
- come admin voglio poter moderare le richieste di prestito

Scelte dagli svilupparori del progetto:

- come utente voglio chedere del denaro ad un altro utente
- come utente posso visualizzare il profilo degli altri utenti con i progetti/richieste di prestito create dagli altri utenti
- come utente posso lasciare dei commenti sui progetti/richieste di prestito degli altri per fare domande o dare un giudizio
- come utente posso ricevere delle notifiche sull'anamento della mia richiesta di prestito, commenti ricevuti o altre informazioni
- come utente posso entrare nel sistema creando un utente all'interno del sistema o attraverso il social network Facebook

Oltre a queste user story la piattaforma permette agli utenti di modificare i propri progetti, tenerne traccia. Gli utente non loggati nel sistema possono solo visualizzare alcune richieste di prestito pubblici giusto per avere un'idea del sistema.


# ChangeLog
- 14/02/2018 -- Inserimento controllo degli utenti attraverso carta di identità


# Messaggi restituiti dalle API

Le API restituiscono un messaggio strutturato nel seguente modo
- caso di successo
`{success: true, message: 'operazione completata',  data: {'token':'494jti4944'}}`
- caso di errore
`{ success: false, code: 'ERR_API_WRONG_PSW', message: 'autenticazione fallita', error:"ulteriori informazioni, solo in fase di sviluppo" }`



# Codici Errore restituiti dal server
- ERR_API_NOT_FOUND - l'elemento cercato non esiste sul db
- ERR_API_WRONG_PSW - autenticazione fallita
- ERR_API_UNAUTHORIZED - autorizzazione non adeguata per accedere all'API
- ERR_JWT_TOKEN_NOT_FOUND - token jwt non presente nella richiesta di una pagina per utenti registrati
- ERR_TOKEN_EXPIRED - token jwt scaduto
- ERR_ELEMENT_NOT_FOUND - elmento non trovato nel server
- ERR_DATABASE_OPERATION - errore generico nell'interazione con il database
- ERR_INVALID_REQUEST - richiesta non valida
- ERR_OPERATION_UNAUTHORIZED - operazione non autorizzata all'utente


# Struttura file del server
```
--- main.js                 //file principale da eseguire
--- package.json            
--- bower.json
--- app.js                  //file che continee tutte le configurazioni dell'applicazione web
--+ server
  |--+ models                //schemi modelli Mongoose
     |--genericData.js      
     |--project.js          
     |--transaction.js      
     |--user.js
  |---- auth.js      //funzioni condivise tra tutti, per l'autenticazione degli utenti
  |---- config.js      //funzioni condivise tra tutti, per parametri di configurazione
  |---- errorCodes.js      //funzioni condivise tra tutti, per i codici di errore
  |---- utils.js      //funzioni condivise tra tutti, per alcuni metodi utili in diverse parti del software
  |--+ routes 
     |--+ admin
        |--- admin.js     //file principale del modulo Admin    
     |--+ api  
        |--- api.js       //file principale del modulo Api
     |--+ user  
        |--- user.js       //file principale del modulo User
--+ app
  |---- app.config.js
  |---- app.css
  |---- app.service.js      //funzioni di servizio utilizzate nell'app
  |---- index.html
  |--+ uploads              //cartella non presente su git ma creata durante l'esecuzione dell'app per le immagini
     |--+ idProgetto
        |---- immagine.jpg 
  |--+ modules
     |--+ components
        |--+ login          //non inserito dentro le pagine per lasciarlo distaccato e dare la possibilità di gestirlo in diverse modalità
            |---- login.component.js
            |---- login.template.js
     |--+ elements
        |---- project.template.html  //template del progetto utilizzati nelle pagine e nei widget
     |--+ pages
        |--+ nome-pagina    //pagine dell'applicazione
           |---- nome-pagina.component.js
           |---- nome-pagina.template.html
     |--+ widgets           //elementi della pagina profilo, distaccati dal contenitore e riutilizzabili altrove
        |--+ nome-widget
           |---- nome-widget.component.js
           |---- nome-widget.template.html
```

Prima di avviare il server, installare le dipendenze con il comando  
`npm install`
Verranno installate anche le dipendenze di bower

poi avviarlo con il comando  
`npm start`
Verrà avviato node e impostato in modalità "production"

oppure installate [https://github.com/foreverjs/forever](forever), per riavviare in automatico Node dopo una modifica, o dopo un crash. (-w sta per watch, cioè controlla se sono state salvate modifiche)  
`forever -w start index.js`

Per utilizzare il login attraverso Facebook occorre creare nella cartella principale il file keys.js con questo contenuto:
'''
module.exports =
{
    'FACEBOOK_APP_ID':   'app id',
    'FACEBOOK_APP_SECRET': 'app secret code'
};
'''
Oppure creare due variabili d'ambiente con gli stessi nomi (su Heroku abbiamo fatto così).

Per ottenere i codici bisogna crearsi un'acount facebook developer, creare una nuova app e a quel punto si otterranno i due codici necessari al login tramite facebook.


# App deployata su Heroku
https://m-e-a-l.herokuapp.com/

Per utilizzare le api di Facebook ho creato un'app all'interno di Facebook developer. Dato che è un progetto scolastico non ho reso pubblica l'app, perciò non è possibile loggarsi nel sistema attraverso un normale account Facebook ma bisogna utilizzare l'account Facebook di test:
- Email: test_fikmgrd_utente@tfbnw.net 
- Password: 1qa2wszx

Utente admin all'interno di Heroku per visualizzare le pagine disponibili solo all'admin:
- MEALMEAL
- password

# Autori
- **Giacomo Natali**
- **Simone Morettini**

# Documentazione
- Video di presentazione: https://youtu.be/afzc5pgno-s

- Documento utilizzato nella presentazione: https://docs.google.com/presentation/d/1T5B6VX0HsEnwvVV2GgSUWQkwR2mhBwqzvgcT68O9Log


