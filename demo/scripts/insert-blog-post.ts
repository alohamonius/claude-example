import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables FIRST
const envPath = path.resolve(__dirname, '../.env')
dotenv.config({ path: envPath })

interface BlogPostData {
  title: string
  content: string
  category?: string
  tags?: Array<{ tag: string }>
  status?: 'draft' | 'published'
}

const insertBlogPost = async (jsonPath: string): Promise<number> => {
  try {
    // Dynamically import Payload AFTER env is loaded
    const { getPayload } = await import('payload')
    const configModule = await import('../src/payload.config.js')
    const config = configModule.default

    // Initialize Payload
    const payload = await getPayload({ config })

    // Read and parse JSON file
    const data: BlogPostData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

    // Validate required fields
    if (!data.title || !data.content) {
      throw new Error('Missing required fields: title and content are required')
    }

    // Insert into database
    const result = await payload.create({
      collection: 'blog',
      data: {
        title: data.title,
        content: data.content,
        category: data.category || null,
        tags: data.tags || [],
        status: data.status || 'draft',
      },
    })

    console.log(`✓ Inserted blog post: "${data.title}" (ID: ${result.id})`)
    return result.id as number
  } catch (error) {
    console.error(`✗ Error inserting blog post:`, error)
    throw error
  }
}

// Main execution
const main = async () => {
  const jsonPath = process.argv[2]

  if (!jsonPath) {
    console.error('Usage: npx tsx insert-blog-post.ts <path-to-json-file>')
    process.exit(1)
  }

  if (!fs.existsSync(jsonPath)) {
    console.error(`File not found: ${jsonPath}`)
    process.exit(1)
  }

  try {
    await insertBlogPost(jsonPath)
    process.exit(0)
  } catch (error) {
    process.exit(1)
  }
}

main()
