import type { MetaFunction } from '@remix-run/node'
import { TiptapEditor } from '../components/tiptap-editor'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'

export const meta: MetaFunction = () => {
  return [
    { title: 'Notebook | Your App Name' },
    { name: 'description', content: 'Take notes with our rich text editor' },
  ]
}

export function handle() {
  return {
    breadcrumb: () => (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Notebook</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
  }
}

export default function NotebookPage() {
  return (
    <div className="rounded-xl bg-card p-6 shadow">
      <h1 className="text-3xl font-bold mb-8">Notebook</h1>
      <TiptapEditor />
    </div>
  )
} 