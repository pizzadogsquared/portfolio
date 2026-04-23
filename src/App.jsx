import { createElement, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaAws,
  FaComments,
  FaGithub,
  FaLinkedin,
  FaMusic,
  FaNodeJs,
  FaReact,
} from 'react-icons/fa'
import {
  GiBroadsword,
  GiCastle,
  GiFlowers,
  GiGamepad,
  GiPathDistance,
  GiSteeringWheel,
} from 'react-icons/gi'
import { HiMiniArrowTopRightOnSquare, HiMiniMapPin } from 'react-icons/hi2'
import {
  SiExpress,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiPython,
  SiVuedotjs,
} from 'react-icons/si'
import './App.css'
import resumePdf from './assets/ESprouse_Resume.pdf'
import headshot from './images/headshot.jpg'

const stats = [
  {
    label: 'Education',
    value: 'Computer Science, B.Sc.',
    detail: 'Northern Arizona University, graduated in May 2026',
  },
  {
    label: 'Current Run',
    value: 'Reshape Lab',
    detail: 'Frontend internship shipping Vue features and API integrations. Also built an admin portal in the backend.',
  },
  {
    label: 'Guild Leader',
    value: 'NAU Game Design Club',
    detail: 'Founder and President organizing and leading builders, gamers, creators, and designers',
  },
  {
    label: 'Home Base',
    value: 'Surprise, AZ',
    detail: 'Available for full-stack roles and collaborative product work in Phoenix or remotely.',
  },
]

const experience = [
  {
    title: 'Software Intern',
    company: 'Reshape Lab',
    range: 'Jan 2026 - Present',
    bullets: [
      'Building and maintaining frontend features in a Vue web app to improve interaction quality.',
      'Integrated APIs for dynamic data flows and smoother product behavior.',
      'Building and maintaining an admin portal in the backend',
    ],
  },
  {
    title: 'Software Intern',
    company: 'Northern Arizona University',
    range: 'Dec 2024 - Apr 2025',
    bullets: [
      'Helped refactor backend pieces of a bicycle routing algorithm for cleaner structure.',
      'Partnered with teammates to debug issues and keep performance on track.',
    ],
  },
]

const projects = [
  {
    title: 'Healthy Lifestyle Coach',
    stack: 'Express.js, Node.js, MySQL, AWS',
    description:
      'A feedback-driven wellness app with authentication, surveys, AI-powered feedback, and backend APIs deployed in AWS.',
    href: 'https://mebalanced.com',
  },
  {
    title: 'Full-Stack Blog Platform',
    stack: 'React, Node.js, MongoDB',
    description:
      'A responsive blogging platform with authentication, CRUD flows, REST APIs, and secure data handling.',
    href: 'https://github.com/pizzadogsquared/bloghog',
  },
]

const loadout = [
  { label: 'React', icon: FaReact },
  { label: 'Node.js', icon: FaNodeJs },
  { label: 'AWS', icon: FaAws },
  { label: 'Bass Player', icon: FaMusic },
  { label: 'People Person', icon: FaComments },
  { label: 'Game Worlds', icon: GiGamepad },
]

const familiarStacks = [
  {
    label: 'React',
    icon: FaReact,
    tone: 'react',
    category: 'Frontend',
  },
  {
    label: 'Node.js',
    icon: FaNodeJs,
    tone: 'node',
    category: 'Backend',
  },
  {
    label: 'Express.js',
    icon: SiExpress,
    tone: 'express',
    category: 'APIs',
  },
  {
    label: 'JavaScript',
    icon: SiJavascript,
    tone: 'javascript',
    category: 'Language',
  },
  {
    label: 'Python',
    icon: SiPython,
    tone: 'python',
    category: 'Language',
  },
  {
    label: 'Vue',
    icon: SiVuedotjs,
    tone: 'vue',
    category: 'Frontend',
  },
  {
    label: 'MongoDB',
    icon: SiMongodb,
    tone: 'mongodb',
    category: 'Database',
  },
  {
    label: 'MySQL',
    icon: SiMysql,
    tone: 'mysql',
    category: 'Database',
  },
  {
    label: 'AWS',
    icon: FaAws,
    tone: 'aws',
    category: 'Cloud',
  },
  {
    label: 'GitHub',
    icon: FaGithub,
    tone: 'github',
    category: 'Workflow',
  },
]

const interests = [
  {
    title: 'Competitive Nature',
    icon: GiCastle,
    detail: 'Overwatch, Team Fortress 2, and the kind of team play where communication matters.',
  },
  {
    title: 'Story and Strategy',
    icon: GiBroadsword,
    detail: 'Baldur’s Gate 3, Metal Gear Solid, and games that reward creative problem solving.',
  },
  {
    title: 'Survival Sandbox',
    icon: GiFlowers,
    detail: 'Minecraft, Terraria, Stardew Valley, and systems you can shape into something personal.',
  },
]

const reveal = {
  hidden: { opacity: 0, y: 30 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: index * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

const ROAD_SPACING = 160
const ROAD_EPSILON = 1
const CAR_SPEED = 7
const BOOST_SPEED = 12
const BOOST_DURATION = 550
const BOOST_PAD_COUNT = 6
const BOOST_GRID_MIN = 1
const BOOST_GRID_MAX = 6

function snapToRoadLine(value) {
  return Math.round(value / ROAD_SPACING) * ROAD_SPACING
}

function clampStep(current, target, step) {
  if (Math.abs(target - current) <= step) {
    return target
  }

  return current + Math.sign(target - current) * step
}

function normalizeRoadPosition(point) {
  const snappedX = snapToRoadLine(point.x)
  const snappedY = snapToRoadLine(point.y)
  const onVertical = Math.abs(point.x - snappedX) <= ROAD_EPSILON
  const onHorizontal = Math.abs(point.y - snappedY) <= ROAD_EPSILON

  return {
    snappedX,
    snappedY,
    onVertical,
    onHorizontal,
    atIntersection: onVertical && onHorizontal,
  }
}

function getTargetDelta(current, roadTarget) {
  return {
    dx: roadTarget.x - current.x,
    dy: roadTarget.y - current.y,
  }
}

function getNearestRoadPoint(target) {
  const snappedX = snapToRoadLine(target.x)
  const snappedY = snapToRoadLine(target.y)
  const verticalDistance = Math.abs(target.x - snappedX)
  const horizontalDistance = Math.abs(target.y - snappedY)

  if (verticalDistance <= horizontalDistance) {
    return {
      x: snappedX,
      y: target.y,
      orientation: 'vertical',
    }
  }

  return {
    x: target.x,
    y: snappedY,
    orientation: 'horizontal',
  }
}

function chooseAxis(current, roadTarget, preferredAxis) {
  const { dx, dy } = getTargetDelta(current, roadTarget)
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)

  if (preferredAxis === 'x' && absDx > ROAD_EPSILON) {
    return 'x'
  }

  if (preferredAxis === 'y' && absDy > ROAD_EPSILON) {
    return 'y'
  }

  if (roadTarget.orientation === 'vertical') {
    if (absDx > ROAD_EPSILON) {
      return 'x'
    }

    if (absDy > ROAD_EPSILON) {
      return 'y'
    }
  } else {
    if (absDy > ROAD_EPSILON) {
      return 'y'
    }

    if (absDx > ROAD_EPSILON) {
      return 'x'
    }
  }

  if (absDx >= absDy && absDx > ROAD_EPSILON) {
    return 'x'
  }

  if (absDy > ROAD_EPSILON) {
    return 'y'
  }

  return null
}

function getBoostState(nextPosition, boostState, time) {
  const pads = boostState.pads ?? []
  const activePad = pads.find((pad) => {
    const dx = Math.abs(nextPosition.x - pad.x)
    const dy = Math.abs(nextPosition.y - pad.y)
    return dx <= 18 && dy <= 18
  })

  if (activePad && boostState.padKey !== `${activePad.x}-${activePad.y}`) {
    return {
      pads,
      activeUntil: time + BOOST_DURATION,
      padKey: `${activePad.x}-${activePad.y}`,
    }
  }

  if (time > boostState.activeUntil && !activePad) {
    return { pads, activeUntil: 0, padKey: null }
  }

  if (!activePad && boostState.padKey && time <= boostState.activeUntil) {
    return { ...boostState, pads, padKey: null }
  }

  return { ...boostState, pads }
}

function generateBoostPads() {
  const pads = []
  const usedKeys = new Set()

  while (pads.length < BOOST_PAD_COUNT) {
    const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical'
    const primary = Math.floor(
      Math.random() * (BOOST_GRID_MAX - BOOST_GRID_MIN + 1) + BOOST_GRID_MIN,
    )
    const secondary = Math.floor(
      Math.random() * (BOOST_GRID_MAX - BOOST_GRID_MIN) + BOOST_GRID_MIN,
    )
    const key = `${orientation}-${primary}-${secondary}`

    if (usedKeys.has(key)) {
      continue
    }

    usedKeys.add(key)
    pads.push(
      orientation === 'horizontal'
        ? {
            x: (secondary + 0.5) * ROAD_SPACING,
            y: primary * ROAD_SPACING,
            orientation,
          }
        : {
            x: primary * ROAD_SPACING,
            y: (secondary + 0.5) * ROAD_SPACING,
            orientation,
          },
    )
  }

  return pads
}

function getRoadWaypoint(current, target, preferredAxis) {
  const roadTarget = getNearestRoadPoint(target)
  const roadPosition = normalizeRoadPosition(current)
  let axis = preferredAxis
  let waypointX = current.x
  let waypointY = current.y

  if (roadPosition.atIntersection) {
    axis = chooseAxis(current, roadTarget, preferredAxis)

    if (axis === 'x') {
      waypointX = roadTarget.x
    } else if (axis === 'y') {
      waypointY = roadTarget.y
    }
  } else if (roadPosition.onVertical) {
    axis = 'y'
    if (
      roadTarget.orientation === 'vertical' &&
      Math.abs(current.x - roadTarget.x) <= ROAD_EPSILON
    ) {
      waypointY = roadTarget.y
    } else {
      const direction =
        Math.sign(roadTarget.y - current.y) || Math.sign(target.y - current.y) || 1
      waypointY = roadPosition.snappedY + direction * ROAD_SPACING
    }
  } else if (roadPosition.onHorizontal) {
    axis = 'x'
    if (
      roadTarget.orientation === 'horizontal' &&
      Math.abs(current.y - roadTarget.y) <= ROAD_EPSILON
    ) {
      waypointX = roadTarget.x
    } else {
      const direction =
        Math.sign(roadTarget.x - current.x) || Math.sign(target.x - current.x) || 1
      waypointX = roadPosition.snappedX + direction * ROAD_SPACING
    }
  }

  return { x: waypointX, y: waypointY, axis }
}

function hasReachedWaypoint(current, waypoint) {
  if (!waypoint) {
    return true
  }

  return (
    Math.abs(current.x - waypoint.x) <= ROAD_EPSILON &&
    Math.abs(current.y - waypoint.y) <= ROAD_EPSILON
  )
}

function moveCarTowardWaypoint(current, waypoint, speed) {
  const nextX = clampStep(current.x, waypoint.x, speed)
  const nextY = clampStep(current.y, waypoint.y, speed)

  let angle = current.angle

  if (Math.abs(nextX - current.x) > ROAD_EPSILON) {
    angle = nextX > current.x ? 90 : -90
  } else if (Math.abs(nextY - current.y) > ROAD_EPSILON) {
    angle = nextY > current.y ? 180 : 0
  }

  return { x: nextX, y: nextY, angle, axis: waypoint.axis }
}

function App() {
  const MotionSection = motion.section
  const MotionArticle = motion.article
  const [carState, setCarState] = useState({
    x: ROAD_SPACING * 2,
    y: ROAD_SPACING * 2,
    angle: 0,
    axis: 'y',
    boosted: false,
  })
  const [trail, setTrail] = useState([])
  const [boostPads] = useState(() => generateBoostPads())
  const targetRef = useRef({ x: ROAD_SPACING * 2, y: ROAD_SPACING * 2 })
  const carRef = useRef({
    x: ROAD_SPACING * 2,
    y: ROAD_SPACING * 2,
    angle: 0,
    axis: 'y',
    boosted: false,
  })
  const trailClockRef = useRef(0)
  const boostRef = useRef({ activeUntil: 0, padKey: null, pads: [] })
  const waypointRef = useRef({
    x: ROAD_SPACING * 2,
    y: ROAD_SPACING * 3,
    axis: 'y',
  })

  useEffect(() => {
    boostRef.current = {
      activeUntil: 0,
      padKey: null,
      pads: boostPads,
    }
  }, [boostPads])

  useEffect(() => {
    const setDefaultTarget = () => {
      targetRef.current = {
        x: Math.max(180, window.innerWidth * 0.72),
        y: Math.max(180, window.innerHeight * 0.34),
      }
    }

    const handlePointerMove = (event) => {
      targetRef.current = {
        x: event.clientX,
        y: event.clientY,
      }
    }

    setDefaultTarget()
    window.addEventListener('resize', setDefaultTarget)
    window.addEventListener('pointermove', handlePointerMove)

    return () => {
      window.removeEventListener('resize', setDefaultTarget)
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  useEffect(() => {
    let animationFrame = 0

    const tick = (time) => {
      const current = carRef.current
      const target = targetRef.current
      const boosted = time < boostRef.current.activeUntil
      const speed = boosted ? BOOST_SPEED : CAR_SPEED
      let waypoint = waypointRef.current

      if (hasReachedWaypoint(current, waypoint)) {
        waypoint = getRoadWaypoint(current, target, current.axis)
        waypointRef.current = waypoint
      }

      const next = moveCarTowardWaypoint(current, waypoint, speed)
      const nextBoost = getBoostState(next, boostRef.current, time)
      const nextBoosted = time < nextBoost.activeUntil

      boostRef.current = nextBoost

      carRef.current = { ...next, boosted: nextBoosted }
      setCarState({ ...next, boosted: nextBoosted })

      if (time - trailClockRef.current > 90) {
        trailClockRef.current = time
        setTrail((points) => [...points.slice(-21), { x: next.x, y: next.y }])
      }

      animationFrame = window.requestAnimationFrame(tick)
    }

    animationFrame = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(animationFrame)
  }, [])

  return (
    <div className="app-shell">
      <div className="city-backdrop" aria-hidden="true">
        <div className="city-grid"></div>
        <div className="city-glow city-glow-left"></div>
        <div className="city-glow city-glow-right"></div>
        <div className="city-block city-block-a"></div>
        <div className="city-block city-block-b"></div>
        <div className="city-block city-block-c"></div>
        <div className="city-block city-block-d"></div>
        <div className="city-marker marker-1">React District</div>
        <div className="city-marker marker-2">Game Club HQ</div>
        <div className="city-marker marker-3">Bass Line Ave</div>
        {boostPads.map((pad) => (
          <div
            key={`${pad.x}-${pad.y}`}
            className={`boost-pad boost-pad-${pad.orientation}`}
            style={{ left: pad.x, top: pad.y }}
          >
            <span className="boost-chevron"></span>
            <span className="boost-chevron"></span>
            <span className="boost-chevron"></span>
          </div>
        ))}
        {trail.map((point, index) => (
          <span
            key={`${point.x}-${point.y}-${index}`}
            className="trail-dot"
            style={{
              left: point.x,
              top: point.y,
              opacity: (index + 1) / trail.length,
            }}
          />
        ))}
        <div
          className={`cursor-car ${carState.boosted ? 'cursor-car-boosted' : ''}`}
          style={{
            transform: `translate(${carState.x}px, ${carState.y}px) rotate(${carState.angle}deg)`,
          }}
        >
          <span className="car-window"></span>
          <span className="wheel wheel-front-left"></span>
          <span className="wheel wheel-front-right"></span>
          <span className="wheel wheel-back-left"></span>
          <span className="wheel wheel-back-right"></span>
        </div>
      </div>

      <main className="content">
        <MotionSection
          className="hero panel hero-panel"
          initial="hidden"
          animate="visible"
          variants={reveal}
        >
          <div className="eyebrow">
            <span className="eyebrow-chip">
              <GiSteeringWheel />
              Cursor-controlled portfolio
            </span>
            <span className="eyebrow-chip">
              <GiPathDistance />
              Full-stack routes
            </span>
          </div>

          <div className="hero-copy">
            <div className="hero-copy-text">
              <p className="kicker">Driving through a bright city of code, cooperation, and creative obsessions.</p>
              <h1>Elijah Sprouse</h1>
              <p className="lede">
                Computer Science senior graduating in May 2026, building full-stack
                apps with React, Node.js, databases, and AWS. Founder and President
                of NAU&apos;s Game Design Club. I'm big on shipping things that feel fun,
                polished, and actually useful, while bringing real communication and
                good energy to the team behind them.
              </p>
            </div>
            <div className="hero-portrait">
              <img src={headshot} alt="Headshot of Elijah Sprouse" />
            </div>
          </div>

          <div className="hero-actions">
            <a
              className="primary-button"
              href={resumePdf}
              target="_blank"
              rel="noreferrer"
            >
              View Resume
              <HiMiniArrowTopRightOnSquare />
            </a>
            <a className="secondary-button" href="#experience-log">
              View experience
            </a>
            <a className="secondary-button" href="#contact-panel">
              Contact
            </a>
            <a
              className="secondary-button"
              href="https://www.linkedin.com/in/elijahsprouse"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
              <HiMiniArrowTopRightOnSquare />
            </a>
            <a
              className="secondary-button"
              href="https://github.com/pizzadogsquared"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
              <HiMiniArrowTopRightOnSquare />
            </a>
          </div>

          <div className="hero-note">
            Keep scrolling to learn more about me!
          </div>
        </MotionSection>

        <section className="stats-grid">
          {stats.map((item, index) => (
            <MotionArticle
              key={item.label}
              className="panel stat-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              variants={reveal}
              custom={index}
            >
              <p className="stat-label">{item.label}</p>
              <h2>{item.value}</h2>
              <p>{item.detail}</p>
            </MotionArticle>
          ))}
        </section>

        <section className="content-grid">
          <MotionArticle
            className="panel mission-panel"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={reveal}
          >
            <p className="section-tag">Main quest</p>
            <h2>Build software that feels smooth, thoughtful, and alive.</h2>
            <p>
              My strongest lanes are frontend craft and full-stack development. I'm comfortable moving
              between UI polish, backend logic, APIs, and deployment work without
              losing sight of the users or teammates on the other side. I
              genuinely love working with people, like talking through ideas, and I do my best
              work on teams that value potential, trust, and clear communication.
            </p>

            <div className="loadout-grid">
              {loadout.map(({ label, icon: Icon }) => (
                <div key={label} className="loadout-chip">
                  {createElement(Icon)}
                  {label}
                </div>
              ))}
            </div>
          </MotionArticle>

          <MotionArticle
            className="panel contact-panel"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={reveal}
            custom={1}
          >
            <p className="section-tag">Player info</p>
            <h2>Based in Arizona, ready for the next co-op campaign.</h2>
            <ul className="link-list">
              <li>
                <HiMiniMapPin />
                Surprise, Arizona
              </li>
              <li>
                <FaLinkedin />
                <a
                  href="https://www.linkedin.com/in/elijahsprouse"
                  target="_blank"
                  rel="noreferrer"
                >
                  linkedin.com/in/elijahsprouse
                </a>
              </li>
              <li>
                <FaGithub />
                <span>GitHub ready for builds, teams, and shipping</span>
              </li>
              <li>
                <FaMusic />
                <span>Bass player, sandbox-game enjoyer, and enthusiastic teammate</span>
              </li>
            </ul>
          </MotionArticle>
        </section>

        <MotionSection
          className="panel stacks-panel"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={reveal}
        >
          <div className="section-header">
            <div>
              <p className="section-tag">Stack map</p>
              <h2>Tools I&apos;m comfortable building with</h2>
            </div>
            <p>
              A quick visual grid of the languages, frameworks, databases, and
              platforms that I'm fluent in.
            </p>
          </div>

          <div className="stacks-grid">
            {familiarStacks.map(({ label, icon: Icon, tone}, index) => (
              <MotionArticle
                key={label}
                className={`stack-card stack-card-${tone}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={reveal}
                custom={index}
              >
                <div className="stack-logo">{createElement(Icon)}</div>
                <h3>{label}</h3>
              </MotionArticle>
            ))}
          </div>
        </MotionSection>

        <MotionSection
          id="experience-log"
          className="panel timeline-panel"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={reveal}
        >
          <div className="section-header">
            <div>
              <p className="section-tag">Recent checkpoints</p>
              <h2>Experience log</h2>
            </div>
            <p>
              Internships spanning frontend feature work, API integration, backend
              refactors, team debugging, and more.
            </p>
          </div>

          <div className="timeline">
            {experience.map((role) => (
              <article key={`${role.company}-${role.range}`} className="timeline-item">
                <div className="timeline-pin"></div>
                <div>
                  <p className="timeline-range">{role.range}</p>
                  <h3>
                    {role.title} <span>@ {role.company}</span>
                  </h3>
                  <ul>
                    {role.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  {role.company === 'Reshape Lab' && role.range.includes('Present') ? (
                    <a
                      className="primary-button project-link"
                      href="https://reshapelab.site"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Visit
                      <HiMiniArrowTopRightOnSquare />
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </MotionSection>

        <MotionSection
          className="projects-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={reveal}
        >
          {projects.map((project, index) => (
            <article key={project.title} className="panel project-card">
              <p className="section-tag">Side quest {index + 1}</p>
              <h2>{project.title}</h2>
              <p className="project-stack">{project.stack}</p>
              <p>{project.description}</p>
              <a
                className="primary-button project-link"
                href={project.href}
                target="_blank"
                rel="noreferrer"
              >
                Visit
                <HiMiniArrowTopRightOnSquare />
              </a>
            </article>
          ))}
        </MotionSection>

        <section className="interests-grid">
          {interests.map(({ title, icon: Icon, detail }, index) => (
            <MotionArticle
              key={title}
              className="panel interest-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={reveal}
              custom={index}
            >
              <div className="interest-icon">{createElement(Icon)}</div>
              <p className="section-tag">Favorite lane</p>
              <h2>{title}</h2>
              <p>{detail}</p>
            </MotionArticle>
          ))}
        </section>

        <MotionSection
          id="contact-panel"
          className="panel final-panel"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={reveal}
        >
          <div>
            <p className="section-tag">Endgame</p>
            <h2>
              Looking for teams that care about clean builds, interesting products,
              and people who make collaboration better.
            </h2>
          </div>
          <p>
            If you need a developer who can bounce between frontend polish, backend
            logic, and collaborative delivery without making the work feel dry, the
            route leads straight to me. Bonus points if your team appreciates
            good conversation, strong teamwork, and the occasional game reference.
          </p>
          <div className="final-contact">
            <a className="primary-button" href="mailto:elijahsprouse1806@gmail.com">
              Contact
              <HiMiniArrowTopRightOnSquare />
            </a>
            <a className="contact-email" href="mailto:elijahsprouse1806@gmail.com">
              elijahsprouse1806@gmail.com
            </a>
          </div>
        </MotionSection>
      </main>
    </div>
  )
}

export default App
