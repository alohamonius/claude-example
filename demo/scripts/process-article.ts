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

const processArticle = async (jsonPath: string): Promise<void> => {
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

    // Move file to processed directory
    const processedDir = path.resolve(__dirname, '../content-generated/processed')

    // Create processed directory if it doesn't exist
    if (!fs.existsSync(processedDir)) {
      fs.mkdirSync(processedDir, { recursive: true })
      console.log(`✓ Created processed directory: ${processedDir}`)
    }

    const fileName = path.basename(jsonPath)
    const processedPath = path.join(processedDir, fileName)

    fs.renameSync(jsonPath, processedPath)
    console.log(`✓ Moved file to: ${processedPath}`)
    console.log(`\nDatabase ID: ${result.id}`)
  } catch (error) {
    console.error(`✗ Error processing article:`, error)
    throw error
  }
}

// Main execution
const main = async () => {
  const jsonPath = process.argv[2]

  if (!jsonPath) {
    console.error('Usage: npx tsx process-article.ts <path-to-json-file>')
    process.exit(1)
  }

  if (!fs.existsSync(jsonPath)) {
    console.error(`File not found: ${jsonPath}`)
    process.exit(1)
  }

  try {
    await processArticle(jsonPath)
    process.exit(0)
  } catch (error) {
    process.exit(1)
  }
}

main()
