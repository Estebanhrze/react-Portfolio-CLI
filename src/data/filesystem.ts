import type { VirtualNode } from '../shell/types'

export const fileSystem: VirtualNode = {
  type: 'directory',
  name: '/',
  children: {
    'about-me': {
      type: 'directory',
      name: 'about-me',
      children: {
        'bio.txt': {
          type: 'file',
          name: 'bio.txt',
          content:
            'Frontend Developer enfocado en React, TypeScript y experiencias interactivas. Este portfolio funciona como una terminal navegable para explorar mi trabajo, habilidades y contacto.',
        },
        'experience.txt': {
          type: 'file',
          name: 'experience.txt',
          content:
            'Experiencia creando interfaces modernas, dashboards, automatizaciones web y componentes reutilizables con enfoque en rendimiento, accesibilidad y diseño limpio.',
        },
        'skills.txt': {
          type: 'file',
          name: 'skills.txt',
          content: [
            'Java',
            'Spring Boot',
            'Python',
            'FastAPI',
            'React',
            'Astro',
            'TypeScript',
            'JavaScript',
            'PostgreSQL',
            'Node.js',
            'Docker',
            'Git',
            'UI Engineering',
            'Debugging',
            'Testing',
          ].join('\n'),
        },
        'education.txt': {
          type: 'file',
          name: 'education.txt',
          content:
            'Aprendizaje continuo en frontend avanzado, arquitectura de aplicaciones, sistemas CLI y diseño de experiencias digitales.',
        },
      },
    },
    projects: {
      type: 'directory',
      name: 'projects',
      children: {
        'portfolio-cli': {
          type: 'directory',
          name: 'portfolio-cli',
          children: {
            'README.md': {
              type: 'file',
              name: 'README.md',
              content:
                '# Portfolio CLI\nTerminal interactiva construida con React que simula navegacion Unix sobre un filesystem virtual.',
            },
            'description.txt': {
              type: 'file',
              name: 'description.txt',
              content: 'Terminal desarrollada en React inspirada en macOS, con comandos, historial y cursor personalizado.',
            },
            'stack.txt': {
              type: 'file',
              name: 'stack.txt',
              content: ['React', 'TypeScript', 'Vite', 'CSS Modules mental model'].join('\n'),
            },
            'demo.url': {
              type: 'link',
              name: 'demo.url',
              target: 'https://example.com',
              content: 'https://example.com',
            },
            'github.url': {
              type: 'link',
              name: 'github.url',
              target: 'https://github.com/',
              content: 'https://github.com/',
            },
          },
        },
        dashboard: {
          type: 'directory',
          name: 'dashboard',
          children: {
            'description.txt': {
              type: 'file',
              name: 'description.txt',
              content: 'Dashboard administrativo con metricas, filtros y visualizacion clara de datos.',
            },
            'stack.txt': { type: 'file', name: 'stack.txt', content: 'React\nTypeScript\nCharts\nREST API' },
          },
        },
        ecommerce: {
          type: 'directory',
          name: 'ecommerce',
          children: {
            'description.txt': { type: 'file', name: 'description.txt', content: 'Tienda online con catalogo, carrito y flujo de compra.' },
            'stack.txt': { type: 'file', name: 'stack.txt', content: 'React\nNode.js\nPostgreSQL\nStripe' },
          },
        },
        'ai-chat': {
          type: 'directory',
          name: 'ai-chat',
          children: {
            'description.txt': { type: 'file', name: 'description.txt', content: 'Chat experimental con IA, streaming de respuestas y memoria de conversacion.' },
            'stack.txt': { type: 'file', name: 'stack.txt', content: 'React\nTypeScript\nOpenAI API\nEdge Functions' },
          },
        },
      },
    },
    cheatsheets: {
      type: 'directory',
      name: 'cheatsheets',
      children: {
        'react.pdf': { type: 'pdf', name: 'react.pdf', target: '/pdfs/react.pdf' },
        'git.pdf': { type: 'pdf', name: 'git.pdf', target: '/pdfs/git.pdf' },
        'docker.pdf': { type: 'pdf', name: 'docker.pdf', target: '/pdfs/docker.pdf' },
        'linux.pdf': { type: 'pdf', name: 'linux.pdf', target: '/pdfs/linux.pdf' },
        'typescript.pdf': { type: 'pdf', name: 'typescript.pdf', target: '/pdfs/typescript.pdf' },
      },
    },
    contact: {
      type: 'directory',
      name: 'contact',
      children: {
        'github.txt': { type: 'link', name: 'github.txt', target: 'https://github.com/Estebanhrze', content: 'https://github.com/Estebanhrze/' },
        'linkedin.txt': { type: 'link', name: 'linkedin.txt', target: 'https://www.linkedin.com/in/esteban-hernandez-333964420/', content: 'https://www.linkedin.com/in/esteban-hernandez-333964420/' },
      },
    },
    resume: {
      type: 'directory',
      name: 'resume',
      children: {
        'cv.pdf': { type: 'pdf', name: 'cv.pdf', target: '/pdfs/cv.pdf' },
      },
    },
  },
}
