import { notFound } from "next/navigation"
import { getProjectById, getAllProjects } from "@/data/projects"
import ProjectDetailClient from "./ProjectDetailClient"

// Generate metadata for each project page
export async function generateMetadata({ params }) {
  const project = getProjectById(params.id)

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
  const allProjects = getAllProjects()
  return allProjects.map((project) => ({
    id: project.id,
  }))
}

export default function ProjectPage({ params }) {
  const project = getProjectById(params.id)

  if (!project) {
    notFound()
  }

  return <ProjectDetailClient project={project} />
}
