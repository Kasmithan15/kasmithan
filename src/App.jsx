import { ArrowDownRight, ArrowUpRight, Code2, Github, Linkedin, Mail, Menu, MonitorSmartphone, Palette, Sparkles, Terminal, X } from "lucide-react";
import React, { useState } from "react";
import ProfilePhoto from "./ProfilePhoto.jsx";
import ProfilePhotoManager from "./ProfilePhotoManager.jsx";

const projects = [
  {
    number: "01",
    title: "Smart Service Finder",
    type: "Frontend · Recommendation Website",
    description: "A responsive website that recommends suitable business solutions based on an industry's needs, problems, and selected features.",
    tags: ["React", "JavaScript", "CSS", "SEO"],
    link: "https://github.com/Kasmithan15",
  },
  {
    number: "02",
    title: "Smart Tourist Guide",
    type: "Academic Project · Web Application",
    description: "A concept for helping travellers explore Sri Lankan destinations, compare tour packages, and discover local guides.",
    tags: ["Java", "React", "Web Development"],
    link: "https://github.com/Kasmithan15",
  },
  {
    number: "03",
    title: "More projects coming soon",
    type: "Learning in public",
    description: "I'm continuously learning, building, and improving my development skills. Check my GitHub for the latest work.",
    tags: ["Practice", "Open to learning"],
    link: "https://github.com/Kasmithan15",
  },
];

const skills = [
  { icon: Code2, name: "Frontend development", detail: "Building responsive web interfaces" },
  { icon: MonitorSmartphone, name: "React & JavaScript", detail: "Learning component-based development" },
  { icon: Terminal, name: "Java & programming", detail: "Academic and project experience" },
  { icon: Palette, name: "UI/UX design", detail: "A focus on clear, useful experiences" },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  if (window.location.pathname === "/manage-photo") {
    return <ProfilePhotoManager />;
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#home" onClick={closeMenu}><span className="brand-mark">K.</span><span>Kasmithan<span className="brand-dot">.</span></span></a>
        <button className="menu-toggle" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21}/> : <Menu size={21}/>}</button>
        <nav className={menuOpen ? "nav nav-open" : "nav"}>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#skills" onClick={closeMenu}>Skills</a>
          <a href="#projects" onClick={closeMenu}>Projects</a>
          <a className="nav-contact" href="#contact" onClick={closeMenu}>Contact <ArrowUpRight size={15}/></a>
        </nav>
      </header>

      <main>
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="status-dot"/> IT UNDERGRADUATE · SRI LANKA</div>
            <h1>Building my path<br/>in <span className="gradient-text">web development.</span></h1>
            <p className="hero-intro">Hey there, I'm <strong>Kasmithan</strong> — an Information Technology undergraduate at SLIIT, interested in frontend development, thoughtful UI, and useful digital experiences.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">Explore my work <ArrowDownRight size={17}/></a>
              <a className="button button-quiet" href="https://github.com/Kasmithan15" target="_blank" rel="noreferrer"><Github size={17}/> GitHub</a>
            </div>
            <div className="hero-footnote"><Sparkles size={15}/> Learning, building, and getting better one project at a time.</div>
          </div>
          <div className="hero-visual" aria-label="Decorative code card">
            <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
            <div className="profile-card">
              <div className="card-top"><span/><span/><span/><p>about-me.jsx</p></div>
              <div className="code-content">
                <p><span className="code-purple">const</span> developer = {"{"}</p>
                <p className="indent"><span className="code-blue">name</span>: <span className="code-green">'Kasmithan'</span>,</p>
                <p className="indent"><span className="code-blue">study</span>: <span className="code-green">'BSc IT'</span>,</p>
                <p className="indent"><span className="code-blue">focus</span>: [</p>
                <p className="indent double"><span className="code-green">'React'</span>,</p>
                <p className="indent double"><span className="code-green">'Frontend'</span>,</p>
                <p className="indent double"><span className="code-green">'UI/UX'</span>,</p>
                <p className="indent double"><span className="code-green">'Backend Development'</span>,</p>
                <p className="indent double"><span className="code-green">'Full-Stack Development'</span></p>
                <p className="indent">],</p>
                <p className="indent"><span className="code-blue">mindset</span>: <span className="code-green">'Always learning'</span></p>
                <p>{"};"}</p>
                <div className="code-cursor"/>
              </div>
              <div className="card-bottom"><span className="status-dot"/> Available to learn & collaborate</div>
            </div>
            <div className="floating-badge badge-code"><Code2 size={17}/> Build. Learn. Repeat.</div>
            <ProfilePhoto />
          </div>
          <a className="scroll-cue" href="#about"><span/> SCROLL TO EXPLORE</a>
        </section>

        <section className="about section-wrap" id="about">
          <div className="section-label">01 / ABOUT ME</div>
          <div className="about-grid">
            <h2>Curious by nature.<br/><span className="muted-heading">Developer in progress.</span></h2>
            <div className="about-text">
              <p>I'm currently pursuing a BSc in Information Technology at SLIIT in Sri Lanka. I'm especially interested in frontend development and how thoughtful design can make technology easier to use.</p>
              <p>I'm growing my skills through hands-on projects, exploring React and JavaScript, and learning how to turn ideas into responsive web experiences. I'm always open to feedback, collaboration, and new opportunities to learn.</p>
              <a className="text-link" href="https://github.com/Kasmithan15" target="_blank" rel="noreferrer">A little more about my work <ArrowUpRight size={16}/></a>
            </div>
          </div>
        </section>

        <section className="skills section-wrap" id="skills">
          <div className="section-heading">
            <div><div className="section-label">02 / WHAT I'M LEARNING</div><h2>Skills & interests<span className="accent">.</span></h2></div>
            <p>Growing a practical toolkit through coursework, curiosity, and hands-on projects.</p>
          </div>
          <div className="skill-grid">
            {skills.map(({icon: Icon, name, detail}, i) => <article className="skill-card" key={name}><div className="skill-card-top"><span className="skill-icon"><Icon size={20}/></span><span className="skill-index">0{i+1}</span></div><h3>{name}</h3><p>{detail}</p></article>)}
          </div>
          <div className="tech-strip"><span>EXPLORING</span>{["HTML & CSS", "JavaScript", "React", "Java", "Git & GitHub"].map(t => <span className="tech-pill" key={t}>{t}</span>)}</div>
        </section>

        <section className="projects section-wrap" id="projects">
          <div className="section-heading">
            <div><div className="section-label">03 / SELECTED WORK</div><h2>Things I'm building<span className="accent">.</span></h2></div>
            <a className="text-link" href="https://github.com/Kasmithan15" target="_blank" rel="noreferrer">View GitHub <ArrowUpRight size={16}/></a>
          </div>
          <div className="project-list">
            {projects.map(project => <article className="project-card" key={project.number}>
              <div className="project-number">{project.number}</div>
              <div className="project-main"><div className="project-type">{project.type}</div><h3>{project.title}</h3><p>{project.description}</p><div className="tag-list">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
              <a className="project-link" href={project.link} target="_blank" rel="noreferrer" aria-label={`View ${project.title} on GitHub`}><ArrowUpRight size={21}/></a>
            </article>)}
          </div>
          <p className="project-note">Project links currently point to my GitHub profile. I'll add individual repository links as each project is published.</p>
        </section>

        <section className="contact section-wrap" id="contact">
          <div className="contact-panel">
            <div className="section-label">04 / SAY HELLO</div>
            <h2>Have an idea?<br/><span className="gradient-text">Let's connect.</span></h2>
            <p>I'm open to connecting with fellow developers, learning from experienced people, and exploring internship opportunities.</p>
            <div className="contact-actions">
              <a className="button button-primary" href="mailto:kasmithan15@gmail.com"><Mail size={17}/> Email me <ArrowUpRight size={16}/></a>
              <a className="button button-outline" href="https://www.linkedin.com/feed/" target="_blank" rel="noreferrer"><Linkedin size={17}/> LinkedIn</a>
            </div>
            <div className="contact-glow"/>
          </div>
        </section>
      </main>

      <footer className="footer section-wrap">
        <a className="brand" href="#home"><span className="brand-mark">K.</span><span>Kasmithan<span className="brand-dot">.</span></span></a>
        <p>Designed with curiosity · Built with React</p>
        <div className="footer-links">
          <a className="back-top" href="/manage-photo">Manage profile photo</a>
          <a className="back-top" href="#home">Back to top ↑</a>
        </div>
      </footer>
    </div>
  );
}