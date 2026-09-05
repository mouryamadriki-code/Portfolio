import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import "./App.css";

/* =========================================================
   DATA
========================================================= */

const pages = [
  "HOME",
  "ABOUT",
  "PROJECTS",
  "SKILLS",
  "EXPERIENCE",
  "CONTACT",
];

const projects = [
  {
    number: "01",
    title: "Employee Engagement Analytics Dashboard",
    description:
      "Interactive analytics dashboard for exploring employee engagement, satisfaction, performance and manager-level insights.",
    stack: ["Python", "Pandas", "Streamlit", "Plotly"],
    link: "https://employee-engagement-dashboard.streamlit.app/",
    github:
      "https://github.com/mouryamadriki-code/employee-engagement-dashboard",
  },
  {
    number: "02",
    title: "FinShield",
    description:
      "AI-assisted financial advisory dashboard designed around CRM data, analytics and intelligent financial insights.",
    stack: ["Salesforce", "CRM Analytics", "AI"],
  },
  {
    number: "03",
    title: "LiFi Data Transfer System",
    description:
      "Visible-light communication system that demonstrates wireless data transmission using LEDs and photodiode-based reception.",
    stack: ["Arduino", "Embedded C", "Photodiode"],
  },
  {
    number: "04",
    title: "Solar-Based Wireless Power Charging Station",
    description:
      "Solar-powered wireless charging concept combining wireless power transfer with IoT-based monitoring.",
    stack: ["Arduino", "IoT", "Wireless Power Transfer"],
    github:
      "https://github.com/mouryamadriki-code/SOLAR-BASED-WIRELESS-POWER-CHARGING-STATION-USING-IoT-MONITORING",
  },
  {
    number: "05",
    title: "Hermetic Bags for Grain Storage",
    description:
      "Patented grain-storage solution designed to improve protection and preservation through hermetic storage.",
    stack: ["IoT", "Product Design", "Patent"],
    github: "https://github.com/mouryamadriki-code/Hermetic-bags",
  },
];

const technicalSkills = [
  "Python",
  "C",
  "Embedded C",
  "SQL",
  "MATLAB",
  "Simulink",
  "Arduino IDE",
  "Arduino Uno",
  "ESP32",
  "Salesforce",
  "Excel",
  "PowerPoint",
  "MySQL",
];

const softSkills = [
  "Problem Solving",
  "Communication",
  "Leadership",
  "Teamwork",
  "Time Management",
];

const achievements = [
  "Technical Quiz — Consolation Prize",
  "Entrix Pitch — Consolation Prize",
  "YesSummit 2024 — Top 10",
  "Smart India Hackathon — Internal Selection",
  "Patent Granted — Hermetic Bags for Grain Storage",
];

/* =========================================================
   3D GLOBE
========================================================= */

function Globe() {
  const group = useRef();

  useFrame((_, delta) => {
    if (!group.current) return;

    group.current.rotation.y += delta * 0.16;
    group.current.rotation.x = Math.sin(Date.now() * 0.00025) * 0.05;
  });

  return (
    <group ref={group} rotation={[0.18, 0.2, 0]}>
      {/* Main wireframe globe */}
      <mesh>
        <sphereGeometry args={[2.55, 40, 40]} />
        <meshBasicMaterial
          color="#087cff"
          wireframe
          transparent
          opacity={0.42}
        />
      </mesh>

      {/* Inner globe */}
      <mesh>
        <sphereGeometry args={[2.42, 32, 32]} />
        <meshBasicMaterial
          color="#021126"
          transparent
          opacity={0.32}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Latitude / longitude rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.56, 0.012, 8, 96]} />
        <meshBasicMaterial color="#238cff" transparent opacity={0.6} />
      </mesh>

      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[2.56, 0.012, 8, 96]} />
        <meshBasicMaterial color="#238cff" transparent opacity={0.45} />
      </mesh>

      <mesh rotation={[Math.PI / 4, 0, Math.PI / 5]}>
        <torusGeometry args={[2.58, 0.009, 8, 96]} />
        <meshBasicMaterial color="#8dbfff" transparent opacity={0.3} />
      </mesh>

      {/* Orbit ring */}
      <mesh rotation={[1.12, 0.2, 0.35]}>
        <torusGeometry args={[3.15, 0.018, 8, 128]} />
        <meshBasicMaterial color="#0b7cff" transparent opacity={0.55} />
      </mesh>

      {/* Small orbit point */}
      <mesh position={[2.1, 1.75, 0.8]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshBasicMaterial color="#d7eaff" />
      </mesh>
    </group>
  );
}

function GlobeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.8], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.8} />
      <pointLight position={[4, 4, 5]} intensity={2} color="#187cff" />
      <Globe />

      <EffectComposer>
        <Bloom
          intensity={1.25}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.7}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [activePage, setActivePage] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const touchStart = useRef(null);
  const scrollLock = useRef(false);

  const goToPage = (index) => {
    const next = Math.max(0, Math.min(pages.length - 1, index));

    if (next === activePage || transitioning) return;

    setTransitioning(true);
    setActivePage(next);

    setTimeout(() => {
      setTransitioning(false);
    }, 550);
  };

  useEffect(() => {
    const handleWheel = (event) => {
      if (scrollLock.current) return;

      const currentSection = document.querySelector(
        `.screen[data-index="${activePage}"]`
      );

      if (currentSection) {
        const scrollArea = currentSection.querySelector(".scroll-area");

        if (scrollArea) {
          const atTop = scrollArea.scrollTop <= 0;
          const atBottom =
            scrollArea.scrollTop + scrollArea.clientHeight >=
            scrollArea.scrollHeight - 5;

          if (event.deltaY > 0 && !atBottom) return;
          if (event.deltaY < 0 && !atTop) return;
        }
      }

      if (Math.abs(event.deltaY) < 20) return;

      scrollLock.current = true;

      if (event.deltaY > 0) {
        goToPage(activePage + 1);
      } else {
        goToPage(activePage - 1);
      }

      setTimeout(() => {
        scrollLock.current = false;
      }, 650);
    };

    const handleKeyDown = (event) => {
      if (
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        event.key === " "
      ) {
        event.preventDefault();
        goToPage(activePage + 1);
      }

      if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        goToPage(activePage - 1);
      }

      if (event.key === "Home") {
        event.preventDefault();
        goToPage(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        goToPage(pages.length - 1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePage, transitioning]);

  const handleTouchStart = (event) => {
    touchStart.current = event.touches[0].clientY;
  };

  const handleTouchEnd = (event) => {
    if (touchStart.current === null) return;

    const endY = event.changedTouches[0].clientY;
    const difference = touchStart.current - endY;

    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        goToPage(activePage + 1);
      } else {
        goToPage(activePage - 1);
      }
    }

    touchStart.current = null;
  };

  return (
    <main
      className="portfolio"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="background-grid" />
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">M</span>
          <span>MOURYA SREE MADIRIKI</span>
        </div>

        <nav className="top-nav">
          {pages.map((page, index) => (
            <button
              key={page}
              className={activePage === index ? "active" : ""}
              onClick={() => goToPage(index)}
            >
              {page}
            </button>
          ))}
        </nav>

        <div className="top-meta">
          <span className="availability">
            <span className="availability-dot" />
            AVAILABLE
          </span>
          <span className="year">2026</span>
        </div>
      </header>

      {/* =====================================================
          SIDE INDEX
      ===================================================== */}

      <aside className="side-index">
        <span className="side-current">
          {String(activePage + 1).padStart(2, "0")}
        </span>

        <span className="side-line" />

        <span className="side-total">
          {String(pages.length).padStart(2, "0")}
        </span>
      </aside>

      {/* =====================================================
          MAIN SCREENS
      ===================================================== */}

      <div className="screens">
        {/* =================================================
            HOME
        ================================================= */}

        <section
          className={`screen screen-home ${
            activePage === 0 ? "is-active" : ""
          }`}
          data-index="0"
        >
          <div className="home-content">
            <div className="home-copy">
              <div className="eyebrow">
                <span className="eyebrow-line" />
                ENGINEERING | TECHNOLOGY | INNOVATION 
              </div>

              <h1>
                MOURYA
                <br />
                SREE
                <br />
                MADIRIKI
              </h1>

              <p className="hero-role">
                B.Tech — Electrical &amp; Electronics Engineering
              </p>

              <p className="hero-description">
                Engineering student focused on embedded systems, IoT,
                analytics and technology-driven problem solving.
              </p>

              <div className="hero-actions">
                <button
                  className="primary-button"
                  onClick={() => goToPage(2)}
                >
                  VIEW PROJECTS
                  <span>↗</span>
                </button>

                <button
                  className="text-button"
                  onClick={() => goToPage(5)}
                >
                  CONTACT
                  <span>→</span>
                </button>
              </div>

              <div className="hero-location">
                HYDERABAD, INDIA
              </div>
            </div>

            <div className="hero-visual">
              <div className="visual-label visual-label-top">
                <span>01</span>
                <span>GLOBAL / SYSTEM</span>
              </div>

              <div className="globe-wrapper">
                <GlobeScene />
              </div>

              <div className="visual-label visual-label-bottom">
                <span>ENGINEERING</span>
                <span>01 / 06</span>
              </div>
            </div>
          </div>

          <div className="home-footer">
            <span>IDEAS</span>
            <span>SYSTEMS</span>
            <span>IMPACT</span>
            <span className="scroll-hint">SCROLL TO EXPLORE ↓</span>
          </div>
        </section>

        {/* =================================================
            ABOUT
        ================================================= */}

        <section
          className={`screen standard-screen ${
            activePage === 1 ? "is-active" : ""
          }`}
          data-index="1"
        >
          <div className="scroll-area">
            <div className="section-inner">
              <div className="section-header">
                <div className="section-number">02</div>

                <div>
                  <span className="section-kicker">PROFILE</span>
                  <h2>ABOUT</h2>
                </div>
              </div>

              <div className="about-grid">
                <div className="about-intro">
                  <p className="large-text">
                    I am an Electrical &amp; Electronics Engineering student
                    interested in building practical technology at the
                    intersection of hardware, software and data.
                  </p>

                  <p className="body-text">
                    My work spans embedded systems, IoT, analytics,
                    automation and technology-focused problem solving. I
                    enjoy turning ideas into working systems and learning
                    through hands-on projects.
                  </p>
                </div>

                <div className="about-details">
                  <div className="detail-block">
                    <span className="detail-label">EDUCATION</span>
                    <h3>B.Tech</h3>
                    <p>
                      Electrical &amp; Electronics Engineering
                      <br />
                      Vardhaman College of Engineering
                      <br />
                      2023 — 2027
                    </p>
                  </div>

                  <div className="detail-block">
                    <span className="detail-label">FOCUS AREAS</span>

                    <div className="focus-list">
                      <div>
                        <span>01</span>
                        Embedded Systems
                      </div>
                      <div>
                        <span>02</span>
                        Internet of Things
                      </div>
                      <div>
                        <span>03</span>
                        Data Analytics
                      </div>
                      <div>
                        <span>04</span>
                        Electrical Engineering
                      </div>
                      <div>
                        <span>05</span>
                        Software &amp; Automation
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            PROJECTS
        ================================================= */}

        <section
          className={`screen standard-screen ${
            activePage === 2 ? "is-active" : ""
          }`}
          data-index="2"
        >
          <div className="scroll-area">
            <div className="section-inner">
              <div className="section-header">
                <div className="section-number">03</div>

                <div>
                  <span className="section-kicker">SELECTED WORK</span>
                  <h2>PROJECTS</h2>
                </div>
              </div>

              <div className="projects-list">
                {projects.map((project) => (
                  <article className="project-row" key={project.number}>
                    <div className="project-number">{project.number}</div>

                    <div className="project-main">
                      <h3>{project.title}</h3>

                      <p>{project.description}</p>

                      <div className="project-stack">
                        {project.stack.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </div>
                    </div>

                    <div className="project-action">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          LIVE ↗
                        </a>
                      )}

                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                        >
                          GITHUB ↗
                        </a>
                      )}

                      {!project.link && !project.github && (
                        <span>PROJECT</span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            SKILLS
        ================================================= */}

        <section
          className={`screen standard-screen ${
            activePage === 3 ? "is-active" : ""
          }`}
          data-index="3"
        >
          <div className="scroll-area">
            <div className="section-inner">
              <div className="section-header">
                <div className="section-number">04</div>

                <div>
                  <span className="section-kicker">CAPABILITIES</span>
                  <h2>SKILLS</h2>
                </div>
              </div>

              <div className="skills-grid">
                <div className="skills-column">
                  <span className="detail-label">TECHNICAL SKILLS</span>

                  <div className="skill-cloud">
                    {technicalSkills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="skills-column">
                  <span className="detail-label">SOFT SKILLS</span>

                  <div className="soft-list">
                    {softSkills.map((skill, index) => (
                      <div key={skill}>
                        <span>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <strong>{skill}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            EXPERIENCE
        ================================================= */}

        <section
          className={`screen standard-screen ${
            activePage === 4 ? "is-active" : ""
          }`}
          data-index="4"
        >
          <div className="scroll-area">
            <div className="section-inner">
              <div className="section-header">
                <div className="section-number">05</div>

                <div>
                  <span className="section-kicker">BACKGROUND</span>
                  <h2>EXPERIENCE</h2>
                </div>
              </div>

              <div className="experience-list">
                <article className="experience-row">
                  <div className="experience-date">
                    APR — MAY
                    <br />
                    2026
                  </div>

                  <div className="experience-content">
                    <span className="experience-type">
                      INTERNSHIP
                    </span>

                    <h3>
                      NIELIT — Genomic Data Analysis Intern
                    </h3>

                    <p>
                      Internship experience focused on genomic data
                      analysis and computational approaches to working
                      with biological datasets.
                    </p>
                  </div>
                </article>

                <article className="experience-row">
                  <div className="experience-date">
                    APR 2025
                    <br />
                    — PRESENT
                  </div>

                  <div className="experience-content">
                    <span className="experience-type">
                      LEADERSHIP
                    </span>

                    <h3>
                      Chairperson — Samvada Club
                    </h3>

                    <p>
                      Leading student activities, coordinating teams and
                      supporting communication and collaborative initiatives
                      at Vardhaman College of Engineering.
                    </p>
                  </div>
                </article>
              </div>

              <div className="achievements">
                <span className="detail-label">ACHIEVEMENTS</span>

                <div className="achievement-list">
                  {achievements.map((item, index) => (
                    <div key={item}>
                      <span>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            CONTACT
        ================================================= */}

        <section
          className={`screen standard-screen contact-screen ${
            activePage === 5 ? "is-active" : ""
          }`}
          data-index="5"
        >
          <div className="section-inner contact-inner">
            <div className="section-header">
              <div className="section-number">06</div>

              <div>
                <span className="section-kicker">LET'S CONNECT</span>
                <h2>CONTACT</h2>
              </div>
            </div>

            <div className="contact-content">
              <p className="contact-intro">
                Have an idea, opportunity or project worth discussing?
              </p>

              <a
                className="email-link"
                href="mailto:mouryamadriki@gmail.com"
              >
                mouryamadriki@gmail.com
              </a>

              <div className="contact-links">
                <a
                  href="https://github.com/mouryamadriki-code"
                  target="_blank"
                  rel="noreferrer"
                >
                  GITHUB ↗
                </a>

                <a
                  href="https://www.linkedin.com/in/mourya-sree-madiriki-96509627/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LINKEDIN ↗
                </a>

                <a href="/resume.pdf" target="_blank" rel="noreferrer">
                  RESUME ↗
                </a>
              </div>
            </div>

            <footer className="contact-footer">
              <span>HYDERABAD, INDIA</span>
              <span>© 2026 MOURYA SREE MADIRIKI</span>
            </footer>
          </div>
        </section>
      </div>

      {/* =====================================================
          PRESENTATION FRAME
      ===================================================== */}

      <div className="presentation-frame">
        <span className="frame-corner frame-tl" />
        <span className="frame-corner frame-tr" />
        <span className="frame-corner frame-bl" />
        <span className="frame-corner frame-br" />
      </div>

      {/* =====================================================
          PAGE DOTS
      ===================================================== */}

      <div className="page-dots">
        {pages.map((page, index) => (
          <button
            key={page}
            aria-label={`Go to ${page}`}
            className={activePage === index ? "active" : ""}
            onClick={() => goToPage(index)}
          />
        ))}
      </div>

      <div className="bottom-progress">
        <span
          style={{
            width: `${((activePage + 1) / pages.length) * 100}%`,
          }}
        />
      </div>
    </main>
  );
}