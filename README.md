"# M.e.a.l."
File "appunti" contiene alcuni appunti che ho preso a lezione che possono essere utili sia lato server che client. Sono un pò di cose in generale, ti consiglio di dargli una letta prima di iniziare a lavorare

Qui sotto alcuni link del codice di extrategy che ci potrebbero essere utili:

--Codice angular, prima lezione, senza server : https://github.com/e-xtrategy/unicam-angularjs
--Codice angular ultima lezione, progetto diverso da quello sopra(fa riferimento a un server indicato nel readme del progetto): https://github.com/De-Lac/AngularJs_client_example
--Codice server: https://github.com/De-Lac/NodeJs_server_examaple

Struttura cartelle: https://code.tutsplus.com/it/tutorials/introduction-to-the-mean-stack--cms-19918


# M.e.a.L. (Management Exchange And Loan)
Piattaforma sviluppata con lo stack Mean per lo scambio di denaro e la possibilità di ricevere e fare prestiti. Tecnologia utilizzate:
- autenticazione JWT
- Middleware per controllo ruolo sulle route Admin
- Mongoose per gli schemi DB
- Promesse con il modello "q"
- Organizzazione route divisa in diversi Router di Express


# ChangeLog
- 14/02/2018 -- Inserimento controllo degli utenti attraverso carta di identità


# API esposte dal server:

/     
GET   /  
POST  /

/admin  (richiesto ruolo admin)  
GET   /admin/users  
GET   /admin/setup  

/api  
POST  /api/signup  
POST  /api/authenticate  


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
--- index.js                / /file principale da eseguire
--- package.js
--+ routes
  |---- db-utilities.js      //funzioni condivise tra tutti, per interagire con il db
  |--+ admin
     |--- admin-index.js     //file principale del modulo Admin
     |--- admin-utilities.js //funzioni del modulo Admin       
  |--+ api  
     |--- api-index.js       //file principale del modulo Api
     |--- api-utilities.js   //funzioni del modulo Api
--+ models                   //schemi modelli Mongoose
  |--- User.js
```

Prima di avviare il server, installare le dipendenze con il comando  
`npm install`

poi avviarlo con il comando  
`node main.js`

oppure installate [https://github.com/foreverjs/forever](forever), per riavviare in automatico Node dopo una modifica, o dopo un crash. (-w sta per watch, cioè controlla se sono state salvate modifiche)  
`forever -w start index.js`

Per utilizzare il login attraverso Facebook occorre creare nella cartella principale il file keys.js con questo contenuto:
module.exports =
{
    'FACEBOOK_APP_ID':   'app id',
    'FACEBOOK_APP_SECRET': 'app secret code'
};
Per ottenere i codici bisogna crearsi un'acount facebook developer, creare una nuova app e a quel punto si otterranno i due codici necessari al login tramite facebook.


# App deployata su Heroku
https://m-e-a-l.herokuapp.com/
Per effettuare il login tramite facebook bisogna usare l'utente di prova. 
Email: test_fikmgrd_utente@tfbnw.net 
Password: 1qa2wszx


