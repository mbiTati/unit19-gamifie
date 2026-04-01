"use client";
import React from "react";
import { loadLocks, isLocked, setTeacher } from "@/lib/lockManager";
import { useAuth } from "@/components/AuthProvider";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import { useState } from "react";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",GREEN="#16A34A",RED="#DC2626",ORANGE="#F97316",PURPLE="#7C3AED",TEAL="#0891B2",BLUE="#3B82F6";

const EX1_CODE=`import java.time.LocalDate;

// ═══════════════════════════════════
// CLASSE METIER : Emprunt
// ═══════════════════════════════════
public class Emprunt {
    private String nomEmploye;
    private String typeVelo;
    private LocalDate dateDebut;
    private LocalDate dateRetour; // null si en cours

    public Emprunt(String nomEmploye, String typeVelo, LocalDate dateDebut) {
        this.nomEmploye = nomEmploye;
        this.typeVelo = typeVelo;
        this.dateDebut = dateDebut;
        this.dateRetour = null;
    }

    // Getters
    public String getNomEmploye() { return nomEmploye; }
    public String getTypeVelo() { return typeVelo; }
    public LocalDate getDateDebut() { return dateDebut; }
    public LocalDate getDateRetour() { return dateRetour; }

    // Setter
    public void setDateRetour(LocalDate dateRetour) {
        this.dateRetour = dateRetour;
    }

    public boolean estEnCours() {
        return dateRetour == null;
    }

    @Override
    public String toString() {
        String statut = estEnCours() ? "EN COURS" : "Retourné le " + dateRetour;
        return nomEmploye + " | " + typeVelo + " | Début: " + dateDebut + " | " + statut;
    }
}

// ═══════════════════════════════════
// CLASSE GESTION (sans Scanner — testable avec JUnit)
// ═══════════════════════════════════
import java.util.LinkedList;
import java.util.ArrayList;

public class GestionVelos {
    private LinkedList<Emprunt> emprunts;

    public GestionVelos() {
        this.emprunts = new LinkedList<>();
    }

    // CREATE — ajouter un emprunt
    public void ajouterEmprunt(String nom, String typeVelo) {
        Emprunt e = new Emprunt(nom, typeVelo, LocalDate.now());
        emprunts.add(e);
    }

    // UPDATE — terminer un emprunt
    public void terminerEmprunt(String nom) {
        for (Emprunt e : emprunts) {
            if (e.getNomEmploye().equalsIgnoreCase(nom) && e.estEnCours()) {
                e.setDateRetour(LocalDate.now());
                return;
            }
        }
        throw new IllegalArgumentException("Aucun emprunt en cours pour : " + nom);
    }

    // READ — emprunts en cours
    public ArrayList<Emprunt> getEmpruntsEnCours() {
        ArrayList<Emprunt> enCours = new ArrayList<>();
        for (Emprunt e : emprunts) {
            if (e.estEnCours()) {
                enCours.add(e);
            }
        }
        return enCours;
    }

    // READ — tous les emprunts
    public LinkedList<Emprunt> getTousLesEmprunts() {
        return emprunts;
    }

    public int getNombreEmpruntsEnCours() {
        return getEmpruntsEnCours().size();
    }
}

// ═══════════════════════════════════
// MENU (avec Scanner — interaction utilisateur)
// ═══════════════════════════════════
import java.util.Scanner;

public class Menu {
    public static void main(String[] args) {
        GestionVelos gestion = new GestionVelos();
        Scanner sc = new Scanner(System.in);
        int choix;

        do {
            System.out.println("\\n=== Gestion Vélos ===");
            System.out.println("1. Ajouter un emprunt");
            System.out.println("2. Terminer un emprunt");
            System.out.println("3. Afficher emprunts en cours");
            System.out.println("0. Quitter");
            System.out.print("Choix : ");

            try {
                choix = sc.nextInt();
                sc.nextLine(); // vider le buffer
            } catch (Exception e) {
                System.out.println("Saisie invalide !");
                sc.nextLine();
                choix = -1;
                continue;
            }

            switch (choix) {
                case 1:
                    System.out.print("Nom employé : ");
                    String nom = sc.nextLine();
                    System.out.print("Type de vélo (VTT/Ville/Électrique) : ");
                    String type = sc.nextLine();
                    gestion.ajouterEmprunt(nom, type);
                    System.out.println("Emprunt ajouté !");
                    break;
                case 2:
                    System.out.print("Nom employé : ");
                    String nomRetour = sc.nextLine();
                    try {
                        gestion.terminerEmprunt(nomRetour);
                        System.out.println("Emprunt terminé !");
                    } catch (IllegalArgumentException e) {
                        System.out.println("Erreur : " + e.getMessage());
                    }
                    break;
                case 3:
                    var enCours = gestion.getEmpruntsEnCours();
                    if (enCours.isEmpty()) {
                        System.out.println("Aucun emprunt en cours.");
                    } else {
                        System.out.println("Emprunts en cours (" + enCours.size() + ") :");
                        for (var e : enCours) {
                            System.out.println("  " + e);
                        }
                    }
                    break;
                case 0:
                    System.out.println("Au revoir !");
                    break;
                default:
                    System.out.println("Choix invalide.");
            }
        } while (choix != 0);
        sc.close();
    }
}`;

const EX2_CODE=`import java.time.LocalDateTime;

// ═══════════════════════════════════
// CLASSE METIER : Intervention
// ═══════════════════════════════════
public class Intervention {
    private String nomClient;
    private String probleme;
    private String technicien;
    private LocalDateTime date;

    public Intervention(String nomClient, String probleme, String technicien) {
        this.nomClient = nomClient;
        this.probleme = probleme;
        this.technicien = technicien;
        this.date = LocalDateTime.now();
    }

    // Getters
    public String getNomClient() { return nomClient; }
    public String getProbleme() { return probleme; }
    public String getTechnicien() { return technicien; }
    public LocalDateTime getDate() { return date; }

    @Override
    public String toString() {
        return "[" + date.toLocalDate() + "] " + nomClient
            + " | " + probleme + " | Tech: " + technicien;
    }
}

// ═══════════════════════════════════
// CLASSE GESTION (sans Scanner — testable)
// ═══════════════════════════════════
import java.util.HashMap;
import java.util.ArrayList;

public class GestionInterventions {
    private HashMap<String, ArrayList<Intervention>> interventions;

    public GestionInterventions() {
        this.interventions = new HashMap<>();
    }

    // CREATE
    public void ajouter(String client, String probleme, String technicien) {
        Intervention i = new Intervention(client, probleme, technicien);
        if (!interventions.containsKey(client)) {
            interventions.put(client, new ArrayList<>());
        }
        interventions.get(client).add(i);
    }

    // READ — par client
    public ArrayList<Intervention> rechercherParClient(String nomClient) {
        if (!interventions.containsKey(nomClient)) {
            throw new IllegalArgumentException(
                "Client inconnu : " + nomClient);
        }
        return interventions.get(nomClient);
    }

    // READ — toutes
    public ArrayList<Intervention> afficherTout() {
        ArrayList<Intervention> toutes = new ArrayList<>();
        for (ArrayList<Intervention> liste : interventions.values()) {
            toutes.addAll(liste);
        }
        return toutes;
    }

    public int getNombreTotal() {
        int total = 0;
        for (ArrayList<Intervention> liste : interventions.values()) {
            total += liste.size();
        }
        return total;
    }

    public int getNombreClients() {
        return interventions.size();
    }
}

// ═══════════════════════════════════
// MENU (avec Scanner + try/catch)
// ═══════════════════════════════════
import java.util.Scanner;

public class Menu {
    public static void main(String[] args) {
        GestionInterventions gestion = new GestionInterventions();
        Scanner sc = new Scanner(System.in);
        int choix;

        do {
            System.out.println("\\n=== Suivi Interventions ===");
            System.out.println("1. Ajouter une intervention");
            System.out.println("2. Rechercher par client");
            System.out.println("3. Afficher toutes les interventions");
            System.out.println("0. Quitter");
            System.out.print("Choix : ");

            try {
                choix = sc.nextInt();
                sc.nextLine();
            } catch (Exception e) {
                System.out.println("Saisie invalide !");
                sc.nextLine();
                choix = -1;
                continue;
            }

            switch (choix) {
                case 1:
                    System.out.print("Nom client : ");
                    String client = sc.nextLine();
                    System.out.print("Nature du problème : ");
                    String pb = sc.nextLine();
                    System.out.print("Technicien assigné : ");
                    String tech = sc.nextLine();
                    gestion.ajouter(client, pb, tech);
                    System.out.println("Intervention enregistrée !");
                    break;
                case 2:
                    System.out.print("Nom client à rechercher : ");
                    String recherche = sc.nextLine();
                    try {
                        var resultats = gestion.rechercherParClient(recherche);
                        System.out.println("Interventions pour " + recherche
                            + " (" + resultats.size() + ") :");
                        for (var i : resultats) {
                            System.out.println("  " + i);
                        }
                    } catch (IllegalArgumentException e) {
                        System.out.println("Erreur : " + e.getMessage());
                    }
                    break;
                case 3:
                    var toutes = gestion.afficherTout();
                    if (toutes.isEmpty()) {
                        System.out.println("Aucune intervention.");
                    } else {
                        System.out.println("Toutes les interventions ("
                            + toutes.size() + ") :");
                        for (var i : toutes) {
                            System.out.println("  " + i);
                        }
                    }
                    break;
                case 0:
                    System.out.println("Au revoir !");
                    break;
                default:
                    System.out.println("Choix invalide.");
            }
        } while (choix != 0);
        sc.close();
    }
}`;

const EX3_CODE=`import java.time.LocalDate;

// ═══════════════════════════════════
// CLASSE METIER : Reservation
// ═══════════════════════════════════
public class Reservation {
    private String nomEmploye;
    private LocalDate date;
    private String heure;
    private String salle;

    public Reservation(String nomEmploye, LocalDate date, String heure, String salle) {
        this.nomEmploye = nomEmploye;
        this.date = date;
        this.heure = heure;
        this.salle = salle;
    }

    // Getters
    public String getNomEmploye() { return nomEmploye; }
    public LocalDate getDate() { return date; }
    public String getHeure() { return heure; }
    public String getSalle() { return salle; }

    @Override
    public String toString() {
        return salle + " | " + date + " " + heure + " | " + nomEmploye;
    }

    // Deux réservations sont identiques si même salle + date + heure
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Reservation)) return false;
        Reservation r = (Reservation) o;
        return salle.equals(r.salle) && date.equals(r.date) && heure.equals(r.heure);
    }
}

// ═══════════════════════════════════
// CLASSE GESTION (sans Scanner — testable)
// ═══════════════════════════════════
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Queue;
import java.util.ArrayList;

public class GestionSalles {
    private HashMap<String, LinkedList<Reservation>> salles;

    public GestionSalles() {
        this.salles = new HashMap<>();
    }

    // CREATE — réserver
    public void reserver(String nom, LocalDate date, String heure, String salle) {
        Reservation nouvelle = new Reservation(nom, date, heure, salle);

        if (!salles.containsKey(salle)) {
            salles.put(salle, new LinkedList<>());
        }

        // Vérifier doublon
        for (Reservation r : salles.get(salle)) {
            if (r.getDate().equals(date) && r.getHeure().equals(heure)) {
                throw new IllegalStateException(
                    "Salle " + salle + " déjà réservée le "
                    + date + " à " + heure + " par " + r.getNomEmploye());
            }
        }

        salles.get(salle).add(nouvelle);
    }

    // DELETE — annuler
    public void annuler(String nom, LocalDate date, String heure, String salle) {
        if (!salles.containsKey(salle)) {
            throw new IllegalArgumentException("Salle inconnue : " + salle);
        }

        LinkedList<Reservation> reservations = salles.get(salle);
        boolean removed = false;
        var iterator = reservations.iterator();
        while (iterator.hasNext()) {
            Reservation r = iterator.next();
            if (r.getNomEmploye().equalsIgnoreCase(nom)
                && r.getDate().equals(date)
                && r.getHeure().equals(heure)) {
                iterator.remove();
                removed = true;
                break;
            }
        }

        if (!removed) {
            throw new IllegalArgumentException(
                "Réservation non trouvée pour " + nom);
        }
    }

    // READ — disponibilités d'une salle pour un jour
    public ArrayList<String> getCreneauxReserves(String salle, LocalDate date) {
        ArrayList<String> creneaux = new ArrayList<>();
        if (salles.containsKey(salle)) {
            for (Reservation r : salles.get(salle)) {
                if (r.getDate().equals(date)) {
                    creneaux.add(r.getHeure() + " (par " + r.getNomEmploye() + ")");
                }
            }
        }
        return creneaux;
    }

    // READ — toutes les réservations d'une salle
    public LinkedList<Reservation> getReservations(String salle) {
        if (!salles.containsKey(salle)) {
            return new LinkedList<>();
        }
        return salles.get(salle);
    }

    public int getNombreSalles() {
        return salles.size();
    }
}

// ═══════════════════════════════════
// MENU (avec Scanner + validation)
// ═══════════════════════════════════
import java.util.Scanner;
import java.time.format.DateTimeParseException;

public class Menu {
    public static void main(String[] args) {
        GestionSalles gestion = new GestionSalles();
        Scanner sc = new Scanner(System.in);
        int choix;

        do {
            System.out.println("\\n=== Réservation Salles ===");
            System.out.println("1. Réserver une salle");
            System.out.println("2. Annuler une réservation");
            System.out.println("3. Vérifier disponibilités");
            System.out.println("0. Quitter");
            System.out.print("Choix : ");

            try {
                choix = sc.nextInt();
                sc.nextLine();
            } catch (Exception e) {
                System.out.println("Saisie invalide !");
                sc.nextLine();
                choix = -1;
                continue;
            }

            switch (choix) {
                case 1:
                    try {
                        System.out.print("Nom employé : ");
                        String nom = sc.nextLine();
                        System.out.print("Date (AAAA-MM-JJ) : ");
                        LocalDate date = LocalDate.parse(sc.nextLine());
                        System.out.print("Heure (ex: 14h00) : ");
                        String heure = sc.nextLine();
                        System.out.print("Salle (ex: Salle A) : ");
                        String salle = sc.nextLine();
                        gestion.reserver(nom, date, heure, salle);
                        System.out.println("Réservation confirmée !");
                    } catch (DateTimeParseException e) {
                        System.out.println("Format de date invalide !");
                    } catch (IllegalStateException e) {
                        System.out.println("Erreur : " + e.getMessage());
                    }
                    break;
                case 2:
                    try {
                        System.out.print("Nom employé : ");
                        String nom2 = sc.nextLine();
                        System.out.print("Date (AAAA-MM-JJ) : ");
                        LocalDate date2 = LocalDate.parse(sc.nextLine());
                        System.out.print("Heure : ");
                        String heure2 = sc.nextLine();
                        System.out.print("Salle : ");
                        String salle2 = sc.nextLine();
                        gestion.annuler(nom2, date2, heure2, salle2);
                        System.out.println("Réservation annulée !");
                    } catch (Exception e) {
                        System.out.println("Erreur : " + e.getMessage());
                    }
                    break;
                case 3:
                    try {
                        System.out.print("Salle : ");
                        String salleCheck = sc.nextLine();
                        System.out.print("Date (AAAA-MM-JJ) : ");
                        LocalDate dateCheck = LocalDate.parse(sc.nextLine());
                        var creneaux = gestion.getCreneauxReserves(salleCheck, dateCheck);
                        if (creneaux.isEmpty()) {
                            System.out.println("Salle " + salleCheck
                                + " entièrement disponible le " + dateCheck);
                        } else {
                            System.out.println("Créneaux réservés :");
                            for (var c : creneaux) {
                                System.out.println("  " + c);
                            }
                        }
                    } catch (DateTimeParseException e) {
                        System.out.println("Format de date invalide !");
                    }
                    break;
                case 0:
                    System.out.println("Au revoir !");
                    break;
                default:
                    System.out.println("Choix invalide.");
            }
        } while (choix != 0);
        sc.close();
    }
}`;

const EX4_CODE=`// ===================================================
// FICHIER 1 : Ticket.java
// ===================================================

public class Ticket {
    private int id;
    private String description;
    private String priorite; // "CRITIQUE", "NORMAL", "FAIBLE"
    private String demandeur;
    private boolean resolu;

    public Ticket(int id, String description, String priorite, String demandeur) {
        this.id = id;
        this.description = description;
        this.priorite = priorite;
        this.demandeur = demandeur;
        this.resolu = false;
    }

    public int getId() { return id; }
    public String getDescription() { return description; }
    public String getPriorite() { return priorite; }
    public String getDemandeur() { return demandeur; }
    public boolean isResolu() { return resolu; }
    public void setResolu(boolean resolu) { this.resolu = resolu; }

    @Override
    public String toString() {
        return "[#" + id + "] " + (resolu ? "RESOLU" : "OUVERT")
            + " | " + priorite + " | " + description
            + " | Demandeur: " + demandeur;
    }
}


// ===================================================
// FICHIER 2 : GestionTickets.java
// ===================================================

import java.util.HashMap;
import java.util.ArrayList;

public class GestionTickets {
    private HashMap<Integer, Ticket> tickets;
    private int compteurId; // AUTO-INCREMENT : compteur qui augmente a chaque creation

    public GestionTickets() {
        this.tickets = new HashMap<>();
        this.compteurId = 1; // Premier ticket aura l'id 1
    }

    /* ============================================
     * AUTO-INCREMENT en Java :
     * ============================================
     * En base de donnees (SQL), l'auto-increment est automatique.
     * En Java, on le simule avec un COMPTEUR :
     *
     * 1. Declarer un attribut : private int compteurId = 1;
     * 2. Utiliser compteurId comme id du nouvel objet
     * 3. Incrementer APRES la creation : compteurId++;
     *
     * Resultat :
     *   1er ticket -> id = 1, puis compteurId devient 2
     *   2eme ticket -> id = 2, puis compteurId devient 3
     *   etc.
     *
     * IMPORTANT : le compteur est dans la classe GESTION
     * (pas dans Ticket). C'est GestionTickets qui gere
     * les ids, pas le ticket lui-meme.
     *
     * Alternative : on pourrait utiliser tickets.size() + 1
     * mais cela pose probleme si on supprime un ticket
     * (l'id serait reutilise).
     * ============================================ */

    // P5 : throw si description vide ou priorite invalide
    public Ticket creerTicket(String description, String priorite, String demandeur) {
        if (description == null || description.trim().isEmpty()) {
            throw new IllegalArgumentException("La description ne peut pas etre vide !");
        }
        if (!priorite.equals("CRITIQUE") && !priorite.equals("NORMAL") && !priorite.equals("FAIBLE")) {
            throw new IllegalArgumentException(
                "Priorite invalide : " + priorite + " (attendu: CRITIQUE, NORMAL ou FAIBLE)");
        }
        // Utiliser le compteur actuel comme id
        Ticket t = new Ticket(compteurId, description, priorite, demandeur);
        // Stocker dans le HashMap avec l'id comme cle
        tickets.put(compteurId, t);
        // Incrementer APRES la creation (prochain ticket aura id+1)
        compteurId++;
        return t;
    }

    // P5 : throws Exception (checked) si id inexistant
    public void resoudreTicket(int id) throws Exception {
        if (!tickets.containsKey(id)) {
            throw new Exception("Ticket #" + id + " n'existe pas !");
        }
        Ticket t = tickets.get(id);
        if (t.isResolu()) {
            throw new IllegalStateException("Ticket #" + id + " est deja resolu !");
        }
        t.setResolu(true);
    }

    public ArrayList<Ticket> ticketsCritiques() {
        ArrayList<Ticket> critiques = new ArrayList<>();
        for (Ticket t : tickets.values()) {
            if (t.getPriorite().equals("CRITIQUE") && !t.isResolu()) {
                critiques.add(t);
            }
        }
        return critiques;
    }

    public ArrayList<Ticket> rechercherParDemandeur(String nom) {
        ArrayList<Ticket> resultats = new ArrayList<>();
        for (Ticket t : tickets.values()) {
            if (t.getDemandeur().equalsIgnoreCase(nom)) {
                resultats.add(t);
            }
        }
        return resultats;
    }

    public void statistiques() {
        int total = tickets.size();
        int resolus = 0;
        for (Ticket t : tickets.values()) {
            if (t.isResolu()) resolus++;
        }
        int ouverts = total - resolus;
        double pourcent = total > 0 ? (resolus * 100.0 / total) : 0;
        System.out.println("Total: " + total + " | Resolus: " + resolus
            + " | Ouverts: " + ouverts
            + " | Taux: " + String.format("%.1f", pourcent) + "%");
    }

    public int getTotal() { return tickets.size(); }

    /* ============================================
     * M4 : POURQUOI HashMap ?
     * - Acces direct par id : get(id) = O(1)
     * - Unicite des cles : impossible 2 tickets meme id
     * - Avec LinkedList, resoudreTicket(id) serait O(n)
     *
     * COMMENT ticketsCritiques() filtre :
     * Parcourt values(), garde priorite=CRITIQUE et !resolu
     *
     * Amelioration : HashMap<String, ArrayList<Ticket>>
     * (cle = demandeur) pour rechercherParDemandeur en O(1)
     * ============================================ */

    /* ============================================
     * D3 : COMPLEXITE
     * creerTicket()            : O(1) amorti - put()
     * resoudreTicket(id)       : O(1) - get() par cle
     * ticketsCritiques()       : O(n) - parcourt tout
     * rechercherParDemandeur() : O(n) - recherche par valeur
     * statistiques()           : O(n) - parcourt tout
     *
     * | Operation        | HashMap | LinkedList |
     * |----------------- |---------|----------- |
     * | resoudre par id  | O(1)    | O(n)       |
     * | creer            | O(1)    | O(1)       |
     * | filtrer critiques| O(n)    | O(n)       |
     * ============================================ */
}


// ===================================================
// FICHIER 3 : Menu.java
// ===================================================

import java.util.Scanner;

public class Menu {
    private GestionTickets gestion;

    public Menu(GestionTickets gestion) {
        this.gestion = gestion;
    }

    public void afficherMenu() {
        Scanner sc = new Scanner(System.in);
        int choix = 0;

        while (choix != 6) {
            System.out.println("\n=== SUPPORT IT - Tickets ===");
            System.out.println("1. Creer un ticket");
            System.out.println("2. Resoudre un ticket");
            System.out.println("3. Tickets critiques");
            System.out.println("4. Rechercher par demandeur");
            System.out.println("5. Statistiques");
            System.out.println("6. Quitter");

            // P5 : try/catch pour saisie du choix
            try {
                System.out.print("Choix : ");
                choix = Integer.parseInt(sc.nextLine());

                switch (choix) {
                    case 1:
                        // P5 : try/catch/finally
                        try {
                            System.out.print("Description : ");
                            String desc = sc.nextLine();
                            System.out.print("Priorite (CRITIQUE/NORMAL/FAIBLE) : ");
                            String prio = sc.nextLine().toUpperCase();
                            System.out.print("Demandeur : ");
                            String dem = sc.nextLine();
                            Ticket t = gestion.creerTicket(desc, prio, dem);
                            System.out.println("Ticket cree : " + t);
                        } catch (IllegalArgumentException e) {
                            System.out.println("Erreur : " + e.getMessage());
                        } finally {
                            // P5 : finally affiche le total apres chaque tentative
                            System.out.println("[Total tickets : " + gestion.getTotal() + "]");
                        }
                        break;

                    case 2:
                        // P5 : try/catch pour NumberFormatException + Exception
                        try {
                            System.out.print("ID du ticket : ");
                            int id = Integer.parseInt(sc.nextLine());
                            gestion.resoudreTicket(id);
                            System.out.println("Ticket #" + id + " resolu !");
                        } catch (NumberFormatException e) {
                            System.out.println("Erreur : entrez un nombre !");
                        } catch (Exception e) {
                            System.out.println("Erreur : " + e.getMessage());
                        }
                        break;

                    case 3:
                        var critiques = gestion.ticketsCritiques();
                        if (critiques.isEmpty()) {
                            System.out.println("Aucun ticket critique ouvert.");
                        } else {
                            System.out.println("Critiques (" + critiques.size() + ") :");
                            for (var tk : critiques) System.out.println("  " + tk);
                        }
                        break;

                    case 4:
                        System.out.print("Nom du demandeur : ");
                        var resultats = gestion.rechercherParDemandeur(sc.nextLine());
                        if (resultats.isEmpty()) {
                            System.out.println("Aucun ticket pour ce demandeur.");
                        } else {
                            System.out.println("Tickets (" + resultats.size() + ") :");
                            for (var tk : resultats) System.out.println("  " + tk);
                        }
                        break;

                    case 5:
                        gestion.statistiques();
                        break;

                    case 6:
                        System.out.println("Au revoir !");
                        break;

                    default:
                        System.out.println("Choix invalide.");
                }
            } catch (NumberFormatException e) {
                System.out.println("Erreur : entrez un nombre !");
            }
        }
        sc.close();
    }
}


// ===================================================
// FICHIER 4 : Main.java
// ===================================================

public class Main {
    public static void main(String[] args) {
        GestionTickets gestion = new GestionTickets();
        Menu menu = new Menu(gestion);
        menu.afficherMenu();
    }
}


// ===================================================
// FICHIER 5 : GestionTicketsTest.java (JUnit 5)
// ===================================================

import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class GestionTicketsTest {
    private GestionTickets gestion;

    @BeforeEach
    void setUp() {
        gestion = new GestionTickets();
    }

    @Test
    void testCreerTicketValide() {
        Ticket t = gestion.creerTicket("Ecran noir", "CRITIQUE", "Alice");
        assertEquals(1, t.getId());
        assertEquals("CRITIQUE", t.getPriorite());
        assertFalse(t.isResolu());
        assertEquals(1, gestion.getTotal());
    }

    @Test
    void testCreerDescriptionVide() {
        assertThrows(IllegalArgumentException.class,
            () -> gestion.creerTicket("", "NORMAL", "Bob"));
    }

    @Test
    void testCreerPrioriteInvalide() {
        assertThrows(IllegalArgumentException.class,
            () -> gestion.creerTicket("Bug", "URGENTE", "Charlie"));
    }

    @Test
    void testResoudreTicketInexistant() {
        assertThrows(Exception.class,
            () -> gestion.resoudreTicket(999));
    }

    @Test
    void testTicketsCritiques() throws Exception {
        gestion.creerTicket("Serveur down", "CRITIQUE", "Alice");
        gestion.creerTicket("Imprimante lente", "NORMAL", "Bob");
        gestion.creerTicket("Virus detecte", "CRITIQUE", "Charlie");
        assertEquals(2, gestion.ticketsCritiques().size());

        // Resoudre un critique -> ne doit plus apparaitre
        gestion.resoudreTicket(1);
        assertEquals(1, gestion.ticketsCritiques().size());
    }
}`;


const EX5_CODE=`// ===================================================
// FICHIER 1 : Medicament.java
// ===================================================

public class Medicament {
    private String nom;
    private double prix;
    private int quantite;
    private String dateExpiration; // format "JJ/MM/AAAA"

    public Medicament(String nom, double prix, int quantite, String dateExpiration) {
        this.nom = nom;
        this.prix = prix;
        this.quantite = quantite;
        this.dateExpiration = dateExpiration;
    }

    public String getNom() { return nom; }
    public double getPrix() { return prix; }
    public int getQuantite() { return quantite; }
    public String getDateExpiration() { return dateExpiration; }

    public void setNom(String nom) { this.nom = nom; }
    public void setPrix(double prix) { this.prix = prix; }
    public void setQuantite(int quantite) { this.quantite = quantite; }
    public void setDateExpiration(String d) { this.dateExpiration = d; }

    @Override
    public String toString() {
        String alerte = (quantite < 5) ? " [STOCK FAIBLE]" : "";
        return nom + " | " + String.format("%.2f", prix) + " EUR"
            + " | Qte: " + quantite + " | Exp: " + dateExpiration + alerte;
    }
}


// ===================================================
// FICHIER 2 : GestionStock.java
// ===================================================

import java.util.LinkedList;
import java.util.ArrayList;

public class GestionStock {
    private LinkedList<Medicament> medicaments;

    public GestionStock() {
        this.medicaments = new LinkedList<>();
    }

    // P5 : throw si nom vide ou prix negatif
    public void ajouter(Medicament m) {
        if (m.getNom() == null || m.getNom().trim().isEmpty()) {
            throw new IllegalArgumentException("Le nom du medicament ne peut pas etre vide !");
        }
        if (m.getPrix() < 0) {
            throw new IllegalArgumentException("Le prix ne peut pas etre negatif !");
        }
        if (m.getQuantite() < 0) {
            throw new IllegalArgumentException("La quantite ne peut pas etre negative !");
        }
        medicaments.add(m);
    }

    // P5 : throws Exception si medicament non trouve
    public Medicament rechercher(String nom) throws Exception {
        for (Medicament m : medicaments) {
            if (m.getNom().equalsIgnoreCase(nom)) {
                return m;
            }
        }
        throw new Exception("Medicament '" + nom + "' non trouve dans le stock !");
    }

    // Retourne les medicaments avec quantite < 5
    public ArrayList<Medicament> stocksFaibles() {
        ArrayList<Medicament> faibles = new ArrayList<>();
        for (Medicament m : medicaments) {
            if (m.getQuantite() < 5) {
                faibles.add(m);
            }
        }
        return faibles;
    }

    // Tri a bulles par nom (PAS Collections.sort)
    public void trierParNom() {
        int n = medicaments.size();
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                Medicament a = medicaments.get(j);
                Medicament b = medicaments.get(j + 1);
                // Compare par ordre alphabetique (ignore casse)
                if (a.getNom().compareToIgnoreCase(b.getNom()) > 0) {
                    // Echanger a et b
                    medicaments.set(j, b);
                    medicaments.set(j + 1, a);
                }
            }
        }
    }

    // Supprimer par nom
    public boolean supprimer(String nom) {
        for (int i = 0; i < medicaments.size(); i++) {
            if (medicaments.get(i).getNom().equalsIgnoreCase(nom)) {
                medicaments.remove(i);
                return true;
            }
        }
        return false;
    }

    public LinkedList<Medicament> getTout() { return medicaments; }
    public int getTaille() { return medicaments.size(); }

    /* ============================================
     * M4 : POURQUOI LinkedList ?
     * - Ajouts/suppressions frequents en pharmacie
     * - add() en fin = O(1), remove() quand on a l'index = O(1)
     * - Pas besoin d'acces par index (on cherche par nom)
     *
     * COMMENT trierParNom() resout le tri :
     * Tri a bulles : compare les voisins, echange si
     * mauvais ordre, repete jusqu'a ce que trie.
     *
     * COMMENT stocksFaibles() filtre :
     * Parcourt tout, garde ceux avec quantite < 5.
     * ============================================ */

    /* ============================================
     * D3 : COMPLEXITE
     * ajouter()       : O(1) - LinkedList.add() en fin
     * rechercher()    : O(n) pire cas - parcours sequentiel
     *                   O(1) meilleur cas (premier element)
     * stocksFaibles() : O(n) - parcourt tout
     * trierParNom()   : O(n^2) - tri a bulles (2 boucles)
     *                   PAS optimal. MergeSort = O(n log n)
     *                   Mais acceptable pour un petit stock.
     * supprimer()     : O(n) - parcours + suppression
     *
     * | Operation  | LinkedList | ArrayList | HashMap      |
     * |----------- |----------- |---------- |------------- |
     * | ajouter    | O(1)       | O(1)*     | O(1)         |
     * | rechercher | O(n)       | O(n)      | O(1) par cle |
     * | supprimer  | O(n)       | O(n)      | O(1) par cle |
     * | trier      | O(n^2)     | O(n^2)    | N/A          |
     * * ArrayList O(1) amorti (resize parfois)
     * ============================================ */
}


// ===================================================
// FICHIER 3 : Menu.java
// ===================================================

import java.util.Scanner;

public class Menu {
    private GestionStock gestion;

    public Menu(GestionStock gestion) {
        this.gestion = gestion;
    }

    public void afficherMenu() {
        Scanner sc = new Scanner(System.in);
        int choix = 0;

        while (choix != 6) {
            System.out.println("\n=== PHARMACIE - Stock Medicaments ===");
            System.out.println("1. Ajouter un medicament");
            System.out.println("2. Rechercher par nom");
            System.out.println("3. Stocks faibles (qte < 5)");
            System.out.println("4. Afficher tout (trie par nom)");
            System.out.println("5. Supprimer un medicament");
            System.out.println("6. Quitter");

            try {
                System.out.print("Choix : ");
                choix = Integer.parseInt(sc.nextLine());

                switch (choix) {
                    case 1:
                        // P5 : try/catch/finally
                        try {
                            System.out.print("Nom : ");
                            String nom = sc.nextLine();
                            System.out.print("Prix : ");
                            double prix = Double.parseDouble(sc.nextLine());
                            System.out.print("Quantite : ");
                            int qte = Integer.parseInt(sc.nextLine());
                            System.out.print("Date expiration (JJ/MM/AAAA) : ");
                            String dateExp = sc.nextLine();
                            Medicament m = new Medicament(nom, prix, qte, dateExp);
                            gestion.ajouter(m);
                            System.out.println("Medicament ajoute !");
                        } catch (IllegalArgumentException e) {
                            System.out.println("Erreur : " + e.getMessage());
                        } catch (NumberFormatException e) {
                            System.out.println("Erreur de saisie numerique !");
                        } finally {
                            // P5 : finally - toujours execute
                            System.out.println("[Stock : " + gestion.getTaille() + " medicaments]");
                        }
                        break;

                    case 2:
                        // P5 : try/catch pour rechercher (throws Exception)
                        try {
                            System.out.print("Nom du medicament : ");
                            Medicament m = gestion.rechercher(sc.nextLine());
                            System.out.println("Trouve : " + m);
                        } catch (Exception e) {
                            System.out.println("Erreur : " + e.getMessage());
                        }
                        break;

                    case 3:
                        var faibles = gestion.stocksFaibles();
                        if (faibles.isEmpty()) {
                            System.out.println("Aucun stock faible.");
                        } else {
                            System.out.println("Stocks faibles (" + faibles.size() + ") :");
                            for (var m : faibles) System.out.println("  " + m);
                        }
                        break;

                    case 4:
                        gestion.trierParNom();
                        var tout = gestion.getTout();
                        if (tout.isEmpty()) {
                            System.out.println("Stock vide.");
                        } else {
                            System.out.println("Stock trie par nom :");
                            for (var m : tout) System.out.println("  " + m);
                        }
                        break;

                    case 5:
                        System.out.print("Nom a supprimer : ");
                        boolean ok = gestion.supprimer(sc.nextLine());
                        System.out.println(ok ? "Supprime !" : "Medicament non trouve.");
                        break;

                    case 6:
                        System.out.println("Au revoir !");
                        break;

                    default:
                        System.out.println("Choix invalide.");
                }
            } catch (NumberFormatException e) {
                System.out.println("Erreur : entrez un nombre !");
            }
        }
        sc.close();
    }
}


// ===================================================
// FICHIER 4 : Main.java
// ===================================================

public class Main {
    public static void main(String[] args) {
        GestionStock gestion = new GestionStock();
        Menu menu = new Menu(gestion);
        menu.afficherMenu();
    }
}


// ===================================================
// FICHIER 5 : GestionStockTest.java (JUnit 5)
// ===================================================

import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class GestionStockTest {
    private GestionStock gestion;

    @BeforeEach
    void setUp() {
        gestion = new GestionStock();
    }

    @Test
    void testAjouterMedicamentValide() {
        Medicament m = new Medicament("Doliprane", 3.50, 100, "31/12/2025");
        gestion.ajouter(m);
        assertEquals(1, gestion.getTaille());
    }

    @Test
    void testAjouterNomVide() {
        Medicament m = new Medicament("", 5.0, 10, "01/01/2026");
        assertThrows(IllegalArgumentException.class,
            () -> gestion.ajouter(m));
    }

    @Test
    void testRechercherExistant() throws Exception {
        gestion.ajouter(new Medicament("Aspirine", 2.50, 50, "15/06/2025"));
        Medicament m = gestion.rechercher("Aspirine");
        assertEquals("Aspirine", m.getNom());
        assertEquals(2.50, m.getPrix(), 0.01);
    }

    @Test
    void testRechercherInexistant() {
        assertThrows(Exception.class,
            () -> gestion.rechercher("Inexistant"));
    }

    @Test
    void testStocksFaibles() {
        gestion.ajouter(new Medicament("Doliprane", 3.50, 100, "31/12/2025"));
        gestion.ajouter(new Medicament("Aspirine", 2.50, 3, "15/06/2025"));
        gestion.ajouter(new Medicament("Vitamine C", 5.00, 2, "01/03/2025"));
        assertEquals(2, gestion.stocksFaibles().size());
    }
}`;

const EXERCISES=[
  {id:1,title:"Gestion des emprunts de velos",color:TEAL,
    context:"Vous etes developpeur dans une entreprise proposant un service de pret de velos a ses employes. Vous devez creer un programme Java oriente objet.",
    tasks:["Ajouter un nouvel emprunt (nom employe, type de velo, date debut)","Terminer un emprunt (date de retour)","Afficher les emprunts en cours"],
    structure:"LinkedList<Emprunt>",
    structureWhy:"Les emprunts sont ajoutes/retires frequemment. LinkedList excelle en insertion/suppression.",
    classes:["Emprunt (nomEmploye, typeVelo, dateDebut, dateRetour) + getters/setters + toString + estEnCours()","GestionVelos (LinkedList, ajouterEmprunt, terminerEmprunt, getEmpruntsEnCours) — SANS Scanner","Menu (Scanner + switch/case — appelle GestionVelos)"],
    code:EX1_CODE,
    criteria:"P4 (implementation LinkedList), P5 (exceptions), M4 (resout un probleme)"},
  {id:2,title:"Suivi des interventions techniques",color:ORANGE,
    context:"Une societe d'infogerance souhaite developper une application pour enregistrer les interventions realisees chez ses clients. Ajoutez un bloc try/catch pour prevenir les erreurs.",
    tasks:["Ajouter une intervention (nom client, probleme, technicien)","Rechercher les interventions d'un client donne","Afficher toutes les interventions"],
    structure:"HashMap<String, ArrayList<Intervention>>",
    structureWhy:"Recherche par client = recherche par cle. HashMap O(1). Chaque client peut avoir plusieurs interventions donc ArrayList comme valeur.",
    classes:["Intervention (nomClient, probleme, technicien, date) + getters + toString","GestionInterventions (HashMap, ajouter, rechercherParClient, afficherTout, getNombreTotal) — SANS Scanner","Menu (Scanner + switch/case + try/catch)"],
    code:EX2_CODE,
    criteria:"P4 (HashMap), P5 (try/catch saisie + IllegalArgumentException), M4, D3 (complexite O(1) recherche)"},
  {id:3,title:"Reservation de salles de reunion",color:PURPLE,
    context:"Vous developpez une application interne permettant aux employes de reserver des salles de reunion. L'application doit verifier les doublons et permettre une navigation par menu.",
    tasks:["Reserver une salle (nom employe, date, heure, salle)","Annuler une reservation","Verifier les disponibilites d'une salle pour un jour donne"],
    structure:"HashMap<String, LinkedList<Reservation>>",
    structureWhy:"Recherche par salle = HashMap O(1). Les reservations d'une salle sont stockees dans une LinkedList (insertion/suppression facile).",
    classes:["Reservation (nomEmploye, date, heure, salle) + getters + toString + equals (doublon = meme salle+date+heure)","GestionSalles (HashMap+LinkedList, reserver, annuler, getCreneauxReserves) — SANS Scanner","Menu (Scanner + switch/case + try/catch + DateTimeParseException)"],
    code:EX3_CODE,
    criteria:"P4 (HashMap+LinkedList), P5 (exceptions multiples), M4, D3 (Queue+HashMap combines)"},
,
  {id:4,title:"Gestion de Tickets de Support IT",color:"#3B82F6",
    context:"Vous travaillez dans le service informatique d'une entreprise. Votre manager vous demande de developper une application de gestion de tickets de support. Les tickets doivent etre traites par ordre de priorite : les tickets critiques en premier, puis les tickets normaux. L'application utilise un systeme de file d'attente avec priorite.",
    p4:["Classe Ticket : id, description, priorite (CRITIQUE/NORMAL/FAIBLE), demandeur, resolu + getters/setters + toString()","GestionTickets : HashMap<Integer, Ticket> + compteur auto-increment","creerTicket(desc, priorite, demandeur) : cree ticket avec id auto-incremente","resoudreTicket(id) : marque resolu=true, signale si id inexistant","ticketsCritiques() : ArrayList des tickets CRITIQUE non resolus","rechercherParDemandeur(nom) : parcourt le HashMap, retourne tous les tickets","statistiques() : total, resolus, ouverts, pourcentage","Menu : 1.Creer 2.Resoudre 3.Critiques 4.Rechercher 5.Stats 6.Quitter"],
    p5:["throws : resoudreTicket() declare throws Exception (ticket peut ne pas exister)","throw : creerTicket() leve throw new IllegalArgumentException si description vide ou priorite invalide","try/catch : saisie id du ticket (NumberFormatException si texte au lieu de nombre)","try/catch/finally : creation ticket — finally affiche le total de tickets apres chaque tentative","Tests JUnit (5 tests) : testCreerTicketValide, testCreerDescriptionVide, testCreerPrioriteInvalide, testResoudreTicketInexistant, testTicketsCritiques"],
    m4:["POURQUOI HashMap plutot que LinkedList/ArrayList ?","COMMENT HashMap.get(id) resout le probleme de resolution rapide","COMMENT ticketsCritiques() filtre les elements du HashMap","QUEL avantage du HashMap pour la recherche par cle en support IT"],
    d3:["creerTicket() : O(1) amorti — HashMap.put()","resoudreTicket() : O(1) par HashMap.get() vs O(n) avec LinkedList","ticketsCritiques() : O(n) — parcourt toutes les valeurs","rechercherParDemandeur() : O(n) — recherche par valeur pas par cle","Amelioration : HashMap<String, List<Ticket>> pour O(1) par demandeur"],
    structure:"HashMap<Integer, Ticket>",
    structureWhy:"HashMap choisi car : acces direct par id en O(1) (essentiel pour resoudreTicket), unicite des cles (pas 2 tickets meme id), ajout O(1) amorti. Avec LinkedList, resoudreTicket serait O(n).",
    classes:[
      "Ticket — Entite metier : id, description, priorite, demandeur, resolu + getters/setters + toString()",
      "GestionTickets — ADT + Algorithmes : HashMap<Integer,Ticket>, compteur auto-increment, SANS Scanner (testable JUnit)",
      "Menu — Interface utilisateur : Scanner, afficherMenu(), gestionChoix() avec boucle while + try/catch + finally",
      "Main — Point d'entree : instancie GestionTickets et Menu, lance le programme",
      "GestionTicketsTest — 5 tests JUnit 5 : @BeforeEach, @Test, assertEquals, assertThrows"
    ],
    code:EX4_CODE,
    criteria:"P4 (HashMap), P5 (exceptions multiples : IllegalArgument + IllegalState + NumberFormat), M4 (resout un probleme IT), D3 (analyse O(1) vs O(n))"},
  {id:5,title:"Gestion de Stock de Medicaments en Pharmacie",color:"#16A34A",
    context:"Vous etes developpeur dans une pharmacie de quartier. Le pharmacien souhaite une application Java pour gerer son stock de medicaments. L'application doit permettre d'ajouter des medicaments, de rechercher un medicament par nom, de verifier les stocks faibles (quantite < 5) et d'afficher l'ensemble du stock trie par nom.",
    p4:["Classe Medicament : nom (String), prix (double), quantite (int), dateExpiration (String) + getters/setters + toString()","GestionStock : LinkedList<Medicament>","ajouter(Medicament m) : ajoute a la liste","rechercher(String nom) : parcourt et retourne le medicament (ou erreur)","stocksFaibles() : liste des medicaments avec quantite < 5","trierParNom() : tri a bulles par ordre alphabetique (PAS Collections.sort)","supprimer(String nom) : supprime de la liste","Menu : 1.Ajouter 2.Rechercher 3.Stocks faibles 4.Afficher trie 5.Supprimer 6.Quitter"],
    p5:["throws : rechercher() declare throws Exception dans sa signature","throw : ajouter() leve throw new IllegalArgumentException si nom vide ou prix negatif","try/catch : Menu gere InputMismatchException et NumberFormatException","try/catch/finally : finally affiche message de fin d'operation apres CHAQUE action","Tests JUnit (5 tests) : testAjouterMedicamentValide, testAjouterNomVide, testRechercherExistant, testRechercherInexistant, testStocksFaibles"],
    m4:["POURQUOI LinkedList plutot qu'un tableau ou ArrayList ?","COMMENT trierParNom() resout le tri (quel algorithme, comment il fonctionne)","COMMENT stocksFaibles() filtre les elements (parcours + condition)","QUEL avantage de la LinkedList pour ajouts/suppressions frequents"],
    d3:["ajouter() : O(1) — LinkedList.add() en fin","rechercher() : O(n) pire cas, O(1) meilleur cas","stocksFaibles() : O(n) — parcourt tous les elements","trierParNom() : O(n^2) tri a bulles — pas optimal, MergeSort serait O(n log n)","Comparaison : ArrayList O(1) get par index, HashMap O(1) par cle"],
    structure:"LinkedList<Medicament>",
    structureWhy:"LinkedList choisi car : ajouts/suppressions frequents en pharmacie O(1), pas besoin d'acces par index (recherche par nom = parcours), tri a bulles implementable sur LinkedList.",
    classes:[
      "Medicament — Entite metier : nom, prix, quantite, dateExpiration + getters/setters + toString()",
      "GestionStock — ADT + Algorithmes : LinkedList<Medicament>, tri a bulles, SANS Scanner (testable JUnit)",
      "Menu — Interface utilisateur : Scanner, afficherMenu(), gestionChoix() avec boucle while + try/catch + finally",
      "Main — Point d'entree : instancie GestionStock et Menu, lance le programme",
      "GestionStockTest — 5 tests JUnit 5 : @BeforeEach, @Test, assertEquals, assertThrows"
    ],
    code:EX5_CODE,
    criteria:"P4 (LinkedList + tri a bulles), P5 (throws Exception + throw + try/catch/finally), M4 (pourquoi LinkedList + comment le tri resout le probleme), D3 (O(n) recherche, O(n^2) tri, comparaison avec ArrayList/HashMap)"}

];

export default function ExercicesEntreprise(){
  const { user: authUser, loading: authLoading } = useAuth();
  if (authLoading) return <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Chargement...</div>;
  if (!authUser) { if (typeof window !== "undefined") window.location.href = "/login"; return null; }

  // Check locks
  const [lockChecked, setLockChecked] = React.useState(false);
  const [sectionLocked, setSectionLocked] = React.useState(false);
  React.useEffect(() => {
    loadLocks().then(locks => { setSectionLocked(locks["exercices_entreprise"] === true); setLockChecked(true); });
  }, []);
  if (!lockChecked) return <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Chargement...</div>;
  if (sectionLocked) return <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#e2e8f0", gap: 12 }}><div style={{ fontSize: 48 }}>🔒</div><div style={{ fontSize: 20, fontWeight: 700 }}>Acces bloque</div><div style={{ fontSize: 13, color: "#94a3b8" }}>Cette section est verrouillee par le professeur</div><a href="/" style={{ color: "#32E0C4", marginTop: 8 }}>Retour au Hub</a></div>;

  const[expanded,setExpanded]=useState(null);
  const[showCode,setShowCode]=useState(new Set());

  const toggleCode=(id:number)=>{const s=new Set(showCode);s.has(id)?s.delete(id):s.add(id);setShowCode(s)};

  return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"2rem 1rem"}}>
      <NavBar/>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:13,color:ORANGE,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Exercices pratiques</div>
          <h1 style={{fontSize:28,fontWeight:700,margin:"0.5rem 0"}}>Cas d'entreprise Java</h1>
          <p style={{color:MUTED,fontSize:15}}>5 exercices complets — classes metier, gestion, menu, exceptions, tests JUnit</p>
          <p style={{color:MUTED,fontSize:12,marginTop:4}}>Structure par exercice : 4 niveaux (P4 Implementation, P5 Error Handling + Tests, M4 Commentaires, D3 Complexite)</p>
        </div>
        <div style={{display:"grid",gap:16}}>
          {EXERCISES.map((ex)=>(
            <div key={ex.id} style={{border:"1px solid "+(expanded===ex.id?ex.color:BORDER),borderRadius:12,overflow:"hidden"}}>
              <button onClick={()=>setExpanded(expanded===ex.id?null:ex.id)}
                style={{width:"100%",padding:"16px",background:expanded===ex.id?ex.color+"15":CARD,border:"none",cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:17,fontWeight:700,color:TEXT}}>Exercice {ex.id} — {ex.title}</span>
                <span style={{color:MUTED,fontSize:18}}>{expanded===ex.id?String.fromCharCode(9650):String.fromCharCode(9660)}</span>
              </button>
              {expanded===ex.id&&(
                <div style={{padding:"0 16px 16px"}}>
                  <div style={{padding:"10px 14px",background:ex.color+"10",borderRadius:8,marginBottom:12,marginTop:8}}>
                    <div style={{fontSize:13,fontWeight:600,color:ex.color,marginBottom:4}}>Contexte :</div>
                    <div style={{fontSize:14,color:TEXT}}>{ex.context}</div>
                  </div>
                  {/* P4 - Implementation */}
                  {ex.p4&&(<div style={{marginBottom:12}}>
                    <div style={{padding:"8px 12px",background:"#16A34A15",borderRadius:8,border:"1px solid #16A34A30"}}>
                      <div style={{fontSize:12,fontWeight:700,color:"#16A34A",marginBottom:6}}>P4 — Implementation ADT + Algorithme</div>
                      {ex.p4.map((t:string,i:number)=>(<div key={i} style={{fontSize:12,color:TEXT,padding:"2px 0"}}>{String.fromCharCode(8226)} {t}</div>))}
                    </div>
                  </div>)}
                  {/* P5 - Error Handling + Tests */}
                  {ex.p5&&(<div style={{marginBottom:12}}>
                    <div style={{padding:"8px 12px",background:"#DC262615",borderRadius:8,border:"1px solid #DC262630"}}>
                      <div style={{fontSize:12,fontWeight:700,color:"#DC2626",marginBottom:6}}>P5 — Error Handling + Tests JUnit</div>
                      {ex.p5.map((t:string,i:number)=>(<div key={i} style={{fontSize:12,color:TEXT,padding:"2px 0"}}>{String.fromCharCode(8226)} {t}</div>))}
                    </div>
                  </div>)}
                  {/* M4 + D3 in a grid */}
                  {ex.m4&&ex.d3&&(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                    <div style={{padding:"8px 12px",background:"#3B82F615",borderRadius:8,border:"1px solid #3B82F630"}}>
                      <div style={{fontSize:12,fontWeight:700,color:"#3B82F6",marginBottom:6}}>M4 — Commentaires (Merit)</div>
                      {ex.m4.map((t:string,i:number)=>(<div key={i} style={{fontSize:11,color:MUTED,padding:"2px 0"}}>{String.fromCharCode(8226)} {t}</div>))}
                    </div>
                    <div style={{padding:"8px 12px",background:"#7C3AED15",borderRadius:8,border:"1px solid #7C3AED30"}}>
                      <div style={{fontSize:12,fontWeight:700,color:"#7C3AED",marginBottom:6}}>D3 — Complexite (Distinction)</div>
                      {ex.d3.map((t:string,i:number)=>(<div key={i} style={{fontSize:11,color:MUTED,padding:"2px 0"}}>{String.fromCharCode(8226)} {t}</div>))}
                    </div>
                  </div>)}
                  {/* Fallback for exercises without p4/p5/m4/d3 */}
                  {ex.tasks&&(<div style={{marginBottom:12}}>
                    <div style={{fontSize:13,fontWeight:600,color:TEXT,marginBottom:6}}>Fonctionnalites :</div>
                    {ex.tasks.map((t:string,i:number)=>(<div key={i} style={{fontSize:13,color:MUTED,padding:"3px 0"}}>{String.fromCharCode(8226)} {t}</div>))}
                  </div>)}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                    <div style={{padding:"10px",background:CARD,borderRadius:8,border:"1px solid "+BORDER}}>
                      <div style={{fontSize:11,fontWeight:600,color:TEAL,textTransform:"uppercase",marginBottom:4}}>Structure de donnees</div>
                      <div style={{fontSize:14,fontWeight:600,color:TEXT}}>{ex.structure}</div>
                      <div style={{fontSize:11,color:MUTED,marginTop:4}}>{ex.structureWhy}</div>
                    </div>
                    <div style={{padding:"10px",background:CARD,borderRadius:8,border:"1px solid "+BORDER}}>
                      <div style={{fontSize:11,fontWeight:600,color:PURPLE,textTransform:"uppercase",marginBottom:4}}>Classes a creer</div>
                      {ex.classes.map((c,i)=>(<div key={i} style={{fontSize:11,color:TEXT,padding:"2px 0"}}>{i+1}. {c}</div>))}
                    </div>
                  </div>
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:11,fontWeight:600,color:ORANGE,marginBottom:4}}>Criteres couverts : {ex.criteria}</div>
                  </div>
                  <button onClick={()=>toggleCode(ex.id)}
                    style={{padding:"8px 16px",background:showCode.has(ex.id)?RED+"20":GREEN+"20",border:"1px solid "+(showCode.has(ex.id)?RED:GREEN),borderRadius:8,fontSize:12,fontWeight:600,color:showCode.has(ex.id)?RED:GREEN,cursor:"pointer"}}>
                    {showCode.has(ex.id)?"Cacher la correction":"Voir la correction complete"}
                  </button>
                  {showCode.has(ex.id)&&(
                    <div style={{marginTop:10,background:"#0D1117",borderRadius:10,padding:"12px",maxHeight:500,overflowY:"auto"}}>
                      <pre style={{fontSize:11,color:"#A5F3FC",fontFamily:"Consolas,monospace",margin:0,whiteSpace:"pre-wrap"}}>{ex.code}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
