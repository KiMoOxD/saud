import { notFound } from "next/navigation"
// UPDATED: Changed to a default import
import projectsData from "@/data/projectsData.json"
import ProjectDetailClient from "./ProjectDetailClient"

// Access the projects array from the imported data
const projects = projectsData.projects;

// Generate metadata for each project page
export async function generateMetadata({ params }) {
  const paramsData = await params;
  const project = projects.find(p => p.id === paramsData.id)

  if (!project) {
    return {
      title: "المشروع غير موجود",
      description: "عذراً، المشروع الذي تبحث عنه غير موجود.",
    }
  }

  return {
    title: `${project.project_name} | استشارات الخليج`,
    description: project.description.substring(0, 160),
  }
}

// Generate static paths for all projects
export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }))
}

export default async function ProjectPage({ params }) {
  const paramsData = await params;
  const project = projects.find(p => p.id === paramsData.id)

  if (!project) {
    notFound()
  }

  return <ProjectDetailClient project={project} />
}