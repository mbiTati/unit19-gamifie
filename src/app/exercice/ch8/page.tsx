"use client";
import { useAuth } from "@/components/AuthProvider";
import CodeExercise from "@/components/CodeExercise";
export default function Ex8() {
  // AUTH CHECK MOVED TO AFTER HOOKS
 return <CodeExercise
  chapter={8} title="Design Patterns — Singleton & Factory" criteria="M3" worldColor="#0891B2" totalPoints={50}
  intro="Complétez l'implémentation du pattern Singleton et Factory Method."
  codeTemplate={`// ═══ SINGLETON ═══
public class Logger {
    // 1. Attribut statique privé
    private ___blank1___ Logger instance;

    // 2. Constructeur PRIVÉ
    ___blank2___ Logger() {}

    // 3. Méthode d'accès
    public static Logger ___blank3___() {
        if (instance == null)
            instance = new Logger();
        return instance;
    }
}

// ═══ FACTORY METHOD ═══
interface Notification { void envoyer(String msg); }
class Email implements Notification {
    public void envoyer(String msg) { /* email */ }
}
class SMS implements Notification {
    public void envoyer(String msg) { /* sms */ }
}

class NotificationFactory {
    public static Notification creer(String ___blank4___) {
        if (type.equals("email"))
            return new ___blank5___();
        if (type.equals("sms"))
            return new SMS();
        throw new IllegalArgumentException("Type inconnu");
    }
}`}
  blanks={[
    {id:"blank1",label:"mot-clé",answer:"static",hint:"L'instance doit exister sans instancier la classe"},
    {id:"blank2",label:"accès",answer:"private",hint:"Empêcher l'instanciation externe"},
    {id:"blank3",label:"méthode",answer:"getInstance",hint:"Convention de nommage Singleton"},
    {id:"blank4",label:"paramètre",answer:"type",hint:"Le type de notification à créer"},
    {id:"blank5",label:"classe",answer:"Email",hint:"Si type = email, on crée un..."}
  ]}
  questions={[
    {id:"q1",question:"Pourquoi le constructeur Singleton est privé ?",options:["Convention","Empêcher de créer plusieurs instances","Performance","Sécurité"],correctIndex:1,explanation:"Constructeur privé = impossible de faire new Logger(). Seul getInstance() peut créer l'instance."},
    {id:"q2",question:"Factory Method est utile quand :",options:["On veut une instance unique","On ne sait pas à l'avance quel type créer","On veut observer","On veut adapter"],correctIndex:1,explanation:"Factory délègue la décision de création. Le code client utilise l'interface sans connaître les classes concrètes."}
  ]}

  mainCode={`public class Menu {
    public static void main(String[] args) {
        // Test Singleton
        Logger log1 = Logger.getInstance();
        Logger log2 = Logger.getInstance();
        System.out.println("Meme instance ? " + (log1 == log2)); // true

        // Test Factory
        Notification email = NotificationFactory.creer("email");
        email.envoyer("Bonjour !");

        Notification sms = NotificationFactory.creer("sms");
        sms.envoyer("Salut !");

        // Test erreur
        try {
            NotificationFactory.creer("pigeon");
        } catch (IllegalArgumentException e) {
            System.out.println("Erreur : " + e.getMessage());
        }
    }
}`}
/>; }
