import { notFound } from "next/navigation"
import samplesData from "@/data/samples.json"
import SampleDetailClient from "./SampleDetailClient"

const { samples } = samplesData

export async function generateStaticParams() {
  return samples.map(sample => ({
    id: sample.id,
  }))
}

export async function generateMetadata({ params }) {
  const sample = samples.find(s => s.id === params.id)

  if (!sample) {
    return {
      title: "Sample not found",
    }
  }

  return {
    title: `${sample.title} | شركة دراية`,
    description: sample.description,
  }
}

export default function Page({ params }) {
  const sample = samples.find(s => s.id === params.id)

  if (!sample) {
    notFound()
  }

  return <SampleDetailClient id={params.id} />
}
