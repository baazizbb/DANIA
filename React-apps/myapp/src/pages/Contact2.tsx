import { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import "./Contact2.css";

type Agency = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
};

const AGENCIES: Agency[] = [
  {
    id: "paris",
    name: "Paris - Siege",
    address: "18 Rue des Forges, 75011 Paris",
    phone: "+33 1 84 00 11 22",
    email: "paris@entreprise.com",
    lat: 48.8576,
    lng: 2.3828,
  },
  {
    id: "lyon",
    name: "Lyon - Studio",
    address: "52 Quai Claude Bernard, 69007 Lyon",
    phone: "+33 4 72 00 33 44",
    email: "lyon@entreprise.com",
    lat: 45.7498,
    lng: 4.8414,
  },
  {
    id: "lille",
    name: "Lille - Atelier",
    address: "8 Place du Theatre, 59800 Lille",
    phone: "+33 3 20 10 55 66",
    email: "lille@entreprise.com",
    lat: 50.6373,
    lng: 3.0626,
  },
];

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as
  | string
  | undefined;

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  agency: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

declare global {
  interface Window {
    google?: typeof google;
  }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function Contact2() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [mapStatus, setMapStatus] = useState<"idle" | "ready" | "error">(
    "idle",
  );
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    agency: AGENCIES[0].id,
  });

  const agencyOptions = useMemo(
    () => AGENCIES.map((agency) => ({ value: agency.id, label: agency.name })),
    [],
  );

  useEffect(() => {
    if (!mapRef.current || mapStatus !== "idle") {
      return;
    }

    if (!GOOGLE_MAPS_KEY) {
      setMapStatus("error");
      return;
    }

    const existingScript = document.querySelector(
      'script[data-google-maps="true"]',
    );

    const initializeMap = () => {
      if (!window.google || !mapRef.current) {
        setMapStatus("error");
        return;
      }

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 48.8566, lng: 2.3522 },
        zoom: 5,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "cooperative",
      });

      const bounds = new window.google.maps.LatLngBounds();

      AGENCIES.forEach((agency) => {
        const position = { lat: agency.lat, lng: agency.lng };
        bounds.extend(position);
        new window.google.maps.Marker({
          position,
          map,
          title: agency.name,
        });
      });

      map.fitBounds(bounds, 120);
      setMapStatus("ready");
    };

    if (existingScript) {
      existingScript.addEventListener("load", initializeMap, { once: true });
      if (window.google) {
        initializeMap();
      }
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "true";
    script.onload = initializeMap;
    script.onerror = () => setMapStatus("error");
    document.body.appendChild(script);
  }, [mapStatus]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: FormErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Le nom est requis.";
    }
    if (!formData.email.trim()) {
      nextErrors.email = "L'email est requis.";
    } else if (!isValidEmail(formData.email)) {
      nextErrors.email = "Veuillez entrer un email valide.";
    }
    if (!formData.subject.trim()) {
      nextErrors.subject = "Le sujet est requis.";
    }
    if (!formData.message.trim()) {
      nextErrors.message = "Le message est requis.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false);
      return;
    }

    setSubmitted(true);
    setFormData((prev) => ({
      ...prev,
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      agency: AGENCIES[0].id,
    }));
  };

  return (
    <div className="contact2-page">
      <section className="contact2-hero">
        <div className="contact2-hero-content">
          <p className="contact2-eyebrow">Contactez-nous</p>
          <h1>Une equipe, plusieurs agences, un seul point de contact.</h1>
          <p>
            Choisissez l'agence la plus proche ou ecrivez-nous directement. Nous
            repondons sous 24 heures ouvrables.
          </p>
        </div>
        <div className="contact2-hero-card">
          <div>
            <span>Support prioritaire</span>
            <strong>+33 1 84 00 11 22</strong>
          </div>
          <div>
            <span>Adresse generale</span>
            <strong>contact@entreprise.com</strong>
          </div>
        </div>
      </section>

      <section className="contact2-map-section">
        <div className="contact2-section-title">
          <h2>Carte des agences</h2>
          <p>Une seule carte pour toutes nos implantations en France.</p>
        </div>
        <div className="contact2-map-wrap">
          <div className="contact2-map" ref={mapRef} />
          {mapStatus === "error" && (
            <div className="contact2-map-fallback">
              <h3>Carte Google Maps indisponible</h3>
              <p>
                Ajoutez une cle API Google Maps dans
                <span className="contact2-inline">VITE_GOOGLE_MAPS_API_KEY</span>
                pour afficher la carte interactive.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="contact2-agencies">
        <div className="contact2-section-title">
          <h2>Nos agences</h2>
          <p>Coordonnees completes de chaque site.</p>
        </div>
        <div className="contact2-agency-grid">
          {AGENCIES.map((agency) => (
            <article key={agency.id} className="contact2-agency-card">
              <header>
                <h3>{agency.name}</h3>
                <span className="contact2-status">Ouvert</span>
              </header>
              <div className="contact2-agency-row">
                <FontAwesomeIcon icon={faLocationDot} />
                <span>{agency.address}</span>
              </div>
              <div className="contact2-agency-row">
                <FontAwesomeIcon icon={faPhone} />
                <span>{agency.phone}</span>
              </div>
              <div className="contact2-agency-row">
                <FontAwesomeIcon icon={faEnvelope} />
                <span>{agency.email}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="contact2-form-section">
        <div className="contact2-section-title">
          <h2>Formulaire global</h2>
          <p>Un seul formulaire pour toute l'entreprise, avec choix d'agence.</p>
        </div>
        <div className="contact2-form-grid">
          <form className="contact2-form" onSubmit={handleSubmit}>
            <div className="contact2-field">
              <label htmlFor="name">Nom</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Votre nom complet"
                required
              />
              {errors.name && <span className="contact2-error">{errors.name}</span>}
            </div>
            <div className="contact2-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nom@entreprise.com"
                required
              />
              {errors.email && (
                <span className="contact2-error">{errors.email}</span>
              )}
            </div>
            <div className="contact2-field">
              <label htmlFor="phone">Telephone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+33 6 12 34 56 78"
              />
            </div>
            <div className="contact2-field">
              <label htmlFor="agency">Agence a contacter</label>
              <select
                id="agency"
                name="agency"
                value={formData.agency}
                onChange={handleChange}
              >
                {agencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="contact2-field">
              <label htmlFor="subject">Sujet</label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Support, partenariat, devis..."
                required
              />
              {errors.subject && (
                <span className="contact2-error">{errors.subject}</span>
              )}
            </div>
            <div className="contact2-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Expliquez votre besoin en quelques lignes."
                required
              />
              {errors.message && (
                <span className="contact2-error">{errors.message}</span>
              )}
            </div>
            <button type="submit" className="contact2-submit">
              Envoyer le message
            </button>
            {submitted && (
              <div className="contact2-success">
                Merci, votre message a bien ete envoye. Nous revenons vers vous
                rapidement.
              </div>
            )}
          </form>
          <aside className="contact2-form-aside">
            <div>
              <h3>Pourquoi nous contacter</h3>
              <p>
                Notre equipe vous accompagne sur toute la France avec un reseau
                d'agences specialisees.
              </p>
            </div>
            <div className="contact2-form-aside-card">
              <span>Delai moyen</span>
              <strong>Moins de 24h</strong>
              <span>Disponibilite</span>
              <strong>Lun - Ven, 09:00 - 18:00</strong>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default Contact2;
