"use client";
import Link from "next/link";
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

const EX4_CODE=`import java.util.HashMap;
import java.util.ArrayList;

// ===================================================
// CLASSE METIER : Ticket
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
// CLASSE GESTION (sans Scanner - testable JUnit)
// ===================================================
public class GestionTickets {
    private HashMap<Integer, Ticket> tickets;
    private int compteurId;

    public GestionTickets() {
        this.tickets = new HashMap<>();
        this.compteurId = 1;
    }

    // CREATE - id auto-increment
    public Ticket creerTicket(String description, String priorite, String demandeur) {
        if (description == null || description.trim().isEmpty())
            throw new IllegalArgumentException("Description vide !");
        if (!priorite.equals("CRITIQUE") && !priorite.equals("NORMAL") && !priorite.equals("FAIBLE"))
            throw new IllegalArgumentException("Priorite invalide : " + priorite);
        Ticket t = new Ticket(compteurId, description, priorite, demandeur);
        tickets.put(compteurId, t);
        compteurId++;
        return t;
    }

    // UPDATE - resoudre par id O(1)
    public void resoudreTicket(int id) {
        if (!tickets.containsKey(id))
            throw new IllegalArgumentException("Ticket #" + id + " inexistant !");
        Ticket t = tickets.get(id);
        if (t.isResolu())
            throw new IllegalStateException("Ticket #" + id + " deja resolu !");
        t.setResolu(true);
    }

    // READ - critiques non resolus O(n)
    public ArrayList<Ticket> ticketsCritiques() {
        ArrayList<Ticket> critiques = new ArrayList<>();
        for (Ticket t : tickets.values()) {
            if (t.getPriorite().equals("CRITIQUE") && !t.isResolu())
                critiques.add(t);
        }
        return critiques;
    }

    // READ - par demandeur O(n)
    public ArrayList<Ticket> rechercherParDemandeur(String demandeur) {
        ArrayList<Ticket> resultats = new ArrayList<>();
        for (Ticket t : tickets.values()) {
            if (t.getDemandeur().equalsIgnoreCase(demandeur))
                resultats.add(t);
        }
        if (resultats.isEmpty())
            throw new IllegalArgumentException("Aucun ticket pour : " + demandeur);
        return resultats;
    }

    // READ - statistiques O(n)
    public String statistiques() {
        int total = tickets.size();
        int resolus = 0;
        for (Ticket t : tickets.values()) if (t.isResolu()) resolus++;
        int ouverts = total - resolus;
        double pourcent = total > 0 ? (resolus * 100.0 / total) : 0;
        return "Total: " + total + " | Resolus: " + resolus
            + " | Ouverts: " + ouverts + " | Taux: " + String.format("%.1f", pourcent) + "%";
    }

    public int getTotal() { return tickets.size(); }
}

// ===================================================
// MENU (Scanner + try/catch multi-exceptions)
// ===================================================
import java.util.Scanner;

public class Menu {
    public static void main(String[] args) {
        GestionTickets gestion = new GestionTickets();
        Scanner sc = new Scanner(System.in);
        int choix;

        do {
            System.out.println("\\n=== SUPPORT IT - Tickets ===");
            System.out.println("1. Creer un ticket");
            System.out.println("2. Resoudre un ticket");
            System.out.println("3. Tickets critiques");
            System.out.println("4. Rechercher par demandeur");
            System.out.println("5. Statistiques");
            System.out.println("0. Quitter");
            System.out.print("Choix : ");

            try {
                choix = Integer.parseInt(sc.nextLine());
            } catch (NumberFormatException e) {
                System.out.println("Entrez un nombre !");
                choix = -1; continue;
            }

            switch (choix) {
                case 1:
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
                    }
                    break;
                case 2:
                    try {
                        System.out.print("ID du ticket : ");
                        int id = Integer.parseInt(sc.nextLine());
                        gestion.resoudreTicket(id);
                        System.out.println("Ticket #" + id + " resolu !");
                    } catch (NumberFormatException e) {
                        System.out.println("ID invalide !");
                    } catch (IllegalArgumentException | IllegalStateException e) {
                        System.out.println("Erreur : " + e.getMessage());
                    }
                    break;
                case 3:
                    var critiques = gestion.ticketsCritiques();
                    if (critiques.isEmpty()) System.out.println("Aucun ticket critique ouvert.");
                    else { System.out.println("Critiques (" + critiques.size() + ") :");
                        for (var tk : critiques) System.out.println("  " + tk); }
                    break;
                case 4:
                    try {
                        System.out.print("Demandeur : ");
                        var res = gestion.rechercherParDemandeur(sc.nextLine());
                        System.out.println("Tickets (" + res.size() + ") :");
                        for (var tk : res) System.out.println("  " + tk);
                    } catch (IllegalArgumentException e) {
                        System.out.println("Erreur : " + e.getMessage());
                    }
                    break;
                case 5:
                    System.out.println(gestion.statistiques());
                    break;
                case 0: System.out.println("Au revoir !"); break;
                default: System.out.println("Choix invalide.");
            }
        } while (choix != 0);
        sc.close();
    }
}`;


const EX5_CODE=`import java.time.LocalDate;

// ===================================================
// CLASSE METIER : Medicament
// ===================================================
public class Medicament {
    private String code;        // code unique (ex: "MED001")
    private String nom;
    private int quantite;
    private double prixUnitaire;
    private LocalDate dateExpiration;
    private String categorie;   // "ANTIBIOTIQUE", "ANTIDOULEUR", "VITAMINE", etc.

    public Medicament(String code, String nom, int quantite, double prixUnitaire,
                      LocalDate dateExpiration, String categorie) {
        this.code = code;
        this.nom = nom;
        this.quantite = quantite;
        this.prixUnitaire = prixUnitaire;
        this.dateExpiration = dateExpiration;
        this.categorie = categorie;
    }

    // Getters
    public String getCode() { return code; }
    public String getNom() { return nom; }
    public int getQuantite() { return quantite; }
    public double getPrixUnitaire() { return prixUnitaire; }
    public LocalDate getDateExpiration() { return dateExpiration; }
    public String getCategorie() { return categorie; }

    // Setters
    public void setQuantite(int quantite) {
        if (quantite < 0)
            throw new IllegalArgumentException("Quantite ne peut pas etre negative !");
        this.quantite = quantite;
    }

    public boolean estExpire() {
        return LocalDate.now().isAfter(dateExpiration);
    }

    public boolean estEnRuptureDeStock() {
        return quantite == 0;
    }

    @Override
    public String toString() {
        String statut = estExpire() ? " [EXPIRE]" : estEnRuptureDeStock() ? " [RUPTURE]" : "";
        return "[" + code + "] " + nom + " | " + categorie
            + " | Qte: " + quantite + " | " + String.format("%.2f", prixUnitaire) + " EUR"
            + " | Exp: " + dateExpiration + statut;
    }
}

// ===================================================
// CLASSE GESTION (sans Scanner - testable JUnit)
// ===================================================
import java.util.HashMap;
import java.util.ArrayList;

public class GestionStock {
    private HashMap<String, Medicament> stock; // cle = code medicament

    public GestionStock() {
        this.stock = new HashMap<>();
    }

    // CREATE - ajouter un medicament
    public void ajouter(String code, String nom, int quantite, double prix,
                        LocalDate dateExp, String categorie) {
        if (stock.containsKey(code))
            throw new IllegalArgumentException("Le code " + code + " existe deja !");
        if (quantite < 0)
            throw new IllegalArgumentException("Quantite invalide !");
        if (prix <= 0)
            throw new IllegalArgumentException("Prix invalide !");
        Medicament m = new Medicament(code, nom, quantite, prix, dateExp, categorie);
        stock.put(code, m);
    }

    // READ - rechercher par code O(1)
    public Medicament rechercherParCode(String code) {
        if (!stock.containsKey(code))
            throw new IllegalArgumentException("Medicament " + code + " introuvable !");
        return stock.get(code);
    }

    // READ - rechercher par nom O(n) - parcourt les valeurs
    public ArrayList<Medicament> rechercherParNom(String nom) {
        ArrayList<Medicament> resultats = new ArrayList<>();
        for (Medicament m : stock.values()) {
            if (m.getNom().toLowerCase().contains(nom.toLowerCase()))
                resultats.add(m);
        }
        return resultats;
    }

    // UPDATE - approvisionner (ajouter au stock)
    public void approvisionner(String code, int quantiteAjoutee) {
        Medicament m = rechercherParCode(code); // leve exception si inexistant
        if (quantiteAjoutee <= 0)
            throw new IllegalArgumentException("Quantite a ajouter doit etre > 0");
        m.setQuantite(m.getQuantite() + quantiteAjoutee);
    }

    // UPDATE - vendre (retirer du stock)
    public void vendre(String code, int quantiteVendue) {
        Medicament m = rechercherParCode(code);
        if (quantiteVendue <= 0)
            throw new IllegalArgumentException("Quantite a vendre doit etre > 0");
        if (quantiteVendue > m.getQuantite())
            throw new IllegalStateException("Stock insuffisant pour " + m.getNom()
                + " ! Disponible: " + m.getQuantite() + ", Demande: " + quantiteVendue);
        m.setQuantite(m.getQuantite() - quantiteVendue);
    }

    // DELETE - supprimer un medicament
    public void supprimer(String code) {
        if (!stock.containsKey(code))
            throw new IllegalArgumentException("Medicament " + code + " introuvable !");
        stock.remove(code);
    }

    // READ - medicaments expires
    public ArrayList<Medicament> getMedicamentsExpires() {
        ArrayList<Medicament> expires = new ArrayList<>();
        for (Medicament m : stock.values()) {
            if (m.estExpire()) expires.add(m);
        }
        return expires;
    }

    // READ - medicaments en rupture de stock
    public ArrayList<Medicament> getRupturesDeStock() {
        ArrayList<Medicament> ruptures = new ArrayList<>();
        for (Medicament m : stock.values()) {
            if (m.estEnRuptureDeStock()) ruptures.add(m);
        }
        return ruptures;
    }

    // READ - par categorie
    public ArrayList<Medicament> getParCategorie(String categorie) {
        ArrayList<Medicament> resultats = new ArrayList<>();
        for (Medicament m : stock.values()) {
            if (m.getCategorie().equalsIgnoreCase(categorie))
                resultats.add(m);
        }
        return resultats;
    }

    // READ - valeur totale du stock
    public double getValeurTotaleStock() {
        double total = 0;
        for (Medicament m : stock.values()) {
            total += m.getQuantite() * m.getPrixUnitaire();
        }
        return total;
    }

    // READ - statistiques
    public String statistiques() {
        int total = stock.size();
        int expires = getMedicamentsExpires().size();
        int ruptures = getRupturesDeStock().size();
        double valeur = getValeurTotaleStock();
        return "Medicaments: " + total
            + " | Expires: " + expires
            + " | Ruptures: " + ruptures
            + " | Valeur stock: " + String.format("%.2f", valeur) + " EUR";
    }

    public int getTaille() { return stock.size(); }

    /* ============================================
     * M4 : POURQUOI HashMap pour la pharmacie ?
     * - Recherche par code en O(1) (essentiel en pharmacie)
     * - Unicite des codes medicaments garantie
     * - Ajout/suppression en O(1)
     *
     * D3 : ANALYSE DE COMPLEXITE
     * ajouter()             : O(1) - HashMap.put()
     * rechercherParCode()   : O(1) - HashMap.get()
     * rechercherParNom()    : O(n) - parcourt les valeurs
     * approvisionner()      : O(1) - get + setQuantite
     * vendre()              : O(1) - get + verification + setQuantite
     * supprimer()           : O(1) - HashMap.remove()
     * getMedicamentsExpires(): O(n) - parcourt tout
     * getRupturesDeStock()  : O(n) - parcourt tout
     * getParCategorie()     : O(n) - parcourt tout
     * getValeurTotaleStock(): O(n) - parcourt tout
     * ============================================ */
}

// ===================================================
// MENU (Scanner + try/catch + validation)
// ===================================================
import java.util.Scanner;
import java.time.format.DateTimeParseException;

public class Menu {
    public static void main(String[] args) {
        GestionStock gestion = new GestionStock();
        Scanner sc = new Scanner(System.in);
        int choix;

        do {
            System.out.println("\n=== PHARMACIE - Gestion Stock ===");
            System.out.println("1. Ajouter un medicament");
            System.out.println("2. Rechercher par code");
            System.out.println("3. Rechercher par nom");
            System.out.println("4. Approvisionner");
            System.out.println("5. Vendre");
            System.out.println("6. Medicaments expires");
            System.out.println("7. Ruptures de stock");
            System.out.println("8. Statistiques");
            System.out.println("0. Quitter");
            System.out.print("Choix : ");

            try {
                choix = Integer.parseInt(sc.nextLine());
            } catch (NumberFormatException e) {
                System.out.println("Entrez un nombre !");
                choix = -1; continue;
            }

            switch (choix) {
                case 1:
                    try {
                        System.out.print("Code (ex: MED001) : ");
                        String code = sc.nextLine();
                        System.out.print("Nom : ");
                        String nom = sc.nextLine();
                        System.out.print("Quantite : ");
                        int qte = Integer.parseInt(sc.nextLine());
                        System.out.print("Prix unitaire : ");
                        double prix = Double.parseDouble(sc.nextLine());
                        System.out.print("Date expiration (AAAA-MM-JJ) : ");
                        LocalDate dateExp = LocalDate.parse(sc.nextLine());
                        System.out.print("Categorie (ANTIBIOTIQUE/ANTIDOULEUR/VITAMINE) : ");
                        String cat = sc.nextLine().toUpperCase();
                        gestion.ajouter(code, nom, qte, prix, dateExp, cat);
                        System.out.println("Medicament ajoute !");
                    } catch (DateTimeParseException e) {
                        System.out.println("Format de date invalide !");
                    } catch (NumberFormatException e) {
                        System.out.println("Nombre invalide !");
                    } catch (IllegalArgumentException e) {
                        System.out.println("Erreur : " + e.getMessage());
                    }
                    break;
                case 2:
                    try {
                        System.out.print("Code : ");
                        System.out.println(gestion.rechercherParCode(sc.nextLine()));
                    } catch (IllegalArgumentException e) {
                        System.out.println("Erreur : " + e.getMessage());
                    }
                    break;
                case 3:
                    System.out.print("Nom (ou partie) : ");
                    var res = gestion.rechercherParNom(sc.nextLine());
                    if (res.isEmpty()) System.out.println("Aucun resultat.");
                    else for (var m : res) System.out.println("  " + m);
                    break;
                case 4:
                    try {
                        System.out.print("Code : ");
                        String codeAppro = sc.nextLine();
                        System.out.print("Quantite a ajouter : ");
                        int qteAppro = Integer.parseInt(sc.nextLine());
                        gestion.approvisionner(codeAppro, qteAppro);
                        System.out.println("Stock mis a jour !");
                    } catch (Exception e) {
                        System.out.println("Erreur : " + e.getMessage());
                    }
                    break;
                case 5:
                    try {
                        System.out.print("Code : ");
                        String codeVente = sc.nextLine();
                        System.out.print("Quantite a vendre : ");
                        int qteVente = Integer.parseInt(sc.nextLine());
                        gestion.vendre(codeVente, qteVente);
                        System.out.println("Vente enregistree !");
                    } catch (IllegalStateException e) {
                        System.out.println("Stock insuffisant : " + e.getMessage());
                    } catch (Exception e) {
                        System.out.println("Erreur : " + e.getMessage());
                    }
                    break;
                case 6:
                    var expires = gestion.getMedicamentsExpires();
                    if (expires.isEmpty()) System.out.println("Aucun medicament expire.");
                    else { System.out.println("Expires (" + expires.size() + ") :");
                        for (var m : expires) System.out.println("  " + m); }
                    break;
                case 7:
                    var ruptures = gestion.getRupturesDeStock();
                    if (ruptures.isEmpty()) System.out.println("Aucune rupture.");
                    else { System.out.println("Ruptures (" + ruptures.size() + ") :");
                        for (var m : ruptures) System.out.println("  " + m); }
                    break;
                case 8:
                    System.out.println(gestion.statistiques());
                    break;
                case 0: System.out.println("Au revoir !"); break;
                default: System.out.println("Choix invalide.");
            }
        } while (choix != 0);
        sc.close();
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
  {id:4,title:"Gestion des Tickets de Support IT",color:"#3B82F6",
    context:"Votre manager vous demande de developper une application de gestion de tickets de support. Les tickets ont un id auto-incremente, une description, une priorite (CRITIQUE/NORMAL/FAIBLE), un demandeur, et un statut resolu/ouvert.",
    tasks:["Creer un ticket (description, priorite, demandeur) avec id auto-incremente","Resoudre un ticket par son id","Afficher les tickets critiques non resolus","Rechercher les tickets d'un demandeur","Afficher les statistiques (total, resolus, ouverts, taux)"],
    structure:"HashMap<Integer, Ticket>",
    structureWhy:"Acces direct par id en O(1). Unicite des cles garantie. Bien meilleur que LinkedList qui serait O(n) pour resoudreTicket(id).",
    classes:["Ticket (id, description, priorite, demandeur, resolu) + getters/setters + toString()","GestionTickets (HashMap, compteurId, creerTicket, resoudreTicket, ticketsCritiques, rechercherParDemandeur, statistiques) -- SANS Scanner","Menu (Scanner + switch/case + try/catch multi-exceptions)"],
    code:EX4_CODE,
    criteria:"P4 (HashMap), P5 (exceptions multiples : IllegalArgument + IllegalState + NumberFormat), M4 (resout un probleme IT), D3 (analyse O(1) vs O(n))"},
  {id:5,title:"Gestion du Stock de Medicaments",color:"#16A34A",
    context:"Une pharmacie souhaite informatiser la gestion de son stock de medicaments. Chaque medicament a un code unique, un nom, une quantite, un prix, une date d'expiration et une categorie. L'application doit gerer les approvisionnements, les ventes, les alertes d'expiration et les ruptures de stock.",
    tasks:["Ajouter un medicament (code, nom, quantite, prix, date expiration, categorie)","Rechercher par code (O(1)) et par nom (recherche partielle)","Approvisionner (ajouter au stock existant)","Vendre (retirer du stock avec verification)","Supprimer un medicament","Afficher les medicaments expires et les ruptures de stock","Statistiques (total, expires, ruptures, valeur du stock)"],
    structure:"HashMap<String, Medicament>",
    structureWhy:"Recherche par code en O(1) essentiel en pharmacie. Unicite des codes garantie. CRUD complet (Create, Read, Update, Delete).",
    classes:["Medicament (code, nom, quantite, prixUnitaire, dateExpiration, categorie) + getters/setters + estExpire() + estEnRuptureDeStock() + toString()","GestionStock (HashMap, ajouter, rechercherParCode O(1), rechercherParNom O(n), approvisionner, vendre avec validation stock, supprimer, getMedicamentsExpires, getRupturesDeStock, getValeurTotaleStock, statistiques) -- SANS Scanner","Menu (Scanner + switch 9 options + try/catch : DateTimeParseException + NumberFormatException + IllegalArgumentException + IllegalStateException)"],
    code:EX5_CODE,
    criteria:"P4 (HashMap CRUD complet), P5 (4 types exceptions + validation metier), M4 (resout probleme pharmacie), D3 (O(1) vs O(n) documente)"}

];

export default function ExercicesEntreprise(){
  const[expanded,setExpanded]=useState(null);
  const[showCode,setShowCode]=useState(new Set());

  const toggleCode=(id:number)=>{const s=new Set(showCode);s.has(id)?s.delete(id):s.add(id);setShowCode(s)};

  return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"2rem 1rem"}}>
      <div style={{padding:"8px 16px",borderBottom:"1px solid #1E3A5F"}}><Link href="/" style={{fontSize:12,color:"#94A3B8",textDecoration:"none"}}>Retour accueil</Link></div>
            <div style={{maxWidth:800,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:13,color:ORANGE,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Exercices pratiques</div>
          <h1 style={{fontSize:28,fontWeight:700,margin:"0.5rem 0"}}>Cas d'entreprise Java</h1>
          <p style={{color:MUTED,fontSize:15}}>5 exercices complets avec classes metier, gestion, menu, exceptions</p>
          <p style={{color:MUTED,fontSize:12,marginTop:4}}>Architecture : Classe metier + Classe Gestion (sans Scanner) + Menu (avec Scanner)</p>
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
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:13,fontWeight:600,color:TEXT,marginBottom:6}}>Fonctionnalites demandees :</div>
                    {ex.tasks.map((t,i)=>(<div key={i} style={{fontSize:13,color:MUTED,padding:"3px 0"}}>{String.fromCharCode(8226)} {t}</div>))}
                  </div>
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
