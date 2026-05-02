(function(){
    emailjs.init("L67d0KsHzyj4mLzXc");
})();

document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {

        const DELAI_ANTI_SPAM = 30 * 60 * 1000; // 30 minutes

        function ask(question, validator = null, transform = null) {
            let value;

            while (true) {
                value = prompt(question);

                if (value === null || value.trim() === "") {
                    alert("⚠️ Annulation du message");
                    throw "cancel";
                }

                value = value.trim();

                if (transform) {
                    value = transform(value);
                }

                if (!validator || validator(value)) {
                    return value;
                }

                alert("❌ Format invalide, veuillez réessayer.");
            }
        }

        // 🔤 Normalisation des noms
        function normalizeName(str) {
            return str
                .toLowerCase()
                .split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
        }

        try {
            // ⛔ Anti-spam
            let lastSend = localStorage.getItem("lastEmailSend");

            if (lastSend) {
                let now = Date.now();
                let diff = now - parseInt(lastSend);

                if (diff < DELAI_ANTI_SPAM) {
                    let minutesRestantes = Math.ceil((DELAI_ANTI_SPAM - diff) / 60000);
                    alert("⏳ Vous devez attendre encore " + minutesRestantes + " minute(s) avant de renvoyer une demande.");
                    return;
                }
            }

            let nom = ask(
                "Entrez votre nom :",
                val => val.length >= 2,
                normalizeName
            );

            let prenom = ask(
                "Entrez votre prénom :",
                val => val.length >= 2,
                normalizeName
            );

            let telephone = ask(
                "Entrez votre numéro de téléphone (10 chiffres) :",
                val => /^[0-9]{10}$/.test(val)
            );

            let email = ask(
                "Entrez votre email :",
                val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
                val => val.toLowerCase()
            );

            let heure = ask("Date/heure souhaitée pour l'appel :");

            // ✅ RGPD - consentement obligatoire
            let consentement = confirm("J'accepte que mes données soient utilisées pour être recontacté.");

            if (!consentement) {
                alert("⚠️ Vous devez accepter le traitement des données pour envoyer la demande.");
                return;
            }

            let params = {
                nom: nom,
                prenom: prenom,
                telephone: telephone,
                email: email,
                heure: heure
            };

            emailjs.send("service_5ujz22w", "template_l3hpmob", params)
            .then(function(response) {

                // 💾 Sauvegarde anti-spam
                localStorage.setItem("lastEmailSend", Date.now().toString());

                alert("✅ Demande envoyée avec succès ! Nous ferons notre possible pour vous contacter à l'heure souhaitée.");

            }, function(error) {
                alert("❌ Erreur lors de l'envoi... Veuillez réessayer.");
                console.log(error);
            });

        } catch (e) {
            // arrêt silencieux
        }

    });
});