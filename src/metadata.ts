import { getProject } from './projects';

export interface PageMetadata {
  title: string;
  description: string;
  robots: string;
}

/** Keep initial static HTML and subsequent browser navigation in agreement. */
export function getPageMetadata(route: string): PageMetadata {
  const path = route.split(/[?#]/, 1)[0].replace(/\/+$/, '') || '/';
  const robots = 'noindex, follow';

  if (path === '/') {
    return {
      title: 'Long Phi Nguyen · Living Showcase',
      description: 'Long Phi Nguyen’s portfolio in progress. Explore three fictional interactive concepts, ready for real project content.',
      robots,
    };
  }

  if (path === '/about') {
    return {
      title: 'About · Long Phi Nguyen',
      description: 'A space for Long Phi Nguyen’s personal introduction. Biography content is a placeholder until verified information is provided.',
      robots,
    };
  }

  const project = path.startsWith('/work/') ? getProject(path.slice(6)) : undefined;
  if (project) {
    return {
      title: `${project.title} concept · Long Phi Nguyen`,
      description: `Explore ${project.title}, a fictional ${project.category.toLowerCase()}. Interactive demo and placeholder case study for Long Phi Nguyen’s portfolio.`,
      robots,
    };
  }

  return {
    title: 'Page not found · Long Phi Nguyen',
    description: 'This portfolio page could not be found. Return to the collection of fictional placeholder concepts.',
    robots: 'noindex, nofollow',
  };
}
